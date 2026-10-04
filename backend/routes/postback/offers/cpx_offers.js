const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const router = express.Router();
const { pool } = require('../../../db');

// ১. ইন-মেমোরি ক্যাশ স্টোরেজ তৈরি (সার্ভার মেমরিতে থাকবে)
const surveyCache = new Map();
const CACHE_TIME = 120 * 1000; // ১২০ সেকেন্ড (মিলি-সেকেন্ডে)


// CPX Research surveys fetcher
router.get('/get-surveys', async (req, res) => {
    try {
        const userId = parseInt(req.query.user_id);
        if (!userId) {
            return res.status(400).json({ status: 'error', message: 'User ID is required' });
        }

        // ২. ক্যাশ চেক করা
        const currentTime = Date.now();
        const cachedEntry = surveyCache.get(userId);

        if (cachedEntry && (currentTime - cachedEntry.timestamp < CACHE_TIME)) {
            console.log(`[Cache Hit] Returning cached surveys for User: ${userId}`);
            return res.json(cachedEntry.data); // ক্যাশ থেকে ডাটা পাঠানো
        }

        const appId = process.env.VITE_CPX_APP_ID || '30220';
        const secureHash = process.env.POSTBACK_SECRET; 

        // 🛠️ আইপি ফরম্যাট ঠিক করার চূড়ান্ত লজিক
        // Render/Cloudflare থেকে আসা আইপি থেকে ::ffff: এবং কমা আলাদা করা
        let rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '1.1.1.1';
        const userIp = rawIp.split(',')[0].trim().replace(/^::ffff:/, '');

        const userAgent = req.headers['user-agent'];

        // CPX MD5 Hash: md5(userId + "-" + secureHash)
        const hash = crypto.createHash('md5').update(`${userId}-${secureHash}`).digest('hex');

        // --- নতুন প্রোফাইল লজিক এখানে শুরু ---
        const userResult = await pool.query('SELECT gender, zip_code, dob FROM users WHERE id = $1', [userId]);
        const userData = userResult.rows[0];

        let profileParams = '';
        if (userData) {
        // জেন্ডার যোগ করা (m/f) 
        if (userData.gender) profileParams += `&gender=${userData.gender}`;
    
        // জিপ কোড যোগ করা 
        if (userData.zip_code) profileParams += `&zip_code=${userData.zip_code}`;
    
        // জন্ম তারিখ ভেঙে দিন, মাস এবং বছরে রূপান্তর [cite: 2, 3]
       if (userData.dob) {
        const birthDate = new Date(userData.dob);
        profileParams += `&birthday_day=${birthDate.getDate()}`;
        profileParams += `&birthday_month=${birthDate.getMonth() + 1}`;
        profileParams += `&birthday_year=${birthDate.getFullYear()}`;
    }
 }
       // --- নতুন প্রোফাইল লজিক এখানে শেষ ---

        // URL তৈরি
        const url = `https://live-api.cpx-research.com/api/get-surveys.php?app_id=${appId}&ext_user_id=${userId}&output_method=api&ip_user=${userIp}&user_agent=${encodeURIComponent(userAgent)}&limit=12&secure_hash=${hash}${profileParams}`;

        // লগ চেক করার জন্য (Render Logs-এ দেখা যাবে)
        console.log(`[CPX API Request] User: ${userId}, Clean IP: ${userIp}, Params: ${profileParams}`);
        console.log(`[Full URL]: ${url}`);
        
        const response = await axios.get(url);
        // ৪. নতুন ডাটা ক্যাশ-এ সেভ করা
        surveyCache.set(userId, {
            data: response.data,
            timestamp: currentTime
        });
        res.json(response.data);
    } catch (error) {
        console.error('CPX API Error:', error.message);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

module.exports = router;
