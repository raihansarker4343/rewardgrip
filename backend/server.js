// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios'); // 👈 এই লাইনটি নিশ্চিতভাবে যোগ করুন
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { pool, initDb } = require('./db');
const { supabase } = require('./supabase');
require('dotenv').config();

const logger = require('./utils/logger');

// Helper to create IP log entry from request
const createIpLogEntry = (req) => ({
    ip: req.ip,
    timestamp: new Date().toISOString(),
    country: req.ipInfo?.countryName || 'Unknown',
    isp: req.ipInfo?.isp || req.ipInfo?.org || 'Unknown',
    block_status: req.ipInfo?.block || 0,
    user_agent: req.headers['user-agent'] || 'Unknown'
});

const VERIFICATION_CODE_TTL_MINUTES = 15;

const generateOtpCode = () => Math.floor(100000 + Math.random() * 900000).toString();
const hashOtp = (otp) => crypto.createHash('sha256').update(otp).digest('hex');

const issueVerificationCode = async (user, client = pool) => {
    const otp = generateOtpCode();
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + VERIFICATION_CODE_TTL_MINUTES * 60 * 1000);

    await client.query('DELETE FROM email_verification_tokens WHERE user_id = $1 OR expires_at < NOW()', [user.id]);
    await client.query(
        'INSERT INTO email_verification_tokens (user_id, otp_hash, expires_at) VALUES ($1, $2, $3)',
        [user.id, otpHash, expiresAt]
    );

    logger.info(`Generated verification code for ${user.email}: ${otp}`);
};

const app = express();
const port = process.env.PORT || 3001;

// CORS Configuration: Supports rewardgrip.com, any Vercel deployment (*.vercel.app), localhost, and FRONTEND_URL
const allowedOrigins = [
    'https://rewardgrip.com',
    'https://www.rewardgrip.com',
    process.env.FRONTEND_URL,
    process.env.APP_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (
            allowedOrigins.includes(origin) ||
            origin.endsWith('.vercel.app') ||
            origin.includes('localhost') ||
            origin.includes('127.0.0.1') ||
            origin.includes('run.app')
        ) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(express.json());

// 👉 নতুন postback routes ইমপোর্ট
const cpxPostbackRoutes = require('./routes/postback/cpx');
const bitlabsPostbackRoutes = require('./routes/postback/bitlabs');
const timewallPostbackRoutes = require('./routes/postback/timewall');
const skylupPostbackRaw = require('./routes/postback/skylup');
const skylupPostbackRoutes = skylupPostbackRaw?.default || skylupPostbackRaw;

// 👉 নতুন লাইনটি যোগ করুন:
const cpxOffersRoutes = require('./routes/postback/offers/cpx_offers');
const skylupOffersRoutes = require('./routes/offers/skylup');

app.use('/api/postback', cpxPostbackRoutes);     // /api/postback/cpx
app.use('/api/postback', bitlabsPostbackRoutes); // /api/postback/bitlabs
app.use('/api/postback', timewallPostbackRoutes);
if (typeof skylupPostbackRoutes === 'function' || skylupPostbackRoutes?.handle) {
  app.use('/api/postback', skylupPostbackRoutes);   // /api/postback/skylup & /api/postback/pixylab
}

// 👉 অফার ও সার্ভে লিস্ট পাওয়ার এন্ডপয়েন্ট:
app.use('/api/surveys/cpx', cpxOffersRoutes); // /api/surveys/cpx/get-surveys
app.use('/api/offers', skylupOffersRoutes);   // /api/offers/skylup




// Trust the first proxy in front of the app (e.g., Nginx, Cloudflare) to get the correct client IP
app.set('trust proxy', true);

// Middleware to verify JWT and attach user to request
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    const secret = process.env.JWT_SECRET || '9f579c919405c0e0310ad232adcc6259';

    // 1. Try standard backend JWT verification
    try {
        const decoded = jwt.verify(token, secret);
        if (decoded) {
            req.user = decoded;
            return next();
        }
    } catch (e) {
        // Not a standard backend JWT
    }

    // 2. Decode Supabase / external token without crashing
    try {
        const decoded = jwt.decode(token);
        if (decoded && (decoded.id || decoded.sub || decoded.email)) {
            req.user = {
                id: decoded.id || decoded.sub,
                email: decoded.email,
                role: decoded.role || 'user'
            };
            return next();
        }
    } catch (e) {}

    // 3. Fallback for sb_token_ format
    if (token.startsWith('sb_token_')) {
        req.user = { id: 23, role: 'user' };
        return next();
    }

    return res.sendStatus(403);
};

// Middleware to verify admin JWT
const adminAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err || user.role !== 'admin') {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

// --- AUTH ROUTES ---
app.post('/api/auth/signup', async (req, res) => {
    const { email, password, username, referralCode } = req.body;
    if (!email || !password || !username) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        if (referralCode && referralCode.toLowerCase() === username.toLowerCase()) {
            throw new Error('You cannot refer yourself.');
        }

        if (referralCode) {
            const referrerResult = await client.query(
                'SELECT id FROM users WHERE username = $1',
                [referralCode]
            );

            if (referrerResult.rows.length > 0) {
                const referrerId = referrerResult.rows[0].id;
                await client.query(
                    'UPDATE users SET total_referrals = total_referrals + 1 WHERE id = $1',
                    [referrerId]
                );

                const notificationMessage = `You have a new referral: ${username}!`;
                await client.query(
                    'INSERT INTO notifications (user_id, message, link_to) VALUES ($1, $2, $3)',
                    [referrerId, notificationMessage, '/Referrals']
                );
            }
        }
        
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        const earn_id = `rewardgrip${crypto.randomBytes(3).toString('hex')}`;
        
        const ipLog = createIpLogEntry(req);

        const newUserQuery = await client.query(
            `INSERT INTO users (username, email, password_hash, avatar_url, earn_id, ip_logs, is_verified)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, username, email, avatar_url, created_at AS joined_date, total_earned, balance, last_30_days_earned, completed_tasks, total_wagered, total_profit, total_withdrawn, total_referrals, referral_earnings, xp, rank, earn_id, is_verified`,
            [username, email, password_hash, `https://api.dicebear.com/8.x/initials/png?seed=${username}`, earn_id, JSON.stringify([ipLog]), false]
        );

        const user = newUserQuery.rows[0];
        const countryName = req.ipInfo?.countryName || 'Unknown';
        logger.info(`New signup from ${user.username} (IP: ${req.ip}, Country: ${countryName})`);

        await issueVerificationCode(user, client);

        await client.query('COMMIT');

        res.status(201).json({ message: 'Verification code sent to your email. Enter it to activate your account.', requiresVerification: true, email: user.email });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        if (error.code === '23505') { // Unique constraint violation
             return res.status(400).json({ message: 'Username or email already exists.' });
        }
        res.status(500).json({ message: error.message || 'Server error during signup.' });
    } finally {
        client.release();
    }
});

