// api/index.js - Vercel Serverless Function entry point (ESM)
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const app = require('../backend/server');
const { initDb } = require('../backend/db');

let isDbInitialized = false;

export default async function handler(req, res) {
  // Lazy-initialize database tables in serverless environment if connection string is provided
  if (
    !isDbInitialized &&
    (process.env.DATABASE_URL ||
      process.env.SUPABASE_DATABASE_URL ||
      process.env.POSTGRES_URL)
  ) {
    try {
      await initDb();
      isDbInitialized = true;
    } catch (err) {
      console.warn('[Vercel Serverless DB Init Notice]:', err.message);
    }
  }

  return app(req, res);
}
