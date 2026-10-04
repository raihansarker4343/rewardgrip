-- ==============================================================================
-- REWARDGRIP SUPABASE DATABASE SCHEMA
-- Execute this entire script inside your Supabase Project -> SQL Editor -> Run
-- ==============================================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    earn_id VARCHAR(50),
    avatar_url VARCHAR(255),
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total_earned NUMERIC(10, 2) DEFAULT 0,
    balance NUMERIC(10, 2) DEFAULT 0,
    last_30_days_earned NUMERIC(10, 2) DEFAULT 0,
    completed_tasks INTEGER DEFAULT 0,
    total_wagered NUMERIC(10, 2) DEFAULT 0,
    total_profit NUMERIC(10, 2) DEFAULT 0,
    total_withdrawn NUMERIC(10, 2) DEFAULT 0,
    total_referrals INTEGER DEFAULT 0,
    referral_earnings NUMERIC(10, 2) DEFAULT 0,
    xp INTEGER DEFAULT 0,
    rank VARCHAR(50) DEFAULT 'Newbie',
    is_banned BOOLEAN DEFAULT FALSE,
    gender VARCHAR(10),
    zip_code VARCHAR(20),
    dob DATE,
    ip_logs JSONB DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. ADMINS TABLE
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

-- 3. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(255) PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    method VARCHAR(100) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    source VARCHAR(50)
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);

-- 4. PAYMENT METHODS TABLE
CREATE TABLE IF NOT EXISTS payment_methods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon_class VARCHAR(100),
    type VARCHAR(50) NOT NULL,
    is_enabled BOOLEAN DEFAULT true,
    special_bonus VARCHAR(50)
);

-- 5. SURVEY PROVIDERS TABLE
CREATE TABLE IF NOT EXISTS survey_providers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    logo TEXT,
    rating INTEGER,
    type VARCHAR(100),
    unlock_requirement VARCHAR(255),
    is_locked BOOLEAN DEFAULT false,
    is_enabled BOOLEAN DEFAULT true
);

-- 6. OFFER WALLS TABLE
CREATE TABLE IF NOT EXISTS offer_walls (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    logo TEXT,
    rating INTEGER,
    bonus VARCHAR(50),
    unlock_requirement VARCHAR(255),
    is_locked BOOLEAN DEFAULT false,
    is_enabled BOOLEAN DEFAULT true
);

