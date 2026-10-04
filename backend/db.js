// db.js
const { Pool } = require('pg');
require('dotenv').config();

// Support standard Supabase Connection Strings (Session Pooler :5432, Transaction Pooler :6543, or Direct)
// Also supports Vercel Postgres integration variables (POSTGRES_URL)
const connectionString =
  process.env.DATABASE_URL ||
  process.env.SUPABASE_DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  max: process.env.VERCEL ? 3 : 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

let isDbInitialized = false;

const initDb = async () => {
  if (isDbInitialized) return;
  const client = await pool.connect();
  try {
    console.log('Initializing database schema...');
    // Main CREATE TABLE statements (includes 'balance' for new setups)
    await client.query(`
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

        gender VARCHAR(10),      -- 'm' অথবা 'f' সেভ হবে
        zip_code VARCHAR(20),    -- ইউজারের পোস্টাল কোড
        dob DATE                 -- জন্ম তারিখ (YYYY-MM-DD)
      );

      CREATE TABLE IF NOT EXISTS admins (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id VARCHAR(255) PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        type VARCHAR(50) NOT NULL,
        method VARCHAR(100) NOT NULL,
        amount NUMERIC(10, 2) NOT NULL,
        status VARCHAR(50) NOT NULL,
        date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        source VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS payment_methods (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        icon_class VARCHAR(100),
        type VARCHAR(50) NOT NULL,
        is_enabled BOOLEAN DEFAULT true,
        special_bonus VARCHAR(50)
      );

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

      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        link_to VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ip_logs (
        ip_address VARCHAR(45) PRIMARY KEY,
        block_status INT NOT NULL,
        country_code CHAR(2),
        country_name VARCHAR(100),
        isp VARCHAR(255),
        first_seen TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        last_seen TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash VARCHAR(255) NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_password_reset_token_hash ON password_reset_tokens(token_hash);

      CREATE TABLE IF NOT EXISTS email_verification_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        otp_hash VARCHAR(255) NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_email_verification_user_id ON email_verification_tokens(user_id);
    `);

    // Add 'balance' column to 'users' table if it doesn't exist.
    // This serves as a migration for older database schemas.
    await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS balance NUMERIC(10, 2) DEFAULT 0');
    await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS earn_id VARCHAR(50)');
    await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT TRUE');

    // Add 'ip_logs' column to 'users' table to store user IP history
    await client.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS ip_logs JSONB DEFAULT '[]'");

    await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE');
    isDbInitialized = true;
    console.log('Database schema initialized successfully.');
  } catch (err) {
    console.error('Error initializing database schema:', err.stack);
  } finally {
    client.release();
  }
};

const logIpData = async (ip, ipInfo) => {
  const query = `
    INSERT INTO ip_logs (ip_address, block_status, country_code, country_name, isp, last_seen)
    VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
    ON CONFLICT (ip_address)
    DO UPDATE SET 
      block_status = EXCLUDED.block_status,
      country_code = EXCLUDED.country_code,
      country_name = EXCLUDED.country_name,
      isp = EXCLUDED.isp,
      last_seen = CURRENT_TIMESTAMP;
  `;

  const values = [
    ip,
    ipInfo.block,
    ipInfo.countryCode || null,
    ipInfo.countryName || null,
    ipInfo.isp || ipInfo.org || null,
  ];

  try {
    await pool.query(query, values);
  } catch (error) {
    // This is designed not to block the main request flow on DB logging failure.
    console.error(`Failed to log IP ${ip} to database.`, error);
    throw error;
  }
};

module.exports = { pool, initDb, logIpData };
