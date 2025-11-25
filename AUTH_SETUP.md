# Authentication Setup Guide

This guide will help you set up authentication with Google, GitHub, and Apple Sign In.

## Backend Setup

### 1. Database Setup

Run the SQL schema to create the users table and update transactions:

```bash
cd finance-backend
psql -U your_username -d your_database -f db-schema.sql
```

Or manually run the SQL commands in `db-schema.sql`.

### 2. Environment Variables

Create a `.env` file in `finance-backend/` with the following:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/finance_db

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Session Secret (generate a strong random string)
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
7. Copy the Client ID and Client Secret to your `.env` file

### 4. GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - Application name: Finance Tracker
   - Homepage URL: `http://localhost:5173`
   - Authorization callback URL: `http://localhost:5000/api/auth/github/callback`
4. Copy the Client ID and Client Secret to your `.env` file

### 5. Apple Sign In Setup

Apple Sign In requires additional setup:
1. Go to [Apple Developer](https://developer.apple.com/)
2. Create an App ID with Sign in with Apple capability
3. Create a Service ID
4. Configure the Service ID with your domain and redirect URLs
5. Create a Key for Sign in with Apple
6. Note: Full Apple Sign In implementation requires server-side token verification

For now, Apple Sign In is implemented as a basic endpoint. For production, you should:
- Verify the identity token with Apple's servers
- Validate the JWT signature
- Check the token expiration

## Frontend Setup

The frontend is already configured to work with the backend. No additional setup needed!

## Running the Application

1. **Start the backend:**
   ```bash
   cd finance-backend
   node server.js
   ```

2. **Start the frontend:**
   ```bash
   cd finance-frontend
   npm run dev
   ```

3. **Access the application:**
   - Open `http://localhost:5173`
   - You'll be redirected to the login page
   - Sign up with email/password or use OAuth providers

## Features

- ✅ Email/Password authentication
- ✅ Google OAuth
- ✅ GitHub OAuth
- ✅ Apple Sign In (basic implementation)
- ✅ JWT token-based authentication
- ✅ Protected routes
- ✅ User-specific transactions
- ✅ Session management

## Security Notes

- **Never commit `.env` files to version control**
- Use strong, random secrets for JWT_SECRET and SESSION_SECRET
- In production, use HTTPS for all OAuth callbacks
- Implement rate limiting on authentication endpoints
- Add CSRF protection for production
- Verify Apple identity tokens server-side in production