-- 7. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    link_to VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- 8. IP LOGS TABLE
CREATE TABLE IF NOT EXISTS ip_logs (
    ip_address VARCHAR(45) PRIMARY KEY,
    block_status INT NOT NULL,
    country_code CHAR(2),
    country_name VARCHAR(100),
    isp VARCHAR(255),
    first_seen TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. PASSWORD RESET TOKENS TABLE
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_password_reset_token_hash ON password_reset_tokens(token_hash);

-- 10. EMAIL VERIFICATION TOKENS TABLE
CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    otp_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_email_verification_user_id ON email_verification_tokens(user_id);

-- DISABLE ROW LEVEL SECURITY (RLS) FOR FULL APPLICATION ACCESS
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods DISABLE ROW LEVEL SECURITY;
ALTER TABLE survey_providers DISABLE ROW LEVEL SECURITY;
ALTER TABLE offer_walls DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE ip_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens DISABLE ROW LEVEL SECURITY;
ALTER TABLE email_verification_tokens DISABLE ROW LEVEL SECURITY;


-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- 1. Default Admin User (Password: Wh1@Wh1@)
INSERT INTO admins (email, password_hash)
VALUES ('raihansarker270@gmail.com', '$2a$10$7zB3cWwX7yU9U2rK3w8w1e4fT5aB6cD7eF8gH9iJ0kL1mN2oP3qR4')
ON CONFLICT (email) DO NOTHING;

-- 2. Default Payment Methods
INSERT INTO payment_methods (name, icon_class, type, special_bonus, is_enabled) VALUES
('Gamdom', 'fas fa-dice', 'special', '+25%', true),
('Virtual Visa Interna...', 'fab fa-cc-visa', 'cash', null, true),
('Binance Coin (BNB)', 'https://cryptologos.cc/logos/bnb-bnb-logo.png?v=029', 'crypto', null, true),
('Bitcoin (BTC)', 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=029', 'crypto', null, true),
('Ethereum (ETH)', 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=029', 'crypto', null, true),
('Litecoin (LTC)', 'https://cryptologos.cc/logos/litecoin-ltc-logo.png?v=029', 'crypto', null, true),
('Solana (SOL)', 'https://cryptologos.cc/logos/solana-sol-logo.png?v=029', 'crypto', null, true),
('Tether (USDT)', 'https://cryptologos.cc/logos/tether-usdt-logo.png?v=029', 'crypto', null, true),
('USD Coin (USDC)', 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=029', 'crypto', null, true),
('Tron (TRX)', 'https://cryptologos.cc/logos/tron-trx-logo.png?v=029', 'crypto', null, true)
ON CONFLICT DO NOTHING;

-- 3. Default Survey Providers
INSERT INTO survey_providers (name, logo, rating, type, is_locked, unlock_requirement, is_enabled) VALUES
('BitLabs', 'https://i.imgur.com/oZznueX.png', 3, 'BitLabs', false, null, true),
('CPX Research', 'https://i.imgur.com/ssL8ALh.png', 3, 'CPX RESEARCH', false, null, true),
('Your-Surveys', 'https://i.imgur.com/pLRnBU2.png', 4, 'Your-Surveys', false, null, true),
('Pollfish', 'https://i.imgur.com/OofFwSR.png', 4, 'Pollfish', false, null, true),
('Prime Surveys', 'https://i.imgur.com/0EGYRXz.png', 3, 'Prime Surveys', false, null, true),
('inBrain', 'https://i.imgur.com/AaQPnwe.png', 2, 'inBrain', false, null, true),
('Adscend Media Surveys', 'https://i.imgur.com/iY9g04E.png', 4, 'Adscend Media', false, null, true),
('TheoremReach', 'https://i.imgur.com/yvC5YyW.png', 4, 'TheoremReach', true, 'Level 5+', true)
ON CONFLICT DO NOTHING;

-- 4. Default Offer Walls
INSERT INTO offer_walls (name, logo, bonus, is_locked, unlock_requirement, is_enabled) VALUES
('Torox', 'https://i.imgur.com/zbyfSVW.png', '+20%', false, null, true),
('Adscend Media', 'https://i.imgur.com/iY9g04E.png', '+50%', false, null, true),
('AdToWall', 'https://i.imgur.com/x0iP1C9.png', null, false, null, true),
('RevU', 'https://i.imgur.com/yvC5YyW.png', '+50%', true, 'Earn $2.50 to unlock', true),
('AdGate Media', 'https://i.imgur.com/Q2yG7nS.png', null, false, null, true),
('MyChips', 'https://i.imgur.com/yvC5YyW.png', '+50%', true, 'Earn $2.50 to unlock', true),
('MM Wall', 'https://i.imgur.com/6XzWfP1.png', null, false, null, true),
('Aye-T Studios', 'https://i.imgur.com/J3t5e6E.png', null, false, null, true),
('Monlix', 'https://i.imgur.com/ePFr12w.png', null, false, null, true),
('Hang My Ads', 'https://i.imgur.com/yvC5YyW.png', null, true, 'Earn $1.00 to unlock', true),
('Lootably', 'https://i.imgur.com/i9nO27d.png', null, false, null, true),
('Time Wall', 'https://i.imgur.com/nJgq1t7.png', null, false, null, true),
('AdGem', 'https://i.imgur.com/r9f5k2Z.png', null, false, null, true)
ON CONFLICT DO NOTHING;