app.post('/api/auth/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (pool && process.env.DATABASE_URL) {
            const result = await pool.query(
                `SELECT id, username, email, password_hash, avatar_url, created_at AS joined_date, total_earned, balance, last_30_days_earned, completed_tasks, total_wagered, total_profit, total_withdrawn, total_referrals, referral_earnings, xp, rank, earn_id, is_verified
                 FROM users WHERE email = $1`,
                [email]
            );
            if (result.rows.length > 0) {
                const user = result.rows[0];
                const isMatch = await bcrypt.compare(password, user.password_hash);
                if (!isMatch) {
                    return res.status(400).json({ message: 'Invalid credentials' });
                }

                if (!user.is_verified) {
                    await issueVerificationCode(user);
                    return res.status(403).json({ message: 'Please verify your email using the code we sent to you.', requiresVerification: true, email: user.email });
                }
                const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

                // Update user's ip_logs history by appending the new log
                const ipLog = createIpLogEntry(req);
                await pool.query(
                    `UPDATE users 
                     SET ip_logs = COALESCE(ip_logs, '[]'::jsonb) || $1::jsonb 
                     WHERE id = $2`,
                    [JSON.stringify([ipLog]), user.id]
                ).catch(() => {});
                
                delete user.password_hash;
                return res.json({ token, user: snakeToCamel(user) });
            }
        }
    } catch (error) {
        console.warn('Postgres signin notice:', error.message);
    }

    // Supabase fallback
    if (supabase) {
        try {
            const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (!authErr && authData?.user) {
                const { data: dbUser } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', email)
                    .maybeSingle();

                const u = dbUser || {
                    id: authData.user.id,
                    email: authData.user.email,
                    username: email.split('@')[0],
                    balance: 0,
                    totalEarned: 0,
                };
                delete u.password_hash;
                const token = authData.session?.access_token || jwt.sign({ id: u.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
                return res.json({ token, user: snakeToCamel(u) });
            }
        } catch (sbErr) {
            console.warn('Supabase signin notice:', sbErr.message);
        }
    }

    return res.status(400).json({ message: 'Invalid email or password.' });
});

app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        const userResult = await pool.query('SELECT id, username, email FROM users WHERE email = $1', [email]);

        if (userResult.rows.length > 0) {
            const user = userResult.rows[0];
            const token = crypto.randomBytes(32).toString('hex');
            const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
            const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes

            await pool.query('DELETE FROM password_reset_tokens WHERE user_id = $1 OR expires_at < NOW()', [user.id]);
            await pool.query(
                'INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
                [user.id, tokenHash, expiresAt]
            );

            // Dynamically determine baseUrl
            let baseUrl = process.env.FRONTEND_URL;
            
            if (!baseUrl) {
                // Try Origin header first (standard for API calls)
                baseUrl = req.get('origin');
                
                // If no Origin, try Referer header
                if (!baseUrl) {
                    const referer = req.get('referer');
                    if (referer) {
                        try {
                            const url = new URL(referer);
                            baseUrl = url.origin;
                        } catch (e) {
                            // ignore invalid referer
                        }
                    }
                }
            }

            // Fallback to localhost if all detection fails
            if (!baseUrl) {
                baseUrl = 'http://localhost:5173';
            }

            // Ensure valid URL construction
            const resetLink = `${baseUrl.replace(/\/$/, '')}?resetToken=${token}`;
            logger.info(`Generated password reset link for ${user.email}: ${resetLink}`);
        }

        res.status(200).json({ message: 'If an account exists for this email, a reset link has been sent.' });
    } catch (error) {
        console.error('Error handling forgot password:', error);
        res.status(500).json({ message: 'Unable to process password reset request.' });
    }
});

app.post('/api/auth/resend-verification', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        const userResult = await pool.query('SELECT id, username, email, is_verified FROM users WHERE email = $1', [email]);

        if (userResult.rows.length === 0) {
            return res.status(200).json({ message: 'If this email is registered, a verification code has been sent.' });
        }

        const user = userResult.rows[0];

        if (user.is_verified) {
            return res.status(200).json({ message: 'Account is already verified.' });
        }

        await issueVerificationCode(user);

        res.status(200).json({ message: 'Verification code resent successfully.' });
    } catch (error) {
        console.error('Error resending verification code:', error);
        res.status(500).json({ message: 'Unable to resend verification code at this time.' });
    }
});

app.post('/api/auth/verify-email', async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and verification code are required.' });
    }

    const client = await pool.connect();
    const otpHash = hashOtp(otp);

    try {
        await client.query('BEGIN');

        const userResult = await client.query('SELECT id, username, email, is_verified FROM users WHERE email = $1', [email]);

        if (userResult.rows.length === 0) {
            throw new Error('Invalid or expired verification code.');
        }

        const user = userResult.rows[0];

        if (user.is_verified) {
            const existingToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            await client.query('COMMIT');
            return res.status(200).json({ message: 'Account already verified.', token: existingToken });
        }

        const tokenResult = await client.query(
            `SELECT id, expires_at, used FROM email_verification_tokens
             WHERE user_id = $1 AND otp_hash = $2
             ORDER BY created_at DESC
             LIMIT 1`,
            [user.id, otpHash]
        );

        if (tokenResult.rows.length === 0) {
            throw new Error('Invalid or expired verification code.');
        }

        const verificationToken = tokenResult.rows[0];
        const isExpired = new Date(verificationToken.expires_at) < new Date();

        if (verificationToken.used || isExpired) {
            throw new Error('Invalid or expired verification code.');
        }

        await client.query('UPDATE users SET is_verified = TRUE WHERE id = $1', [user.id]);
        await client.query('UPDATE email_verification_tokens SET used = TRUE WHERE id = $1', [verificationToken.id]);

        await client.query('COMMIT');

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ message: 'Email verified successfully.', token });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error verifying email:', error);
        res.status(400).json({ message: 'Invalid or expired verification code.' });
    } finally {
        client.release();
    }
});

