# Buckaroo - Personal Finance Tracker

🌐 **Live Demo**: [finance-tracker-omega-brown.vercel.app](https://finance-tracker-omega-brown.vercel.app)

A modern, full-stack personal finance tracking application built with React and Node.js. Track your income, expenses, networth, and spending patterns with beautiful visualizations.

## Features

- **Transaction Management**: Add, edit, and delete income and expense transactions
- **Networth Tracking**: Set initial networth and track changes over time
- **Visual Analytics**: 
  - Networth graph showing financial progress over time
  - Income vs Expenses bar chart
  - Spending by category pie chart
- **Authentication**: 
  - Local signup/login
  - OAuth with Google and GitHub
  - Guest mode for quick access without signup
- **User-Specific Data**: All transactions are tied to user accounts
- **Responsive Design**: Modern UI with inline styling

## Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **PropTypes** - Type checking

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **PostgreSQL** - Database
- **Passport.js** - Authentication (Google, GitHub OAuth)
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database (local or cloud)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd financial-tracker
   ```

2. **Install frontend dependencies**
   ```bash
   cd finance-frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../finance-backend
   npm install
   ```

## Configuration

### Database Setup

1. Create a PostgreSQL database (locally or on Supabase/Neon)

2. Run the schema:
   ```bash
   psql -d your_database_name -f finance-backend/db-schema.sql
   ```

### Environment Variables

Create a `.env` file in `finance-backend/`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-secret-key-change-in-production
SESSION_SECRET=your-session-secret-change-in-production
PORT=5001

# Optional: OAuth (only needed if using Google/GitHub login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Optional: Frontend URL for OAuth callbacks
FRONTEND_URL=http://localhost:5173
```

For detailed OAuth setup instructions, see [AUTH_SETUP.md](./AUTH_SETUP.md).

## Running the Application

### Development Mode

1. **Start the backend server** (in one terminal):
   ```bash
   cd finance-backend
   npm start
   ```
   The server will run on `http://localhost:5001`

2. **Start the frontend dev server** (in another terminal):
   ```bash
   cd finance-frontend
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

### Production Build

1. **Build the frontend**:
   ```bash
   cd finance-frontend
   npm run build
   ```

2. **Start the backend**:
   ```bash
   cd finance-backend
   npm start
   ```

## Project Structure

```
financial-tracker/
├── finance-frontend/          # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── contexts/         # React context providers
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/             # Page components
│   │   └── utils/             # Utility functions
│   ├── public/                # Static assets
│   └── vite.config.js         # Vite configuration
│
├── finance-backend/           # Node.js backend API
│   ├── server.js              # Express server setup
│   ├── auth.js                # Authentication logic
│   └── db-schema.sql          # Database schema
│
├── AUTH_SETUP.md             # OAuth setup guide
├── DEPLOYMENT.md             # Deployment instructions
└── DEPLOYMENT_CHECKLIST.md   # Deployment checklist
```

## Guest Mode

Buckaroo includes a guest mode that allows users to try the app without creating an account. Guest data is stored in browser localStorage and is cleared when the user logs out or clears browser data.

**Note**: Guest data is only stored locally and will be lost if:
- Browser data is cleared
- User logs out
- User switches browsers/devices

## Authentication

The app supports multiple authentication methods:

1. **Local Authentication**: Email and password signup/login
2. **OAuth**: Sign in with Google or GitHub (requires setup)
3. **Guest Mode**: Quick access without authentication

All authenticated users have their own isolated transaction data.

## API Endpoints

### Authentication
- `POST /auth/signup` - Create new account
- `POST /auth/login` - Login with email/password
- `GET /auth/me` - Get current user (protected)
- `POST /auth/logout` - Logout
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/github` - GitHub OAuth

### Transactions (Protected)
- `GET /transactions` - Get all user transactions
- `POST /transactions` - Create new transaction
- `PUT /transactions/:id` - Update transaction
- `DELETE /transactions/:id` - Delete transaction

## Deployment

For detailed deployment instructions, see:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Comprehensive deployment guide
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Step-by-step checklist

The app can be deployed to:
- **Frontend**: Vercel, Netlify, or any static hosting
- **Backend**: Railway, Render, or any Node.js hosting
- **Database**: Supabase, Neon, or any PostgreSQL provider

## Development Notes

- The backend runs on port **5001** (port 5000 is often used by AirPlay on macOS)
- The Vite dev server proxies `/api` requests to the backend
- Guest mode uses localStorage for data persistence
- All API routes are protected except signup/login

## Troubleshooting

### Backend won't start
- Check if port 5001 is available
- Verify DATABASE_URL is set correctly
- Ensure PostgreSQL is running (if using local database)

### OAuth not working
- Verify OAuth credentials are set in `.env`
- Check callback URLs match your OAuth app settings
- See [AUTH_SETUP.md](./AUTH_SETUP.md) for detailed setup

### Frontend can't connect to backend
- Ensure backend is running on port 5001
- Restart the frontend dev server after changing `vite.config.js`
- Clear browser cache and hard refresh

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](./LICENSE) for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

