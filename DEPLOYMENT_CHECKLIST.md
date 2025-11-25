# Deployment Checklist

## Quick Answer: Where is Data Stored?

**All user data (users, transactions) is stored in a PostgreSQL database.**

When deploying to Vercel:
- ✅ **Frontend** → Vercel (static files)
- ❌ **Backend** → NOT on Vercel (needs separate hosting like Railway/Render)
- ❌ **Database** → NOT on Vercel (needs cloud database like Supabase/Neon)

## Recommended Setup

### Option 1: Vercel + Railway + Supabase (Recommended)

1. **Frontend**: Deploy to Vercel
2. **Backend**: Deploy to Railway
3. **Database**: Use Supabase (free tier: 500MB)

### Option 2: All on Railway

1. **Frontend**: Deploy to Railway
2. **Backend**: Deploy to Railway
3. **Database**: Use Railway PostgreSQL addon

## Step-by-Step Deployment

### 1. Set Up Database (Supabase) - 5 minutes

1. Go to [supabase.com](https://supabase.com)
2. Create account → New Project
3. Wait for project to initialize
4. Go to **Settings** → **Database**
5. Copy **Connection string** (URI format)
6. Go to **SQL Editor**
7. Run SQL from `finance-backend/db-schema.sql`

**Result**: You'll have a database URL like:
```
postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres
```

### 2. Deploy Backend (Railway) - 10 minutes

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. Select your repository
5. **Add Service** → Select `finance-backend` folder
6. Add environment variables:
   ```
   DATABASE_URL=your-supabase-connection-string
   JWT_SECRET=generate-random-string-here
   SESSION_SECRET=generate-random-string-here
   FRONTEND_URL=https://your-app.vercel.app
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   NODE_ENV=production
   PORT=5000
   ```
7. Railway will auto-deploy
8. Copy your Railway URL (e.g., `https://finance-backend.railway.app`)

**Result**: Backend is live at Railway URL

### 3. Deploy Frontend (Vercel) - 5 minutes

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. **Add New Project** → Import your repository
4. Configure:
   - **Root Directory**: `finance-frontend`
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```
6. Deploy!

**Result**: Frontend is live at Vercel URL

### 4. Update OAuth Redirect URLs

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Your OAuth app → Authorized redirect URIs
3. Add: `https://your-backend.railway.app/api/auth/google/callback`

**GitHub OAuth:**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Your OAuth app → Authorization callback URL
3. Update to: `https://your-backend.railway.app/api/auth/github/callback`

### 5. Update Backend CORS

In Railway, add environment variable:
```
FRONTEND_URL=https://your-app.vercel.app
```

## Environment Variables Summary

### Backend (Railway):
```env
DATABASE_URL=postgresql://... (from Supabase)
JWT_SECRET=use-openssl-rand-hex-32
SESSION_SECRET=use-openssl-rand-hex-32
FRONTEND_URL=https://your-app.vercel.app
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
NODE_ENV=production
PORT=5000
```

### Frontend (Vercel):
```env
VITE_API_URL=https://your-backend.railway.app
```

## Generate Secrets

```bash
# Generate JWT_SECRET
openssl rand -hex 32

# Generate SESSION_SECRET
openssl rand -hex 32
```

## Testing Production

1. Visit your Vercel URL
2. Try signing up/login
3. Add a transaction
4. Check Supabase dashboard to see data

## Troubleshooting

### Database Connection Issues
- Check `DATABASE_URL` is correct
- Ensure Supabase allows connections from Railway IP
- Check SSL settings (Supabase requires SSL)

### CORS Errors
- Verify `FRONTEND_URL` in backend matches Vercel URL
- Check CORS configuration in `server.js`

### OAuth Not Working
- Verify redirect URLs match production URLs
- Check OAuth credentials are correct
- Ensure using HTTPS (required in production)

## Cost Estimate

**Free Tier:**
- Vercel: Free (hobby plan)
- Railway: $5/month (or free with credits)
- Supabase: Free (500MB database)

**Total**: ~$0-5/month for small apps

## Data Persistence

✅ **Data is persistent** - stored in PostgreSQL database
✅ **Survives deployments** - database is separate from code
✅ **Backups available** - Supabase provides automatic backups
✅ **Scalable** - can upgrade database as needed

## Next Steps After Deployment

1. Set up database backups
2. Add error monitoring (Sentry)
3. Set up domain name (optional)
4. Configure custom email (for password reset)
5. Add rate limiting
6. Set up CI/CD for automatic deployments