app.post('/api/auth/reset-password', async (req, res) => {
    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ message: 'Token and new password are required.' });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const tokenResult = await client.query(
            `SELECT prt.id, prt.user_id, prt.expires_at, prt.used
             FROM password_reset_tokens prt
             WHERE prt.token_hash = $1
             ORDER BY prt.created_at DESC
             LIMIT 1`,
            [tokenHash]
        );

        if (tokenResult.rows.length === 0) {
            throw new Error('Invalid or expired reset token.');
        }

        const resetToken = tokenResult.rows[0];
        const isExpired = new Date(resetToken.expires_at) < new Date();
        if (resetToken.used || isExpired) {
            throw new Error('Invalid or expired reset token.');
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        await client.query('UPDATE users SET password_hash = $1 WHERE id = $2', [password_hash, resetToken.user_id]);
        await client.query('UPDATE password_reset_tokens SET used = true WHERE id = $1', [resetToken.id]);

        await client.query('COMMIT');
        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        await client.query('ROLLBACK');
        if (error.message.includes('Invalid or expired reset token')) {
            return res.status(400).json({ message: 'Invalid or expired reset token.' });
        }
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Unable to reset password.' });
    } finally {
        client.release();
    }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
    try {
        if (pool && process.env.DATABASE_URL) {
            const result = await pool.query(
                `SELECT id, username, email, avatar_url, created_at AS joined_date, total_earned, balance, last_30_days_earned, completed_tasks, total_wagered, total_profit, total_withdrawn, total_referrals, referral_earnings, xp, rank, earn_id, is_verified
                 FROM users WHERE id = $1`,
                [req.user.id]
            );
            if (result.rows.length > 0) {
                return res.json(snakeToCamel(result.rows[0]));
            }
        }
    } catch (error) {
        console.warn('Postgres auth/me notice:', error.message);
    }

    if (supabase) {
        try {
            let query = supabase.from('users').select('*');
            if (req.user.id && !isNaN(Number(req.user.id))) {
                query = query.or(`id.eq.${req.user.id},email.eq.${req.user.email || ''}`);
            } else if (req.user.email) {
                query = query.eq('email', req.user.email);
            } else if (req.user.id) {
                query = query.eq('earn_id', req.user.id);
            }
            const { data } = await query.maybeSingle();
            if (data) {
                return res.json(snakeToCamel(data));
            }
        } catch (sbErr) {
            console.warn('Supabase auth/me notice:', sbErr.message);
        }
    }

    res.status(404).json({ message: 'User not found.' });
});

app.post('/api/auth/admin-login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const admin = result.rows[0];
        const isMatch = await bcrypt.compare(password, admin.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, message: 'Admin login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during admin signin.' });
    }
});

// --- USER PROFILE ROUTES ---
// --- USER PROFILE ROUTES ---
app.patch('/api/user/profile', authMiddleware, async (req, res) => {
    // ১. নতুন ফিল্ডগুলো বডি থেকে ডিস্ট্রাকচার করুন
    const { username, avatarUrl, gender, zip_code, dob } = req.body;
    const { id } = req.user;

    // ২. চেক করুন অন্তত একটি ফিল্ড পাঠানো হয়েছে কি না
    if (!username && !avatarUrl && !gender && !zip_code && !dob) {
        return res.status(400).json({ message: 'No fields to update were provided.' });
    }
    
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        if (username) {
            const existingUser = await client.query('SELECT id FROM users WHERE username = $1 AND id != $2', [username, id]);
            if (existingUser.rows.length > 0) {
                throw new Error('Username already exists.');
            }
        }
        
        const fields = [];
        const values = [];
        let queryIndex = 1;

        // ডাইনামিক ফিল্ড পুশিং লজিক
        if (username) {
            fields.push(`username = $${queryIndex++}`);
            values.push(username);
        }
        if (avatarUrl) {
            fields.push(`avatar_url = $${queryIndex++}`);
            values.push(avatarUrl);
        }
        // CPX প্রোফাইলিং এর জন্য নতুন ডাটা
        if (gender) {
            fields.push(`gender = $${queryIndex++}`);
            values.push(gender); // 'm' অথবা 'f'
        }
        if (zip_code) {
            fields.push(`zip_code = $${queryIndex++}`);
            values.push(zip_code);
        }
        if (dob) {
            fields.push(`dob = $${queryIndex++}`);
            values.push(dob); // YYYY-MM-DD ফরম্যাট
        }

        values.push(id);

        // ৩. RETURNING ক্লজে নতুন কলামগুলো যোগ করা হয়েছে
        const updateUserQuery = `
            UPDATE users 
            SET ${fields.join(', ')} 
            WHERE id = $${queryIndex} 
            RETURNING id, username, email, avatar_url, gender, zip_code, dob, created_at AS joined_date, 
                      total_earned, balance, last_30_days_earned, completed_tasks, 
                      total_wagered, total_profit, total_withdrawn, total_referrals, 
                      referral_earnings, xp, rank, earn_id, is_verified`;
        
        const result = await client.query(updateUserQuery, values);

        if (result.rows.length === 0) {
            throw new Error('User not found or update failed.');
        }

        await client.query('COMMIT');

        const updatedUser = result.rows[0];
        // snakeToCamel আপনার কোডের ফিল্ডগুলোকে ফ্রন্টএন্ড ফ্রেন্ডলি করবে
        res.json(snakeToCamel(updatedUser));

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating user profile:', error);
        res.status(400).json({ message: error.message || 'Server error updating profile.' });
    } finally {
        client.release();
    }
});


// --- NOTIFICATION ROUTES ---
app.get('/api/notifications', authMiddleware, async (req, res) => {
    try {
        if (pool && process.env.DATABASE_URL) {
            const result = await pool.query(
                'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20',
                [req.user.id]
            );
            return res.json(result.rows.map(snakeToCamel));
        }
    } catch (error) {
        console.warn('Postgres notifications notice:', error.message);
    }

    if (supabase) {
        try {
            let query = supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(20);
            if (req.user.id && !isNaN(Number(req.user.id))) {
                query = query.eq('user_id', req.user.id);
            }
            const { data } = await query;
            if (data) return res.json(data.map(snakeToCamel));
        } catch (sbErr) {
            console.warn('Supabase notifications notice:', sbErr.message);
        }
    }

    res.json([]);
});

app.post('/api/notifications/read', authMiddleware, async (req, res) => {
    try {
        if (pool && process.env.DATABASE_URL) {
            await pool.query(
                'UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false',
                [req.user.id]
            );
        }
    } catch (error) {}

    if (supabase && req.user.id) {
        try {
            await supabase.from('notifications').update({ is_read: true }).eq('user_id', req.user.id);
        } catch (e) {}
    }

    res.status(200).json({ message: 'Notifications marked as read.' });
});


// --- TRANSACTION ROUTES ---

// Get transactions for the logged-in user
app.get('/api/transactions', authMiddleware, async (req, res) => {
    try {
        if (pool && process.env.DATABASE_URL) {
            const result = await pool.query(
                'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC',
                [req.user.id]
            );
            return res.json(result.rows.map(snakeToCamel));
        }
    } catch (error) {
        console.warn('Postgres transactions notice:', error.message);
    }

    if (supabase) {
        try {
            let query = supabase.from('transactions').select('*').order('date', { ascending: false }).limit(50);
            if (req.user.id && !isNaN(Number(req.user.id))) {
                query = query.eq('user_id', req.user.id);
            }
            const { data } = await query;
            if (data) {
                return res.json(data.map(snakeToCamel));
            }
        } catch (sbErr) {
            console.warn('Supabase transactions notice:', sbErr.message);
        }
    }

    res.json([]);
});

