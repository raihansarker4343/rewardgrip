# RewardGrip - Supabase DB & Vercel Deployment Guide
# 🇧🇩 Supabase ডাটাবেস ও Vercel এ লাইভ করার সম্পূর্ণ গাইড

এই প্রজেক্টটি এখন সম্পূর্ণভাবে **Supabase PostgreSQL Database** এবং **Vercel Serverless Fullstack** আর্কিটেকচারে কনভার্ট করা হয়েছে। আগের সমস্ত কোড, ফিচার ও পেজ সম্পূর্ণ অক্ষুণ্ণ রয়েছে।

---

## ধাপ ১: Supabase Database সেটআপ (১ মিনিট)

1. [https://supabase.com](https://supabase.com) এ লগইন করুন এবং একটি নতুন প্রোজেক্ট তৈরি করুন।
2. প্রোজেক্টের পাসওয়ার্ড মনে রাখুন বা কপি করে রাখুন।
3. **Database Schema তৈরি করুন**:
   - Supabase ড্যাশবোর্ডের বাম পাশের মেনু থেকে **SQL Editor** এ যান।
   - **New query** তে ক্লিক করুন।
   - রুট ফোল্ডারে থাকা `supabase-schema.sql` ফাইলের পুরো কোড কপি করে SQL Editor এ পেস্ট করুন।
   - **Run** বাটনে ক্লিক করুন।
   - সব টেবিল (`users`, `admins`, `transactions`, `payment_methods`, `survey_providers`, `offer_walls`, `notifications`, `ip_logs` ইত্যাদি) এবং ডিফল্ট ডেটা সাথে সাথে তৈরি হয়ে যাবে।

4. **Connection String সংগ্রহ করুন**:
   - Supabase ড্যাশবোর্ডে **Project Settings** (নিচের গিয়ার আইকন) -> **Database** এ যান।
   - নিচে স্ক্রোল করে **Connection string** সেকশনে যান।
   - **URI** সিলেক্ট করুন এবং **Transaction pooler (Port 6543)** অথবা **Session pooler (Port 5432)** কপি করুন।
   - উদাহরণ:
     ```text
     postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
     ```
   - `[YOUR-PASSWORD]` এর জায়গায় আপনার Supabase ডাটাবেসের আসল পাসওয়ার্ড বসান।

---

## ধাপ ২: Vercel এ লাইভ ডেপ্লয় (২ মিনিট)

1. আপনার কোডটি GitHub এ পুশ করুন।
2. [https://vercel.com](https://vercel.com) এ যান এবং **Add New Project** এ ক্লিক করে আপনার GitHub রিপোজিটরিটি Import করুন।
3. Vercel অটোমেটিকভাবে `Vite` ফ্রেমওয়ার্ক সনাক্ত করবে।
4. **Environment Variables** সেকশনে নিচের ভেরিয়েবলগুলো যোগ করুন:

| Variable Name | Value | বিবরণ |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://postgres.[REF]:[PASS]@...:6543/postgres?sslmode=require` | আপনার Supabase Connection String |
| `JWT_SECRET` | `9f579c919405c0e0310ad232adcc6259` | JWT সিক্রেট কি |
| `POSTBACK_SECRET` | `PolfKhN60yPmIl00avPt8fFpIf8VldQ1` | পোস্টব্যাক সিক্রেট কি |
| `VITE_CPX_APP_ID` | `302` | CPX রিসার্চ অ্যাপ আইডি |
| `TIMEWALL_SECRET_KEY`| `004b44315713489604ed52e3641ebe5d` | TimeWall সিক্রেট কি |
| `NODE_ENV` | `production` | প্রোডাকশন মোড |

5. **Deploy** বাটনে ক্লিক করুন!
6. মাত্র ১ মিনিটের মধ্যে আপনার ওয়েবসাইটটি Vercel এর গ্লোবাল CDN এ লাইভ হয়ে যাবে।

---

## কীভাবে কাজ করছে (Architecture):

1. **Frontend**: Vite + React 19 SPA হিসেবে ক্লায়েন্ট সাইডে রেন্ডার হয় (`dist` ফোল্ডারে বিল্ড হয়)।
2. **Serverless API (`/api/*`)**: Vercel Serverless Function হিসেবে `/api/index.js` সরাসরি Express Backend সার্ভারকে এক্সিকিউট করে।
3. **Database**: Supabase PostgreSQL ক্লাউড ডাটাবেসের সাথে কানেক্টেড।
4. **CORS & Routing**: `vercel.json` এর মাধ্যমে SPA ক্লায়েন্ট রাউটিং এবং ব্যাকএন্ড API রাউটিং স্বয়ংক্রিয়ভাবে হ্যান্ডেল হচ্ছে।
