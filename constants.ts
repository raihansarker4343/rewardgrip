import type { User, FaqItem, RewardOption, LeaderboardUser, Achievement, ChatMessage, Testimonial, FeaturedOffer, OfferWall, SurveyProvider } from './types';

// Point to local backend for development to ensure DB changes are reflected and fetch works.

// Vercel deployment and custom backend URL support
export const API_URL = import.meta.env.VITE_API_URL || '';

/** Solid dark background used across the public homepage (matches rewardgrip.com) */
export const HOMEPAGE_BG = '#141826';



// FIX: Added OFFER_WALLS and SURVEY_PROVIDERS constants back.
// These are used by the individual offer/survey pages, which are static placeholders.
// While other parts of the app fetch this data dynamically, providing it here as a
// constant is the simplest fix to resolve import errors on those pages without
// a larger refactor. The data is copied from the backend's seed script.
export const OFFER_WALLS: OfferWall[] = [
    { id: 1, name: 'Torox', logo: 'https://i.imgur.com/zbyfSVW.png', bonus: '+20%', isEnabled: true, isLocked: false, rating: 5 },
    { id: 2, name: 'Adscend Media', logo: 'https://i.imgur.com/iY9g04E.png', bonus: '+50%', isEnabled: true, isLocked: false, rating: 4 },
    { id: 3, name: 'AdToWall', logo: 'https://i.imgur.com/x0iP1C9.png', isEnabled: true, isLocked: false, rating: 4 },
    { id: 4, name: 'RevU', logo: 'https://i.imgur.com/yvC5YyW.png', isLocked: true, unlockRequirement: 'Earn $2.50 to unlock', bonus: '+50%', isEnabled: true, rating: 5 },
    { id: 5, name: 'AdGate Media', logo: 'https://i.imgur.com/Q2yG7nS.png', isEnabled: true, isLocked: false, rating: 3 },
    { id: 6, name: 'MyChips', logo: 'https://i.imgur.com/yvC5YyW.png', isLocked: true, unlockRequirement: 'Earn $2.50 to unlock', bonus: '+50%', isEnabled: true, rating: 4 },
    { id: 7, name: 'MM Wall', logo: 'https://i.imgur.com/6XzWfP1.png', isEnabled: true, isLocked: false, rating: 3 },
    { id: 8, name: 'Aye-T Studios', logo: 'https://i.imgur.com/J3t5e6E.png', isEnabled: true, isLocked: false, rating: 4 },
    { id: 9, name: 'Monlix', logo: 'https://i.imgur.com/ePFr12w.png', isEnabled: true, isLocked: false, rating: 3 },
    { id: 10, name: 'Hang My Ads', logo: 'https://i.imgur.com/yvC5YyW.png', isLocked: true, unlockRequirement: 'Earn $1.00 to unlock', isEnabled: true, rating: 4 },
    { id: 11, name: 'Lootably', logo: 'https://i.imgur.com/i9nO27d.png', isEnabled: true, isLocked: false, rating: 3 },
    { id: 12, name: 'Time Wall', logo: 'https://i.imgur.com/nJgq1t7.png', isEnabled: true, isLocked: false, rating: 4 },
    { id: 13, name: 'AdGem', logo: 'https://i.imgur.com/r9f5k2Z.png', isEnabled: true, isLocked: false, rating: 4 },
];

export const SURVEY_PROVIDERS: SurveyProvider[] = [
  { id: 1, name: 'BitLabs', logo: 'https://i.imgur.com/oZznueX.png', rating: 3, type: 'BitLabs', isEnabled: true },
  { id: 2, name: 'CPX Research', logo: 'https://i.imgur.com/ssL8ALh.png', rating: 3, type: 'CPX RESEARCH', isEnabled: true },
  { id: 3, name: 'Your-Surveys', logo: 'https://i.imgur.com/pLRnBU2.png', rating: 4, type: 'Your-Surveys', isEnabled: true },
  { id: 4, name: 'Pollfish', logo: 'https://i.imgur.com/OofFwSR.png', rating: 4, type: 'Pollfish', isEnabled: true },
  { id: 5, name: 'Prime Surveys', logo: 'https://i.imgur.com/0EGYRXz.png', rating: 3, type: 'Prime Surveys', isEnabled: true },
  { id: 6, name: 'inBrain', logo: 'https://i.imgur.com/NqFthOW.png', rating: 2, type: 'inBrain', isEnabled: true },
  { id: 7, name: 'Adscend Media Surveys', logo: 'https://i.imgur.com/iY9g04E.png', rating: 4, type: 'Adscend Media', isEnabled: true },
  { id: 8, name: 'TheoremReach', logo: 'https://i.imgur.com/yvC5YyW.png', rating: 4, type: 'TheoremReach', isLocked: true, unlockRequirement: "Level 5+", isEnabled: true },
];