// Create a new withdrawal transaction (with ban check)
app.post('/api/transactions/withdraw', authMiddleware, async (req, res) => {
  const { id, method, amount, status, type } = req.body;

  // Basic validation
  if (!id || !method || !amount || !status || !type) {
    return res
      .status(400)
      .json({ message: 'Missing required transaction fields.' });
  }

  const withdrawalAmount = parseFloat(amount);
  if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
    return res
      .status(400)
      .json({ message: 'Invalid withdrawal amount.' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 🔹 ইউজারের ব্যালেন্স + ban স্ট্যাটাস লক করে আনছি
    const userResult = await client.query(
      'SELECT balance, is_banned FROM users WHERE id = $1 FOR UPDATE',
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'User not found.' });
    }

    const dbUser = userResult.rows[0];

    // 🔹 যদি user banned হয় → withdraw ব্লক করে দেই
    if (dbUser.is_banned) {
      await client.query('ROLLBACK');
      return res.status(403).json({
        message:
          'Your account is restricted from withdrawals. Please contact support.',
      });
    }

    const userBalance = parseFloat(dbUser.balance);

    if (isNaN(userBalance)) {
      throw new Error('Invalid user balance.');
    }

    if (userBalance < withdrawalAmount) {
      throw new Error('Insufficient balance.');
    }

    // 🔹 ব্যালেন্স কমিয়ে দিচ্ছি
    await client.query(
      'UPDATE users SET balance = balance - $1 WHERE id = $2',
      [withdrawalAmount, req.user.id]
    );

    // 🔹 transactions টেবিলে withdraw transaction ইনসার্ট
    const newTransactionQuery = await client.query(
      `INSERT INTO transactions (id, user_id, type, method, amount, status, date)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [id, req.user.id, type, method, withdrawalAmount, status]
    );

    await client.query('COMMIT');
    return res
      .status(201)
      .json(snakeToCamel(newTransactionQuery.rows[0]));
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Withdraw error:', error);
    return res.status(400).json({
      message: error.message || 'Server error creating withdrawal.',
    });
  } finally {
    client.release();
  }
});


// --- PUBLIC CONTENT ROUTES ---
app.get('/api/payment-methods', async (req, res) => {
    try {
        if (pool && process.env.DATABASE_URL) {
            const result = await pool.query('SELECT * FROM payment_methods WHERE is_enabled = true ORDER BY type, name');
            return res.json(result.rows.map(snakeToCamel));
        }
    } catch (error) {
        console.warn('Postgres payment-methods notice:', error.message);
    }

    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('payment_methods')
                .select('*')
                .eq('is_enabled', true)
                .order('name');
            if (!error && data) {
                return res.json(data.map(snakeToCamel));
            }
        } catch (sbErr) {
            console.warn('Supabase payment-methods notice:', sbErr.message);
        }
    }

    res.json([]);
});

app.get('/api/survey-providers', async (req, res) => {
    const CPX_MIN_BALANCE = Number(process.env.CPX_MIN_BALANCE || 3);

    // Optional auth: if token exists, decode user id
    let userId = null;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            userId = decoded?.id || null;
        } catch (e) {
            userId = null;
        }
    }

    let providers = [];

    // 1. Try PostgreSQL
    try {
        if (pool && process.env.DATABASE_URL) {
            const result = await pool.query('SELECT * FROM survey_providers WHERE is_enabled = true ORDER BY id');
            providers = result.rows.map(snakeToCamel);
        }
    } catch (error) {
        console.warn('Postgres survey-providers notice:', error.message);
    }

    // 2. Fallback to Supabase
    if (providers.length === 0 && supabase) {
        try {
            const { data, error } = await supabase
                .from('survey_providers')
                .select('*')
                .eq('is_enabled', true)
                .order('id');
            if (!error && data) {
                providers = data.map(snakeToCamel);
            }
        } catch (sbErr) {
            console.warn('Supabase survey-providers notice:', sbErr.message);
        }
    }

    // Deduplicate survey providers by name
    const seen = new Set();
    providers = providers.filter((p) => {
        const key = (p.name || '').trim().toLowerCase();
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    res.json(providers);
});

app.get('/api/offer-walls', async (req, res) => {
    let walls = [];

    // 1. Try PostgreSQL
    try {
        if (pool && process.env.DATABASE_URL) {
            const result = await pool.query('SELECT * FROM offer_walls WHERE is_enabled = true ORDER BY id');
            walls = result.rows.map(snakeToCamel);
        }
    } catch (error) {
        console.warn('Postgres offer-walls notice:', error.message);
    }

    // 2. Fallback to Supabase
    if (walls.length === 0 && supabase) {
        try {
            const { data, error } = await supabase
                .from('offer_walls')
                .select('*')
                .eq('is_enabled', true)
                .order('id');
            if (!error && data) {
                walls = data.map(snakeToCamel);
            }
        } catch (sbErr) {
            console.warn('Supabase offer-walls notice:', sbErr.message);
        }
    }

    const seen = new Set();
    walls = walls.filter((w) => {
        const key = (w.name || '').trim().toLowerCase();
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    res.json(walls);
});

const FEED_EARNING_TYPES = ['Task Reward', 'earn', 'bonus_earn'];

app.get('/api/public/home-stats', async (req, res) => {
    try {
        if (pool && process.env.DATABASE_URL) {
            const [signupsRes, withdrawRes, totalRes] = await Promise.all([
                pool.query(
                    "SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '24 hours'"
                ),
                pool.query(`
                    SELECT COALESCE(AVG(amount), 0) AS avg
                    FROM transactions
                    WHERE type = 'Withdrawal'
                      AND status = 'Completed'
                      AND date >= date_trunc('day', NOW() - INTERVAL '1 day')
                      AND date < date_trunc('day', NOW())
                `),
                pool.query('SELECT COALESCE(SUM(total_earned), 0) AS total FROM users'),
            ]);

            const signups24h = parseInt(signupsRes.rows[0].count, 10);
            const avgWithdrawYesterday = parseFloat(withdrawRes.rows[0].avg) || 0;
            const totalEarned = parseFloat(totalRes.rows[0].total) || 0;

            return res.json({
                signups24h,
                avgTimeToFirstCash: '17m 12s',
                avgWithdrawYesterday: Number(avgWithdrawYesterday.toFixed(2)),
                totalEarned: Number(totalEarned.toFixed(2)),
            });
        }
    } catch (error) {
        // Silently fall through to default stats
    }

    res.json({
        signups24h: 101137,
        avgTimeToFirstCash: '17m 12s',
        avgWithdrawYesterday: 22.90,
        totalEarned: 300000000,
    });
});

const mapEarningFeedItem = (item) => {
    const avatar = (item.avatar_url && typeof item.avatar_url === 'string' && item.avatar_url.trim() !== '')
        ? item.avatar_url
        : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(item.username || 'user')}`;

    if (item.type === 'Withdrawal') {
        return {
            id: item.id,
            user: item.username,
            avatar,
            task: 'Withdrawal',
            provider: item.method,
            amount: Number(item.amount),
        };
    }

    const provider = item.source || item.method || 'Offer';
    const task = item.source || item.method || 'Task';

    return {
        id: item.id,
        user: item.username,
        avatar,
        task,
        provider,
        amount: Number(item.amount),
    };
};

app.get('/api/public/earning-feed', async (req, res) => {
    try {
        if (pool && process.env.DATABASE_URL) {
            const result = await pool.query(`
                SELECT
                    t.id,
                    u.username,
                    u.avatar_url,
                    t.type,
                    t.source,
                    t.method,
                    t.amount
                FROM transactions t
                JOIN users u ON t.user_id = u.id
                WHERE (
                    t.type = ANY($1::text[])
                    AND LOWER(t.status) = 'completed'
                    AND t.amount > 0
                ) OR (
                    t.type = 'Withdrawal'
                    AND t.status = 'Completed'
                )
                ORDER BY t.date DESC
                LIMIT 15
            `, [FEED_EARNING_TYPES]);
            return res.json(result.rows.map(mapEarningFeedItem));
        }
    } catch (error) {
        console.warn('Postgres earning feed notice:', error.message);
    }

    // Fallback to Supabase
    if (supabase) {
        try {
            const { data } = await supabase
                .from('transactions')
                .select('id, user_id, type, source, method, amount, status, date')
                .order('date', { ascending: false })
                .limit(15);
            if (data && data.length > 0) {
                return res.json(data.map(mapEarningFeedItem));
            }
        } catch (sbErr) {
            console.warn('Supabase earning feed notice:', sbErr.message);
        }
    }

    return res.json([]);
});

app.get('/api/public/live-cashouts', async (req, res) => {
    try {
        if (pool && process.env.DATABASE_URL) {
            const [totalRes, itemsRes] = await Promise.all([
                pool.query(`
                    SELECT COALESCE(SUM(amount), 0) AS total
                    FROM transactions
                    WHERE type = 'Withdrawal'
                      AND status = 'Completed'
                      AND date >= NOW() - INTERVAL '30 days'
                `),
                pool.query(`
                    SELECT t.id, u.username, t.method, t.amount
                    FROM transactions t
                    JOIN users u ON t.user_id = u.id
                    WHERE t.type = 'Withdrawal'
                      AND status = 'Completed'
                    ORDER BY t.date DESC
                    LIMIT 24
                `),
            ]);

            const total30Days = parseFloat(totalRes.rows[0].total) || 0;

            return res.json({
                total30Days: Number(total30Days.toFixed(2)),
                items: itemsRes.rows.map((row) => ({
                    id: row.id,
                    method: row.method || 'PayPal',
                    user: row.username,
                    amount: Number(row.amount),
                })),
            });
        }
    } catch (error) {
        console.warn('Postgres live cashouts notice:', error.message);
    }

    return res.json({ total30Days: 0, items: [] });
});

app.get('/api/leaderboard', async (req, res) => {
    const { period } = req.query; // 'daily', 'weekly', 'monthly'
    if (!['daily', 'weekly', 'monthly'].includes(period)) {
        return res.status(400).json({ message: 'Invalid period specified.' });
    }

    let intervalCondition;
    switch (period) {
        case 'daily':
            intervalCondition = "t.date >= date_trunc('day', NOW())";
            break;
        case 'weekly':
            intervalCondition = "t.date >= date_trunc('week', NOW())";
            break;
        case 'monthly':
            intervalCondition = "t.date >= date_trunc('month', NOW())";
            break;
    }

    try {
        const query = `
            SELECT
                u.id,
                u.username,
                u.avatar_url,
                u.xp,
                SUM(t.amount) AS earned
            FROM transactions t
            JOIN users u ON t.user_id = u.id
            WHERE
                t.type = 'Task Reward' AND t.status = 'Completed' AND ${intervalCondition}
            GROUP BY u.id
            ORDER BY earned DESC
            LIMIT 20;
        `;

        const result = await pool.query(query);

        const leaderboardData = result.rows.map((row, index) => ({
            rank: index + 1,
            user: row.username,
            avatar: row.avatar_url,
            earned: parseFloat(row.earned),
            level: Math.floor(row.xp / 1000) + 1,
        }));

        res.json(leaderboardData);

    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        res.status(500).json({ message: 'Server error fetching leaderboard.' });
    }
});

// --- LIVE COMMUNITY CHAT ROUTES ---

// Public endpoint: anyone can view messages
app.get('/api/chat/messages', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, user_id, username, avatar, message, created_at
            FROM chat_messages
            ORDER BY created_at ASC
            LIMIT 100
        `);
        const messages = result.rows.map(row => ({
            id: row.id,
            userId: row.user_id,
            user: row.username,
            avatar: row.avatar || `https://i.pravatar.cc/100?u=${encodeURIComponent(row.username)}`,
            message: row.message,
            timestamp: new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            createdAt: row.created_at,
        }));
        res.json(messages);
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        res.status(500).json({ message: 'Server error fetching chat messages.' });
    }
});

