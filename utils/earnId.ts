// utils/earnId.ts

/**
 * Generate a unique 16-character Earn ID starting with 'rewarddrip'
 * Format: 'rewarddrip' (10 chars) + 6 random lowercase alphanumeric characters = 16 characters
 */
export const generateEarnId = (): string => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  let suffix = '';
  for (let i = 0; i < 6; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `rewardgrip${suffix}`;
};

/**
 * Ensure user has an earnId. If not present or not formatted, returns a generated one.
 */
export const ensureEarnId = (existingEarnId?: string | null): string => {
  if (existingEarnId && existingEarnId.startsWith('rewardgrip') && existingEarnId.length === 16) {
    return existingEarnId;
  }
  if (existingEarnId && existingEarnId.trim().length > 0) {
    return existingEarnId;
  }
  return generateEarnId();
};