export const FAQ_ITEMS: FaqItem[] = [
    { question: 'What is RewardGrip.com?', answer: 'RewardGrip.com is a platform that allows you to earn money online by completing simple, engaging tasks tailored to your schedule. Become a website and game tester, share your opinions in surveys, and earn cashback on your online shopping.' },
    { question: 'How do I get started?', answer: 'Getting started is easy! Simply sign up for a free account using your email, Google, Facebook, or Steam account. Once registered, you can start browsing available tasks and earn money right away.' },
    { question: 'How do I withdraw Coins?', answer: 'You can withdraw your earnings through a wide range of options, including PayPal, gift cards (like Amazon, Visa, Walmart), and cryptocurrencies. Just go to the "Withdraw" section, select your preferred method, and follow the instructions.' },
    { question: 'How long do withdrawals take?', answer: 'Withdrawal times can vary depending on the method chosen. E-wallets like PayPal are typically fast, while other methods might take a few business days. We strive to process all withdrawals as quickly as possible.' },
];

export const REWARD_OPTIONS: RewardOption[] = [
    { name: 'PayPal', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg' },
    { name: 'ACH', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Bank_Icon.svg' },
    { name: 'Venmo', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Venmo_Logo.svg' },
    { name: 'Cash App', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Cash_App_logo.svg' },
    { name: 'Amazon', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { name: 'Apple', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
    { name: 'Visa', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg' },
    { name: 'Walmart', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Walmart_Spark.svg' },
    { name: 'Target', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Target_Corporation_logo_%28vector%29.svg' },
    { name: 'Xbox', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg' },
    { name: 'Adidas', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg' },
    { name: 'Best Buy', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Best_Buy_Logo.svg' },
    { name: 'DoorDash', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/58/DoorDash_Logo.svg' },
    { name: 'Binance', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Binance_logo.svg' },
    { name: 'Litecoin', imageUrl: 'https://i.imgur.com/JdWwak2.png' },
    { name: 'Tether', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Tether_Logo.svg' },
    { name: 'Coinbase', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Coinbase.svg' },
    { name: 'Airtm', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Airtm_logo.png' },
];

export const LEADERBOARD_USERS: LeaderboardUser[] = [
  { rank: 1, user: 'CryptoKing', avatar: 'https://i.pravatar.cc/32?u=cryptoking', earned: 1450.75, level: 98 },
  { rank: 2, user: 'Sparkb6', avatar: 'https://i.pravatar.cc/32?u=sparkb6', earned: 1230.50, level: 92 },
  { rank: 3, user: 'GamerX', avatar: 'https://i.pravatar.cc/32?u=gamerx', earned: 1100.00, level: 89 },
  { rank: 4, user: 'SoFi Plus', avatar: 'https://i.pravatar.cc/32?u=sofi', earned: 980.25, level: 85 },
  { rank: 5, user: 'raihansarker', avatar: 'https://i.pravatar.cc/32?u=raihansarker', earned: 850.00, level: 82 },
  { rank: 6, user: 'Fastslots', avatar: 'https://i.pravatar.cc/32?u=fastslots', earned: 720.80, level: 78 },
  { rank: 7, user: 'JohnDoe', avatar: 'https://i.pravatar.cc/32?u=johndoe', earned: 610.40, level: 75 },
  { rank: 8, user: 'JaneSmith', avatar: 'https://i.pravatar.cc/32?u=janesmith', earned: 550.90, level: 71 },
  { rank: 9, user: 'SurveyFan', avatar: 'https://i.pravatar.cc/32?u=surveyfan', earned: 480.15, level: 68 },
  { rank: 10, user: 'Newbie', avatar: 'https://i.pravatar.cc/32?u=newbie', earned: 320.00, level: 50 },
];

export const ACHIEVEMENTS_DATA: Achievement[] = [
  { id: 1, icon: 'fas fa-rocket', title: 'First Steps', description: 'Complete your first task.', xp: 50, progress: 1, goal: 1 },
  { id: 2, icon: 'fas fa-clipboard-check', title: 'Survey Taker', description: 'Complete 10 surveys.', xp: 100, progress: 3, goal: 10 },
  { id: 3, icon: 'fas fa-dollar-sign', title: 'Small Earner', description: 'Earn your first $10.', xp: 150, progress: 10, goal: 10 },
  { id: 4, icon: 'fas fa-star', title: 'Task Master', description: 'Complete 50 tasks.', xp: 250, progress: 12, goal: 50 },
  { id: 5, icon: 'fas fa-trophy', title: 'Top 10 Contender', description: 'Reach the top 10 on the weekly leaderboard.', xp: 500, progress: 0, goal: 1 },
  { id: 6, icon: 'fas fa-users', title: 'Social Butterfly', description: 'Refer 5 friends.', xp: 300, progress: 2, goal: 5 },
  { id: 7, icon: 'fas fa-gem', title: 'High Roller', description: 'Earn $100 in total.', xp: 1000, progress: 25.5, goal: 100 },
  { id: 8, icon: 'fas fa-calendar-check', title: 'Consistent Performer', description: 'Log in for 7 consecutive days.', xp: 200, progress: 4, goal: 7 },
];

export const CHAT_MESSAGES: ChatMessage[] = [
    { id: 1, user: 'Admin', avatar: 'https://i.pravatar.cc/32?u=admin', message: 'Welcome to the community chat! Please be respectful to others.', timestamp: '10:00 AM', isSelf: false },
    { id: 2, user: 'GamerX', avatar: 'https://i.pravatar.cc/32?u=gamerx', message: 'Hey everyone! Just completed the Torox offer, it paid out instantly!', timestamp: '10:01 AM', isSelf: false },
    { id: 3, user: 'raihansarker', avatar: 'https://i.pravatar.cc/32?u=raihansarker', message: 'That\'s awesome! I was thinking of doing that one.', timestamp: '10:02 AM', isSelf: true },
    { id: 4, user: 'SurveyFan', avatar: 'https://i.pravatar.cc/32?u=surveyfan', message: 'Any good surveys today?', timestamp: '10:03 AM', isSelf: false },
    { id: 5, user: 'CryptoKing', avatar: 'https://i.pravatar.cc/32?u=cryptoking', message: 'CPX Research is pretty good right now.', timestamp: '10:05 AM', isSelf: false },
];

export const FEATURED_OFFERS: FeaturedOffer[] = [
  {
    logo: 'https://i.imgur.com/sUwOUgD.png',
    name: 'Netflix',
    description: 'Start a trial month',
    payout: 5.00,
    rating: 5.0,
  },
  {
    logo: 'https://i.imgur.com/U16jVoT.png',
    name: 'Dice Dreams',
    description: 'Reach level 10',
    payout: 200.00,
    rating: 5.0,
  },
  {
    logo: 'https://i.imgur.com/SkxpAOW.png',
    name: 'TikTok',
    description: 'Sign up',
    payout: 2.00,
    rating: 5.0,
  }
];

export const HOW_IT_WORKS_IMAGES: string[] = [
    'https://i.imgur.com/T0bC2zZ.jpeg',
    'https://i.imgur.com/4l3z4P4.jpeg',
    'https://i.imgur.com/uJgJa8Z.jpeg'
];

export const TESTIMONIALS: Testimonial[] = [
  {
    text: "I'm really happy with the service! I've already received several €5 vouchers, and the compensation is always fair and processed without delay.",
    author: 'Tracy A.',
    rating: 5,
  },
  {
    text: "I Love RewardGrip.com. They have new surveys every day and they pay you instantly. Its easily one of the best services out there!",
    author: 'And B.',
    rating: 5,
  },
  {
    text: 'Payouts are very fast, and contact is always friendly and satisfactory. They respond very quickly to inquiries, and a good solution is always found. Thank you, and keep up the good work!',
    author: 'Gerd T.',
    rating: 5,
  },
  {
    text: 'Payouts1 are very fast, and contact is always friendly and satisfactory. They respond very quickly to inquiries, and a good solution is always found. Thank you, and keep up the good work!',
    author: 'Gerd T.',
    rating: 5,
  },
];