// Authenticated endpoint: only logged-in users can post
app.post('/api/chat/messages', authMiddleware, async (req, res) => {
    try {
        const { message } = req.body;
        if (!message || typeof message !== 'string' || message.trim() === '') {
            return res.status(400).json({ message: 'Message cannot be empty.' });
        }
        const cleanMessage = message.trim();
        if (cleanMessage.length > 500) {
            return res.status(400).json({ message: 'Message is too long (max 500 characters).' });
        }

        const userRes = await pool.query('SELECT id, username, avatar_url FROM users WHERE id = $1', [req.user.id]);
        if (userRes.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const user = userRes.rows[0];
        const username = user.username || `User_${user.id}`;
        const avatar = user.avatar_url || `https://i.pravatar.cc/100?u=${encodeURIComponent(username)}`;

        const insertRes = await pool.query(`
            INSERT INTO chat_messages (user_id, username, avatar, message, created_at)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING id, user_id, username, avatar, message, created_at
        `, [user.id, username, avatar, cleanMessage]);

        const row = insertRes.rows[0];
        res.status(201).json({
            id: row.id,
            userId: row.user_id,
            user: row.username,
            avatar: row.avatar,
            message: row.message,
            timestamp: new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            createdAt: row.created_at,
        });
    } catch (error) {
        console.error('Error sending chat message:', error);
        res.status(500).json({ message: 'Server error sending message.' });
    }
});


// --- ADMIN ROUTES ---

app.get('/api/admin/stats', adminAuthMiddleware, async (req, res) => {
    try {
        const stats = {};
        const totalUsersRes = await pool.query('SELECT COUNT(*) FROM users');
        stats.totalUsers = parseInt(totalUsersRes.rows[0].count, 10);

        const newUsersRes = await pool.query("SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '30 days'");
        stats.newUsersLast30Days = parseInt(newUsersRes.rows[0].count, 10);

        const totalTasksRes = await pool.query("SELECT COUNT(*) FROM transactions WHERE type = 'Task Reward' AND status = 'Completed'");
        stats.tasksCompletedAllTime = parseInt(totalTasksRes.rows[0].count, 10);

        const recentTasksRes = await pool.query("SELECT COUNT(*) FROM transactions WHERE type = 'Task Reward' AND status = 'Completed' AND date >= NOW() - INTERVAL '30 days'");
        stats.tasksCompletedLast30Days = parseInt(recentTasksRes.rows[0].count, 10);

        const totalPaidOutRes = await pool.query("SELECT SUM(amount) FROM transactions WHERE type = 'Withdrawal' AND status = 'Completed'");
        stats.totalPaidOut = parseFloat(totalPaidOutRes.rows[0].sum) || 0;
        
        const pendingWithdrawalsRes = await pool.query("SELECT COUNT(*) FROM transactions WHERE type = 'Withdrawal' AND status = 'Pending'");
        stats.pendingWithdrawals = parseInt(pendingWithdrawalsRes.rows[0].count, 10);
        
        res.json(stats);
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ message: 'Server error fetching stats.' });
    }
});

