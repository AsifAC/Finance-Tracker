# Deployment Guide

## Current Architecture

Your application consists of:
1. **Frontend** (React/Vite) - Can be deployed to Vercel
2. **Backend** (Express.js) - Needs separate hosting
3. **Database** (PostgreSQL) - Needs cloud database service

## Where User Data is Stored

All user data (users, transactions) is stored in a **PostgreSQL database**. This database needs to be hosted separately from Vercel.

## Deployment Options

### Option 1: Recommended - Full Stack Deployment

#### Frontend: Vercel
- Deploy your React app to Vercel
- Vercel handles frontend hosting automatically

#### Backend: Railway / Render / Fly.io
++++++++++++++++++++
- Deploy Express backend to Railway, Render, or Fly.io
- These platforms support Node.js applications

#### Database: Supabase / Neon / Railway / AWS RDS
- Host PostgreSQL database on a managed service
- Recommended: **Supabase** (free tier available) or **Neon** (serverless PostgreSQL)

### Option 2: All-in-One Solutions

#### Vercel + Vercel Serverless Functions
- Convert Express routes to Vercel serverless functions
- Use Supabase/Neon for database
- Everything managed in one place

#### Railway (Full Stack)
- Deploy both frontend and backend to Railway
- Use Railway's PostgreSQL addon
- Single platform for everything

## Step-by-Step: Deploying to Vercel + Supabase

### 1. Set Up Database (Supabase)

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Go to Settings → Database → Connection string
4. Copy the connection string (looks like: `postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres`)

### 2. Run Database Schema

1. Go to Supabase SQL Editor
2. Run the SQL from `finance-backend/db-schema.sql`
3. This creates the `users` table and updates `transactions` table

### 3. Deploy Backend (Railway)

1. Go to [railway.app](https://railway.app) and create an account
2. Create a new project
3. Connect your GitHub repository
4. Add a new service → Deploy from GitHub repo
5. Select `finance-backend` folder
6. Add environment variables:
   ```
   DATABASE_URL=your-supabase-connection-string
   JWT_SECRET=your-jwt-secret
   SESSION_SECRET=your-session-secret
   FRONTEND_URL=https://your-vercel-app.vercel.app
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   PORT=5000
   ```
7. Railway will automatically deploy and give you a URL like: `https://your-app.railway.app`

### 4. Deploy Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) and create an account
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `finance-frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variables:
   ```
   VITE_API_URL=https://your-app.railway.app
   ```
5. Deploy!

### 5. Update OAuth Redirect URLs

Update your OAuth providers with production URLs:

**Google OAuth:**
- Redirect URI: `https://your-app.railway.app/api/auth/google/callback`

**GitHub OAuth:**
- Authorization callback URL: `https://your-app.railway.app/api/auth/github/callback`

## Alternative: Vercel Serverless Functions

If you want everything on Vercel, you can convert your Express backend to serverless functions:

### Structure:
```
finance-frontend/
  api/
    auth/
      [provider].js  (serverless functions)
    transactions/
      index.js
```

This requires refactoring but keeps everything on Vercel.

## Database Hosting Options Comparison

| Service | Free Tier | Pros | Cons |
|---------|-----------|------|------|
| **Supabase** | ✅ 500MB | Easy setup, includes auth, dashboard | Limited free tier |
| **Neon** | ✅ 0.5GB | Serverless, auto-scaling | Newer service |
| **Railway** | ❌ | Simple, integrated | No free tier |
| **Render** | ✅ 90 days | Free PostgreSQL | Sleeps after inactivity |
| **AWS RDS** | ❌ | Enterprise-grade | Complex setup |
| **ElephantSQL** | ✅ 20MB | Simple | Very limited free tier |

## Recommended Setup for Production

1. **Frontend**: Vercel (free tier available)
2. **Backend**: Railway or Render (both have free tiers)
3. **Database**: Supabase or Neon (both have free tiers)

## Environment Variables Checklist

### Backend (.env):
```env
DATABASE_URL=postgresql://...
JWT_SECRET=generate-strong-random-string
SESSION_SECRET=generate-strong-random-string
FRONTEND_URL=https://your-app.vercel.app
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
PORT=5000
```

### Frontend (.env):
```env
VITE_API_URL=https://your-backend.railway.app
```

## Important Notes

1. **Never commit `.env` files** - Use environment variables in hosting platforms
2. **Update CORS** - Add your production frontend URL to backend CORS settings
3. **HTTPS Required** - OAuth providers require HTTPS in production
4. **Database Backups** - Set up automatic backups for production
5. **Rate Limiting** - Add rate limiting to prevent abuse
6. **Monitoring** - Set up error tracking (Sentry, etc.)

## Quick Start Commands

### Local Testing with Production Database:
```bash
# Backend
cd finance-backend
npm install
# Set DATABASE_URL in .env
node server.js

# Frontend
cd finance-frontend
npm install
# Set VITE_API_URL in .env
npm run dev
```

## Cost Estimate (Free Tier)

- **Vercel**: Free (hobby plan)
- **Railway**: $5/month (or free with credits)
- **Supabase**: Free (up to 500MB)
- **Total**: ~$0-5/month for small apps

