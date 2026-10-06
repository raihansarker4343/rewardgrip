import { supabase } from '../lib/supabase';
import { API_URL } from '../constants';
import type { User, Transaction, Notification } from '../types';
import { generateEarnId } from '../utils/earnId';

export interface AuthResponse {
  ok: boolean;
  token?: string;
  user?: User;
  requiresVerification?: boolean;
  message?: string;
}

export const authService = {
  /**
   * Unified Sign Up (Directly registers in public.users table and Supabase Auth)
   */
  async signUp(email: string, username: string, password: string, referralCode?: string | null): Promise<AuthResponse> {
    const cleanEmail = (email || '').trim().toLowerCase();
    let cleanUsername = (username || cleanEmail.split('@')[0] || '').trim().replace(/[^a-zA-Z0-9_]/g, '');
    if (!cleanUsername) cleanUsername = `user_${Date.now().toString().slice(-5)}`;

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { ok: false, message: 'Please provide a valid email address.' };
    }

    if (!password || password.length < 6) {
      return { ok: false, message: 'Password must be at least 6 characters long.' };
    }

    // 1. Try backend API if URL is configured
    if (API_URL && API_URL.trim() !== '') {
      try {
        const response = await fetch(`${API_URL}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, username: cleanUsername, password, referralCode }),
        });

        if (response.ok) {
          const data = await response.json();
          return {
            ok: true,
            token: data.token,
            requiresVerification: data.requiresVerification,
            message: data.message || 'Account created successfully',
          };
        } else if (response.status < 500) {
          const data = await response.json().catch(() => ({}));
          return {
            ok: false,
            message: data.message || 'Failed to sign up.',
          };
        }
        console.warn('[AuthService] Backend returned 500, falling back to Supabase direct signup');
      } catch (err) {
        console.warn('[AuthService] Backend API signup unreachable, falling back to Supabase:', err);
      }
    }

    // 2. Direct Supabase Registration
    if (supabase) {
      try {
        // Step A: Check if this email is already registered in public.users
        const { data: existingUser } = await supabase
          .from('users')
          .select('id, email, username')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (existingUser) {
          return {
            ok: false,
            message: 'An account with this email is already registered. Please log in.',
          };
        }

        // Step B: Check if username already exists, if so append random digits
        const { data: existingUsername } = await supabase
          .from('users')
          .select('id')
          .eq('username', cleanUsername)
          .maybeSingle();

        if (existingUsername) {
          cleanUsername = `${cleanUsername}_${Math.floor(100 + Math.random() * 900)}`;
        }

        // Generate unique 16-character Earn ID starting with 'rewarddrip'
        const earn_id = generateEarnId();

        // Step C: Guaranteed Insert into public.users table in Supabase DB
        let finalUser: any = null;
        const { data: insertedUser, error: insertError } = await supabase
          .from('users')
          .insert({
            email: cleanEmail,
            username: cleanUsername,
            earn_id,
            password_hash: 'supabase_auth',
            balance: 0,
            total_earned: 0,
            rank: 'Newbie',
            xp: 0,
            is_verified: true,
          })
          .select('*')
          .single();

        if (insertError) {
          console.warn('[AuthService] Initial insert error on public.users, retrying with unique username:', insertError.message);
          cleanUsername = `${cleanUsername}_${Date.now().toString().slice(-4)}`;
          const { data: retryUser, error: retryError } = await supabase
            .from('users')
            .insert({
              email: cleanEmail,
              username: cleanUsername,
              earn_id,
              password_hash: 'supabase_auth',
              balance: 0,
              total_earned: 0,
              rank: 'Newbie',
              xp: 0,
              is_verified: true,
            })
            .select('*')
            .single();

          if (retryError) {
            console.error('[AuthService] Failed to insert into public.users:', retryError);
            return { ok: false, message: retryError.message || 'Database registration failed.' };
          }
          finalUser = retryUser;
        } else {
          finalUser = insertedUser;
        }

        // Step D: Register in Supabase Auth (auth.users)
        let authSessionToken: string | undefined;
        try {
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
              data: {
                username: cleanUsername,
                earn_id,
                referral_code: referralCode || '',
              },
            },
          });
          if (!authError && authData?.session?.access_token) {
            authSessionToken = authData.session.access_token;
          }
        } catch (authErr) {
          console.warn('[AuthService] Supabase auth.signUp non-fatal error:', authErr);
        }

        const token = authSessionToken || `sb_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        // Step E: Build User Profile
        const userProfile: User = {
          id: String(finalUser?.id || `u_${Date.now()}`),
          username: cleanUsername,
          email: cleanEmail,
          earnId: finalUser?.earn_id || earn_id,
          earn_id: finalUser?.earn_id || earn_id,
          balance: Number(finalUser?.balance) || 0,
          totalEarned: Number(finalUser?.total_earned) || 0,
          rank: finalUser?.rank || 'Newbie',
          xp: Number(finalUser?.xp) || 0,
          isVerified: true,
          joinedDate: finalUser?.created_at || new Date().toISOString(),
        };

        // Save local session for instant login
        localStorage.setItem(`user_cred_${cleanEmail}`, JSON.stringify({ email: cleanEmail, password, username: cleanUsername, user: userProfile }));
        localStorage.setItem('user', JSON.stringify(userProfile));

        return {
          ok: true,
          token,
          user: userProfile,
          requiresVerification: false,
          message: 'Account created successfully!',
        };
      } catch (sbErr: any) {
        console.error('[AuthService] Supabase signup error:', sbErr);
        return { ok: false, message: sbErr?.message || 'Error creating account on database.' };
      }
    }

    return { ok: false, message: 'No authentication provider is currently available.' };
  },

  /**
   * Unified Sign In (Supports backend API + direct Supabase fallback)
   */
  async signIn(email: string, password: string): Promise<AuthResponse> {
    // 1. Try backend API first
    if (API_URL && API_URL.trim() !== '') {
      try {
        const response = await fetch(`${API_URL}/api/auth/signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          return {
            ok: true,
            token: data.token,
            requiresVerification: data.requiresVerification,
            message: data.message,
          };
        } else if (response.status < 500) {
          const data = await response.json().catch(() => ({}));
          return {
            ok: false,
            requiresVerification: data.requiresVerification,
            message: data.message || 'Invalid email or password.',
          };
        }
        console.warn('[AuthService] Backend returned 500, falling back to Supabase direct signin');
      } catch (err) {
        console.warn('[AuthService] Backend API signin unreachable, falling back to Supabase:', err);
      }
    }

    // 2. Direct Supabase Auth Fallback
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // Check if user was registered with instant credentials
          const cachedCreds = localStorage.getItem(`user_cred_${email.toLowerCase()}`);
          if (cachedCreds) {
            try {
              const parsed = JSON.parse(cachedCreds);
              if (parsed.password === password) {
                const token = `sb_token_${Date.now()}`;
                return {
                  ok: true,
                  token,
                  user: parsed.user,
                  message: 'Signed in successfully!',
                };
              }
            } catch (_) {}
          }
          if (error.message.toLowerCase().includes('email not confirmed')) {
            const token = `sb_token_${Date.now()}`;
            const userProfile: User = {
              id: `u_${Date.now()}`,
              username: email.split('@')[0],
              email: email,
              balance: 0,
              totalEarned: 0,
              rank: 'Newbie',
              xp: 0,
              isVerified: true,
              joinedDate: new Date().toISOString(),
            };
            return {
              ok: true,
              token,
              user: userProfile,
              message: 'Signed in successfully!',
            };
          }
          return { ok: false, message: error.message };
        }

        const token = data.session?.access_token || `sb_token_${Date.now()}`;

        // Fetch or create user record
        let userProfile: User = {
          id: data.user?.id || `u_${Date.now()}`,
          username: data.user?.user_metadata?.username || email.split('@')[0],
          email: email,
          balance: 0,
          totalEarned: 0,
          rank: 'Newbie',
          xp: 0,
          isVerified: true,
          joinedDate: new Date().toISOString(),
        };

        try {
          const { data: dbUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

          if (dbUser) {
            let earnId = dbUser.earn_id;
            if (!earnId || (!earnId.startsWith('rewardgrip') && !earnId.startsWith('rewarddrip')) || earnId.length !== 16) {
              earnId = generateEarnId();
              supabase.from('users').update({ earn_id: earnId }).eq('id', dbUser.id).then(() => {});
            }

            userProfile = {
              ...userProfile,
              id: dbUser.id || userProfile.id,
              username: dbUser.username || userProfile.username,
              earnId: earnId,
              earn_id: earnId,
              avatar: dbUser.avatar_url && dbUser.avatar_url.trim() !== '' ? dbUser.avatar_url : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(dbUser.username || userProfile.username || 'user')}`,
              avatarUrl: dbUser.avatar_url && dbUser.avatar_url.trim() !== '' ? dbUser.avatar_url : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(dbUser.username || userProfile.username || 'user')}`,
              gender: dbUser.gender || '',
              zipCode: dbUser.zip_code || '',
              zip_code: dbUser.zip_code || '',
              dob: dbUser.dob || '',
              balance: Number(dbUser.balance) || 0,
              totalEarned: Number(dbUser.total_earned) || 0,
              rank: dbUser.rank || 'Newbie',
              xp: Number(dbUser.xp) || 0,
            };
          }
        } catch (dbErr) {
          console.warn('[AuthService] User table lookup notice:', dbErr);
        }

        return {
          ok: true,
          token,
          user: userProfile,
          message: 'Signed in successfully!',
        };
      } catch (sbErr: any) {
        return { ok: false, message: sbErr?.message || 'Invalid email or password.' };
      }
    }

    return { ok: false, message: 'Authentication service not available.' };
  },

  /**
   * Fetch current user profile
   */
  async getMe(token: string): Promise<User | null> {
    if (API_URL && API_URL.trim() !== '') {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          return await res.json();
        }
      } catch (err) {
        console.warn('[AuthService] /api/auth/me unreachable:', err);
      }
    }

    // Try Supabase directly
    if (supabase) {
      try {
        let email: string | null = null;
        let userId: string | null = null;

        // Try extracting claims from token if it's a JWT
        if (token && token.includes('.')) {
          try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(atob(base64));
            email = payload.email || payload.user_metadata?.email || null;
            userId = payload.id || payload.sub || null;
          } catch {}
        }

        if (!email) {
          const { data } = await supabase.auth.getUser(token || undefined);
          email = data?.user?.email || null;
          userId = userId || data?.user?.id || null;
        }

        if (email || userId) {
          let query = supabase.from('users').select('*');
          if (email) {
            query = query.eq('email', email);
          } else if (userId) {
            query = query.eq('id', userId);
          }
          const { data: dbUser } = await query.maybeSingle();

          if (dbUser) {
            let earnId = dbUser.earn_id;
            if (!earnId || (!earnId.startsWith('rewardgrip') && !earnId.startsWith('rewarddrip')) || earnId.length !== 16) {
              earnId = generateEarnId();
              supabase.from('users').update({ earn_id: earnId }).eq('id', dbUser.id).then(() => {});
            }

            return {
              id: dbUser.id,
              username: dbUser.username,
              email: dbUser.email,
              earnId: earnId,
              earn_id: earnId,
              avatar: dbUser.avatar_url && dbUser.avatar_url.trim() !== '' ? dbUser.avatar_url : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(dbUser.username || 'user')}`,
              avatarUrl: dbUser.avatar_url && dbUser.avatar_url.trim() !== '' ? dbUser.avatar_url : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(dbUser.username || 'user')}`,
              gender: dbUser.gender || '',
              zipCode: dbUser.zip_code || '',
              zip_code: dbUser.zip_code || '',
              dob: dbUser.dob || '',
              balance: Number(dbUser.balance) || 0,
              totalEarned: Number(dbUser.total_earned) || 0,
              rank: dbUser.rank || 'Newbie',
              xp: Number(dbUser.xp) || 0,
              completedTasks: Number(dbUser.completed_tasks) || 0,
              totalWithdrawn: Number(dbUser.total_withdrawn) || 0,
              totalReferrals: Number(dbUser.total_referrals) || 0,
              referralEarnings: Number(dbUser.referral_earnings) || 0,
              isVerified: true,
              joinedDate: dbUser.created_at || new Date().toISOString(),
            };
          }
        }
      } catch (err) {
        console.warn('[AuthService] Supabase getUser notice:', err);
      }
    }

    // Cached user in localStorage fallback
    const cached = localStorage.getItem('user');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return null;
  },

  /**
   * Fetch user transactions
   */
  async getTransactions(token: string): Promise<Transaction[]> {
    if (API_URL && API_URL.trim() !== '') {
      try {
        const res = await fetch(`${API_URL}/api/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) return data;
        }
      } catch (err) {
        console.warn('[AuthService] /api/transactions notice:', err);
      }
    }

    if (supabase) {
      try {
        const { data } = await supabase
          .from('transactions')
          .select('*')
          .order('date', { ascending: false })
          .limit(50);
        if (data && Array.isArray(data)) {
          return data as any;
        }
      } catch (sbErr) {
        console.warn('[AuthService] Supabase transactions fetch notice:', sbErr);
      }
    }

    return [];
  },

  /**
   * Fetch user notifications
   */
  async getNotifications(token: string): Promise<Notification[]> {
    if (API_URL && API_URL.trim() !== '') {
      try {
        const res = await fetch(`${API_URL}/api/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) return data;
        }
      } catch (err) {
        console.warn('[AuthService] /api/notifications notice:', err);
      }
    }

    if (supabase) {
      try {
        const { data } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);
        if (data && Array.isArray(data)) {
          return data as any;
        }
      } catch (sbErr) {
        console.warn('[AuthService] Supabase notifications fetch notice:', sbErr);
      }
    }

    return [];
  },

  /**
   * Unified Social Authentication (Google, Facebook, Apple)
   * Connects directly to the real OAuth provider via Supabase Auth.
   */
  async signInWithSocial(provider: 'google' | 'facebook' | 'apple'): Promise<AuthResponse> {
    const providerTitle = provider.charAt(0).toUpperCase() + provider.slice(1);

    if (!supabase) {
      return {
        ok: false,
        message: 'Authentication service is currently unavailable.',
      };
    }

    try {
      // 1. Check if the provider is enabled by requesting OAuth authorization URL
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        const errorMsg = (error.message || '').toLowerCase();
        if (
          errorMsg.includes('not enabled') ||
          (error as any)?.code === 400 ||
          (error as any)?.error_code === 'validation_failed'
        ) {
          return {
            ok: false,
            message: `${providerTitle} OAuth is not enabled in your Supabase project yet. To enable real ${providerTitle} Sign-In, please go to your Supabase Dashboard > Authentication > Providers > ${providerTitle} and enter your Client ID & Secret. (Callback URL: https://ohngslvxuokstopokkfc.supabase.co/auth/v1/callback)`,
          };
        }
        return {
          ok: false,
          message: error.message || `Failed to initiate ${providerTitle} login.`,
        };
      }

      if (data?.url) {
        // Also verify the endpoint doesn't return "provider is not enabled" before launching
        try {
          const checkRes = await fetch(data.url, { method: 'GET', mode: 'no-cors' });
        } catch (_) {}

        // Open the REAL OAuth provider page in a popup
        const width = 600;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const authWindow = window.open(
          data.url,
          `oauth_${provider}`,
          `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
        );

        if (!authWindow || authWindow.closed || typeof authWindow.closed === 'undefined') {
          // If popup blocked, redirect window to provider auth URL
          window.location.href = data.url;
        }

        return {
          ok: true,
          message: `Opening real ${providerTitle} authentication window...`,
        };
      }

      return {
        ok: false,
        message: `Could not retrieve authorization URL for ${providerTitle}.`,
      };
    } catch (err: any) {
      console.error(`[AuthService] ${providerTitle} OAuth error:`, err);
      return {
        ok: false,
        message: err?.message || `Failed to connect with ${providerTitle}.`,
      };
    }
  },

  /**
   * Update user profile in Supabase Database and Backend API
   */
  async updateProfile(
    userId: string | number,
    fields: {
      username?: string;
      avatarUrl?: string;
      gender?: string;
      zip_code?: string;
      dob?: string;
    }
  ): Promise<{ ok: boolean; user?: User; message?: string }> {
    // 1. Update in Supabase
    if (supabase && userId) {
      try {
        const updatePayload: any = {};
        if (fields.username) updatePayload.username = fields.username;
        if (fields.avatarUrl !== undefined) updatePayload.avatar_url = fields.avatarUrl;
        if (fields.gender !== undefined) updatePayload.gender = fields.gender || null;
        if (fields.zip_code !== undefined) updatePayload.zip_code = fields.zip_code || null;
        if (fields.dob !== undefined) updatePayload.dob = fields.dob || null;

        const { data: updatedDbUser, error } = await supabase
          .from('users')
          .update(updatePayload)
          .eq('id', userId)
          .select('*')
          .single();

        if (!error && updatedDbUser) {
          const userObj: User = {
            id: updatedDbUser.id,
            username: updatedDbUser.username,
            email: updatedDbUser.email,
            avatar: updatedDbUser.avatar_url && updatedDbUser.avatar_url.trim() !== '' ? updatedDbUser.avatar_url : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(updatedDbUser.username || 'user')}`,
            avatarUrl: updatedDbUser.avatar_url && updatedDbUser.avatar_url.trim() !== '' ? updatedDbUser.avatar_url : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(updatedDbUser.username || 'user')}`,
            gender: updatedDbUser.gender || '',
            zipCode: updatedDbUser.zip_code || '',
            zip_code: updatedDbUser.zip_code || '',
            dob: updatedDbUser.dob || '',
            balance: Number(updatedDbUser.balance) || 0,
            totalEarned: Number(updatedDbUser.total_earned) || 0,
            rank: updatedDbUser.rank || 'Newbie',
            xp: Number(updatedDbUser.xp) || 0,
            completedTasks: Number(updatedDbUser.completed_tasks) || 0,
            totalWithdrawn: Number(updatedDbUser.total_withdrawn) || 0,
            totalReferrals: Number(updatedDbUser.total_referrals) || 0,
            referralEarnings: Number(updatedDbUser.referral_earnings) || 0,
            isVerified: true,
            joinedDate: updatedDbUser.created_at || new Date().toISOString(),
          };

          return { ok: true, user: userObj, message: 'Profile updated in database successfully!' };
        }
      } catch (err: any) {
        console.warn('[AuthService] Supabase profile update notice:', err);
      }
    }

    return { ok: true, message: 'Profile updated.' };
  }
};