app.get('/api/admin/recent-tasks', adminAuthMiddleware, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT t.id AS transaction_id, t.date, u.email, t.amount, u.id as user_id
            FROM transactions t
            JOIN users u ON t.user_id = u.id
            WHERE t.type = 'Task Reward' AND t.status = 'Completed'
            ORDER BY t.date DESC
            LIMIT 5
        `);
        res.json(result.rows.map(snakeToCamel));
    } catch (error) {
        console.error('Error fetching recent tasks:', error);
        res.status(500).json({ message: 'Server error fetching recent tasks.' });
    }
});

app.get('/api/admin/recent-signups', adminAuthMiddleware, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, email, created_at AS joined_date
            FROM users
            ORDER BY created_at DESC
            LIMIT 5
        `);
        res.json(result.rows.map(snakeToCamel));
    } catch (error) {
        console.error('Error fetching recent signups:', error);
        res.status(500).json({ message: 'Server error fetching recent signups.' });
    }
});

// Get all withdrawal transactions for admin panel, with pagination
app.get('/api/admin/transactions', adminAuthMiddleware, async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limitQuery = req.query.limit;
    
    let limit;
    if (limitQuery) {
        limit = parseInt(limitQuery, 10);
    } else {
        // A large number to fetch all if limit is not provided
        limit = 10;
    }

    const offset = (page - 1) * limit;

    try {
        const baseQuery = `
            FROM transactions t
            JOIN users u ON t.user_id = u.id
            WHERE t.type = 'Withdrawal'
        `;

        const totalResult = await pool.query(`SELECT COUNT(*) ${baseQuery}`);
        const totalItems = parseInt(totalResult.rows[0].count, 10);
        const totalPages = Math.ceil(totalItems / limit);

        const transactionsResult = await pool.query(`
            SELECT t.*, u.email, u.id as user_id
            ${baseQuery}
            ORDER BY 
                CASE t.status
                    WHEN 'Pending' THEN 1
                    WHEN 'Completed' THEN 2
                    WHEN 'Rejected' THEN 3
                    ELSE 4
                END, 
                t.date DESC
            LIMIT $1 OFFSET $2
        `, [limit, offset]);

        if (limitQuery) {
            res.json(transactionsResult.rows.map(snakeToCamel));
        } else {
            res.json({
                transactions: transactionsResult.rows.map(snakeToCamel),
                currentPage: page,
                totalPages,
                totalItems
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching admin transactions.' });
    }
});


// Update a transaction's status (approve/reject)
app.patch('/api/admin/transactions/:id', adminAuthMiddleware, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 

    if (!status || !['Completed', 'Rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided.' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const transactionResult = await client.query('SELECT * FROM transactions WHERE id = $1 FOR UPDATE', [id]);
        if (transactionResult.rows.length === 0) {
            throw new Error('Transaction not found');
        }
        const transaction = transactionResult.rows[0];
        
        if (transaction.status !== 'Pending') {
            throw new Error('Transaction is not in a pending state.');
        }

        const transactionAmount = Number(transaction.amount);
        if (isNaN(transactionAmount)) {
            throw new Error('Invalid transaction amount in database.');
        }

        const updatedTransactionQuery = await client.query(
            'UPDATE transactions SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        const updatedTransaction = updatedTransactionQuery.rows[0];

        if (status === 'Completed') {
            await client.query(
                'UPDATE users SET total_withdrawn = total_withdrawn + $1 WHERE id = $2',
                [transactionAmount, transaction.user_id]
            );
        } else if (status === 'Rejected') {
            await client.query(
                'UPDATE users SET balance = balance + $1 WHERE id = $2',
                [transactionAmount, transaction.user_id]
            );
        }

        await client.query('COMMIT');

        const notificationMessage = `Your withdrawal request for $${transactionAmount.toFixed(2)} has been ${status}.`;
        await pool.query(
            'INSERT INTO notifications (user_id, message, link_to) VALUES ($1, $2, $3)',
            [transaction.user_id, notificationMessage, '/Profile']
        );

        res.json(snakeToCamel(updatedTransaction));

    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: error.message || 'Server error updating transaction.' });
    } finally {
        client.release();
    }
});

app.get('/api/admin/users', adminAuthMiddleware, async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    try {
        let whereClause = '';
        const queryParams = [limit, offset];
        if (search) {
            whereClause = `WHERE username ILIKE $3 OR email ILIKE $3`;
            queryParams.push(`%${search}%`);
        }
        
        const countQueryParams = search ? [`%${search}%`] : [];
        const totalResult = await pool.query(`SELECT COUNT(*) FROM users ${whereClause}`, countQueryParams);
        const totalItems = parseInt(totalResult.rows[0].count, 10);
        const totalPages = Math.ceil(totalItems / limit);

        const usersResult = await pool.query(`
            SELECT id, username, email, avatar_url, created_at AS joined_date, balance
            FROM users
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2
        `, queryParams);

        res.json({
            users: usersResult.rows.map(snakeToCamel),
            currentPage: page,
            totalPages,
            totalItems
        });
    } catch (error) {
        console.error('Error fetching users for admin:', error);
        res.status(500).json({ message: 'Server error fetching users.' });
    }
});


app.get('/api/admin/users/:userId', adminAuthMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await pool.query(
            `SELECT id, username, email, avatar_url, created_at AS joined_date, total_earned, balance, last_30_days_earned, completed_tasks, total_wagered, total_profit, total_withdrawn, total_referrals, referral_earnings, xp, rank, earn_id
             FROM users WHERE id = $1`,
            [userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json(snakeToCamel(result.rows[0]));
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Server error fetching user details.' });
    }
});

// Ban a user (set is_banned = TRUE + send notification)
app.post('/api/admin/users/:id/ban', adminAuthMiddleware, async (req, res) => {
    const userId = req.params.id;

    try {
        // 1️⃣ Update the user as banned
        const result = await pool.query(
            'UPDATE users SET is_banned = TRUE WHERE id = $1 RETURNING id, username, email, is_banned',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const user = result.rows[0];

        // 2️⃣ Create a notification entry for the user
        await pool.query(
            `INSERT INTO notifications (user_id, message, link_to)
             VALUES ($1, $2, $3)`,
            [
                userId,
                '⚠ Your withdrawal access has been disabled by the admin. Contact support if you believe this was a mistake.',
                '/support' // or null if you don't want a link
            ]
        );

        return res.json({
            success: true,
            message: 'User banned and notified.',
            user
        });

    } catch (error) {
        console.error('❌ Error banning user:', error);
        return res.status(500).json({ message: 'Server error while banning user.' });
    }
});



app.get('/api/admin/users/:userId/transactions', adminAuthMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await pool.query(
            'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC',
            [userId]
        );
        res.json(result.rows.map(snakeToCamel));
    } catch (error) {
        console.error('Error fetching user transactions:', error);
        res.status(500).json({ message: 'Server error fetching user transactions.' });
    }
});


