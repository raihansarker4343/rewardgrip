// earnlab-backend/config/earnings.js
const USER_PAYOUT_RATIO = 0.7;    // user 70%, তুমি 30%
const MIN_POSTBACK_AMOUNT = 0.01;
const POSTBACK_SECRET = process.env.POSTBACK_SECRET || '';

const REWARD_CURRENCY_NAME_SINGULAR =
  process.env.REWARD_CURRENCY_NAME_SINGULAR || 'Coin';
const REWARD_CURRENCY_NAME_PLURAL =
  process.env.REWARD_CURRENCY_NAME_PLURAL || 'Coins';

function parseUsdAmount(raw) {
  const n = parseFloat(raw);
  if (Number.isNaN(n) || !Number.isFinite(n)) return null;
  return Math.round(n * 100) / 100;
}

function toMoney(n) {
  return Math.round(n * 100) / 100;
}

function parseFactor(raw, fallback) {
  const parsed = parseFloat(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
}

// How many site currency units equal 1 USD of user payout (after commission)
const REWARD_CURRENCY_FACTOR = parseFactor(
  process.env.REWARD_CURRENCY_FACTOR,
  1
);

// Bonus factor (e.g., screen-outs). Defaults to the standard factor when not set.
const REWARD_CURRENCY_BONUS_FACTOR = parseFactor(
  process.env.REWARD_CURRENCY_BONUS_FACTOR || process.env.REWARD_BONUS_FACTOR,
  REWARD_CURRENCY_FACTOR
);

function calculateUserRewardUsd(usdAmount) {
  return toMoney(usdAmount * USER_PAYOUT_RATIO);
}

function calculateUserReward(usdAmount, { isBonus = false } = {}) {
  const userPayoutUsd = calculateUserRewardUsd(usdAmount);
  const factor = isBonus ? REWARD_CURRENCY_BONUS_FACTOR : REWARD_CURRENCY_FACTOR;
  return toMoney(userPayoutUsd * factor);
}

module.exports = {
  USER_PAYOUT_RATIO,
  MIN_POSTBACK_AMOUNT,
  POSTBACK_SECRET,
  parseUsdAmount,
  toMoney,
  REWARD_CURRENCY_NAME_SINGULAR,
  REWARD_CURRENCY_NAME_PLURAL,
  REWARD_CURRENCY_FACTOR,
  REWARD_CURRENCY_BONUS_FACTOR,
  calculateUserRewardUsd,
  calculateUserReward,
};