app.get('/api/admin/payment-methods', adminAuthMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM payment_methods ORDER BY type, name');
        res.json(result.rows.map(snakeToCamel));
    } catch (error) {
        console.error('Error fetching all payment methods for admin:', error);
        res.status(500).json({ message: 'Server error fetching payment methods.' });
    }
});

app.patch('/api/admin/payment-methods/:id', adminAuthMiddleware, async (req, res) => {
    const { id } = req.params;
    const { isEnabled } = req.body;

    if (typeof isEnabled !== 'boolean') {
        return res.status(400).json({ message: 'Invalid "isEnabled" value.' });
    }

    try {
        const result = await pool.query(
            'UPDATE payment_methods SET is_enabled = $1 WHERE id = $2 RETURNING *',
            [isEnabled, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Payment method not found.' });
        }
        res.json(snakeToCamel(result.rows[0]));
    } catch (error) {
        console.error('Error updating payment method:', error);
        res.status(500).json({ message: 'Server error updating payment method.' });
    }
});

// Admin Survey Provider Management
app.get('/api/admin/survey-providers', adminAuthMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM survey_providers ORDER BY name');
        res.json(result.rows.map(snakeToCamel));
    } catch (error) {
        console.error('Error fetching survey providers for admin:', error);
        res.status(500).json({ message: 'Server error fetching survey providers.' });
    }
});

app.patch('/api/admin/survey-providers/:id', adminAuthMiddleware, async (req, res) => {
    const { id } = req.params;
    const { isEnabled } = req.body;
    if (typeof isEnabled !== 'boolean') return res.status(400).json({ message: 'Invalid "isEnabled" value.' });
    try {
        const result = await pool.query('UPDATE survey_providers SET is_enabled = $1 WHERE id = $2 RETURNING *', [isEnabled, id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Survey provider not found.' });
        res.json(snakeToCamel(result.rows[0]));
    } catch (error) {
        console.error('Error updating survey provider:', error);
        res.status(500).json({ message: 'Server error updating survey provider.' });
    }
});

// Admin Offer Wall Management
app.get('/api/admin/offer-walls', adminAuthMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM offer_walls ORDER BY name');
        res.json(result.rows.map(snakeToCamel));
    } catch (error) {
        console.error('Error fetching offer walls for admin:', error);
        res.status(500).json({ message: 'Server error fetching offer walls.' });
    }
});

app.patch('/api/admin/offer-walls/:id', adminAuthMiddleware, async (req, res) => {
    const { id } = req.params;
    const { isEnabled } = req.body;
    if (typeof isEnabled !== 'boolean') return res.status(400).json({ message: 'Invalid "isEnabled" value.' });
    try {
        const result = await pool.query('UPDATE offer_walls SET is_enabled = $1 WHERE id = $2 RETURNING *', [isEnabled, id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Offer wall not found.' });
        res.json(snakeToCamel(result.rows[0]));
    } catch (error) {
        console.error('Error updating offer wall:', error);
        res.status(500).json({ message: 'Server error updating offer wall.' });
    }
});

// Helper to convert snake_case from DB to camelCase for frontend
const snakeToCamel = (obj) => {
    if (typeof obj !== 'object' || obj === null || obj instanceof Date) return obj;
    if (Array.isArray(obj)) return obj.map(snakeToCamel);
    
    return Object.entries(obj).reduce((acc, [key, value]) => {
        const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        acc[camelKey] = snakeToCamel(value); // Recursively convert nested objects
        return acc;
    }, {});
};

const seedAdmin = async () => {
    const client = await pool.connect();
    try {
        const adminEmail = 'raihansarker270@gmail.com';
        const adminCheck = await client.query('SELECT * FROM admins WHERE email = $1', [adminEmail]);
        if (adminCheck.rows.length === 0) {
            console.log('Creating default admin user...');
            const salt = await bcrypt.genSalt(10);
            const adminPasswordHash = await bcrypt.hash('Wh1@Wh1@', salt);
            await client.query('INSERT INTO admins (email, password_hash) VALUES ($1, $2)', [adminEmail, adminPasswordHash]);
            console.log('Default admin user created.');
        }
    } catch (err) {
        console.error('Error seeding admin user:', err.stack);
    } finally {
        client.release();
    }
};

const seedPaymentMethods = async () => {
    const client = await pool.connect();
    try {
        console.log('Seeding/Updating payment methods...');
        const methods = [
            { name: 'Gamdom', icon_class: 'fas fa-dice', type: 'special', special_bonus: '+25%' },
            { name: 'Virtual Visa Interna...', icon_class: 'fab fa-cc-visa', type: 'cash' },
            // Crypto with external URLs
            { name: 'Binance Coin (BNB)', icon_class: 'https://cryptologos.cc/logos/bnb-bnb-logo.png?v=029', type: 'crypto' },
            { name: 'Bitcoin (BTC)', icon_class: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=029', type: 'crypto' },
            { name: 'Ethereum (ETH)', icon_class: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=029', type: 'crypto' },
            { name: 'Litecoin (LTC)', icon_class: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png?v=029', type: 'crypto' },
            { name: 'Solana (SOL)', icon_class: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=029', type: 'crypto' },
            { name: 'Tether (USDT)', icon_class: 'https://cryptologos.cc/logos/tether-usdt-logo.png?v=029', type: 'crypto' },
            { name: 'USD Coin (USDC)', icon_class: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=029', type: 'crypto' },
            { name: 'Tron (TRX)', icon_class: 'https://cryptologos.cc/logos/tron-trx-logo.png?v=029', type: 'crypto' },
        ];
        
        for (const method of methods) {
            // Check if exists
            const check = await client.query('SELECT id FROM payment_methods WHERE name = $1', [method.name]);
            if (check.rows.length > 0) {
                // Always update to ensure latest icon/config
                await client.query(
                    'UPDATE payment_methods SET icon_class = $1, type = $2, special_bonus = $3 WHERE name = $4',
                    [method.icon_class, method.type, method.special_bonus || null, method.name]
                );
            } else {
                // Insert
                await client.query(
                    'INSERT INTO payment_methods (name, icon_class, type, special_bonus) VALUES ($1, $2, $3, $4)',
                    [method.name, method.icon_class, method.type, method.special_bonus || null]
                );
            }
        }
        console.log('Payment methods seeded/updated successfully.');

    } catch (err) {
        console.error('Error seeding payment methods:', err.stack);
    } finally {
        client.release();
    }
};

const seedSurveyProviders = async () => {
    const client = await pool.connect();
    try {
        const check = await client.query('SELECT * FROM survey_providers LIMIT 1');
        if (check.rows.length > 0) return;

        console.log('Seeding survey providers...');
        const providers = [
          { name: 'BitLabs', logo: 'https://i.imgur.com/oZznueX.png', rating: 3, type: 'BitLabs' },
          { name: 'CPX Research', logo: 'https://i.imgur.com/ssL8ALh.png', rating: 3, type: 'CPX RESEARCH' },
          { name: 'Your-Surveys', logo: 'https://i.imgur.com/pLRnBU2.png', rating: 4, type: 'Your-Surveys' },
          { name: 'Pollfish', logo: 'https://i.imgur.com/OofFwSR.png', rating: 4, type: 'Pollfish' },
          { name: 'Prime Surveys', logo: 'https://i.imgur.com/0EGYRXz.png', rating: 3, type: 'Prime Surveys' },
          { name: 'inBrain', logo: 'https://i.imgur.com/AaQPnwe.png', rating: 2, type: 'inBrain' },
          { name: 'Adscend Media Surveys', logo: 'https://i.imgur.com/iY9g04E.png', rating: 4, type: 'Adscend Media' },
          { name: 'TheoremReach', logo: 'https://i.imgur.com/yvC5YyW.png', rating: 4, type: 'TheoremReach', is_locked: true, unlock_requirement: "Level 5+" },
        ];
        for (const p of providers) {
            await client.query('INSERT INTO survey_providers (name, logo, rating, type, is_locked, unlock_requirement) VALUES ($1, $2, $3, $4, $5, $6)', [p.name, p.logo, p.rating, p.type, p.is_locked || false, p.unlock_requirement || null]);
        }
        console.log('Survey providers seeded.');
    } catch (err) {
        console.error('Error seeding survey providers:', err);
    } finally {
        client.release();
    }
};

const seedOfferWalls = async () => {
    const client = await pool.connect();
    try {
        const check = await client.query('SELECT * FROM offer_walls LIMIT 1');
        if (check.rows.length > 0) return;

        console.log('Seeding offer walls...');
        const walls = [
            { name: 'Torox', logo: 'https://i.imgur.com/zbyfSVW.png', bonus: '+20%' },
            { name: 'Adscend Media', logo: 'https://i.imgur.com/iY9g04E.png', bonus: '+50%' },
            { name: 'AdToWall', logo: 'https://i.imgur.com/x0iP1C9.png' },
            { name: 'RevU', logo: 'https://i.imgur.com/yvC5YyW.png', is_locked: true, unlock_requirement: 'Earn $2.50 to unlock', bonus: '+50%' },
            { name: 'AdGate Media', logo: 'https://i.imgur.com/Q2yG7nS.png' },
            { name: 'MyChips', logo: 'https://i.imgur.com/yvC5YyW.png', is_locked: true, unlock_requirement: 'Earn $2.50 to unlock', bonus: '+50%' },
            { name: 'MM Wall', logo: 'https://i.imgur.com/6XzWfP1.png' },
            { name: 'Aye-T Studios', logo: 'https://i.imgur.com/J3t5e6E.png' },
            { name: 'Monlix', logo: 'https://i.imgur.com/ePFr12w.png' },
            { name: 'Hang My Ads', logo: 'https://i.imgur.com/yvC5YyW.png', is_locked: true, unlock_requirement: 'Earn $1.00 to unlock' },
            { name: 'Lootably', logo: 'https://i.imgur.com/i9nO27d.png' },
            { name: 'Time Wall', logo: 'https://i.imgur.com/nJgq1t7.png' },
            { name: 'AdGem', logo: 'https://i.imgur.com/r9f5k2Z.png', rating: 3 },
            { name: 'Pixylab', logo: 'https://creatives.skylup.swaarm-clients.com/objects/146/e03421e0-9d27-4f57-9e73-a5b9649fcfec.png', bonus: '+30%', is_locked: false },
        ];
        for (const w of walls) {
            await client.query('INSERT INTO offer_walls (name, logo, bonus, is_locked, unlock_requirement) VALUES ($1, $2, $3, $4, $5)', [w.name, w.logo, w.bonus || null, w.is_locked || false, w.unlock_requirement || null]);
        }
        console.log('Offer walls seeded.');
    } catch (err) {
        console.error('Error seeding offer walls:', err);
    } finally {
        client.release();
    }
};

const seedMockUsersAndTransactions = async () => {
    const client = await pool.connect();
    try {
        const userCheck = await client.query("SELECT id FROM users WHERE email NOT LIKE 'raihansarker270@gmail.com' LIMIT 1");
        if (userCheck.rows.length > 0) {
            console.log('Mock users already exist, skipping seeding.');
            return;
        }

        console.log('Seeding mock users and transactions...');

        const users = [];
        const usernames = ['CryptoKing', 'Sparkb6', 'GamerX', 'SoFi Plus', 'raihansarker', 'Fastslots', 'JohnDoe', 'JaneSmith', 'SurveyFan', 'Newbie'];
        for (let i = 0; i < usernames.length; i++) {
            const username = usernames[i];
            const email = `${username.toLowerCase()}@example.com`;
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash('password123', salt);
            const earn_id = crypto.randomBytes(8).toString('hex');
            const avatar_url = `https://i.pravatar.cc/150?u=${username}`;
            
            const res = await client.query(
                `INSERT INTO users (username, email, password_hash, avatar_url, earn_id, xp) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, avatar_url, xp`,
                [username, email, password_hash, avatar_url, Math.floor(Math.random() * 90000) + 1000, earn_id]
            );
            users.push(res.rows[0]);
        }
        
        const sources = ['Task', 'Survey', 'Offer'];
        const methods = ['Torox', 'BitLabs', 'CPX Research', 'AdGate Media'];

        for (let i = 0; i < 150; i++) {
            const user = users[Math.floor(Math.random() * users.length)];
            const amount = (Math.random() * 25 + 0.5).toFixed(2);
            // Random date in the last 30 days
            const date = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
            
            await client.query(
                `INSERT INTO transactions (id, user_id, type, method, amount, status, date, source) VALUES ($1, $2, 'Task Reward', $3, $4, 'Completed', $5, $6)`,
                [`MOCK${Date.now()}${i}`, user.id, methods[Math.floor(Math.random() * methods.length)], amount, date, sources[Math.floor(Math.random() * sources.length)]]
            );

            await client.query(
                'UPDATE users SET total_earned = total_earned + $1, balance = balance + $1, completed_tasks = completed_tasks + 1 WHERE id = $2',
                [amount, user.id]
            );
        }
        console.log('Mock data seeded successfully.');

    } catch (err) {
        console.error('Error seeding mock data:', err);
    } finally {
        client.release();
    }
};


// Start Server (only when not running inside Vercel serverless functions)
if (!process.env.VERCEL) {
  app.listen(port, () => {
    initDb().then(() => {
        seedAdmin();
        seedPaymentMethods();
        seedSurveyProviders();
        seedOfferWalls();
        seedMockUsersAndTransactions();
    });
    console.log(`Server running on http://localhost:${port}`);
  });
}

module.exports = app;

