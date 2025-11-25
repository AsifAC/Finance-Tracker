# Buckaroo Frontend

React frontend application for the Buckaroo personal finance tracker.

## Overview

This is the client-side application built with React 19 and Vite. It provides a modern, responsive interface for tracking personal finances with real-time visualizations.

## Features

- **Dashboard**: Overview of financial data with summary cards
- **Transaction Management**: Add, edit, and delete income/expense transactions
- **Networth Tracking**: Set and track initial networth over time
- **Data Visualizations**:
  - Networth area chart showing financial progress
  - Income vs Expenses bar chart
  - Spending by category pie chart
- **Authentication**: Login, signup, and guest mode
- **Protected Routes**: Secure access to user-specific data
- **Guest Mode**: Try the app without signing up (data stored in localStorage)

## Tech Stack

- **React 19** - UI framework
- **Vite 7** - Build tool and dev server
- **React Router 7** - Client-side routing
- **Recharts 3** - Data visualization library
- **Axios** - HTTP client for API calls
- **PropTypes** - Runtime type checking

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

The Vite dev server is configured to proxy `/api` requests to the backend server running on `http://localhost:5001`.

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
finance-frontend/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── TransactionForm.jsx
│   │   ├── TransactionList.jsx
│   │   ├── TransactionItem.jsx
│   │   ├── InitialNetworthForm.jsx
│   │   ├── NetworthGraph.jsx
│   │   ├── IncomeExpenseGraph.jsx
│   │   ├── SpendingGraph.jsx
│   │   └── ProtectedRoute.jsx
│   ├── contexts/            # React context providers
│   │   ├── AuthContext.jsx  # Authentication context
│   │   └── AuthContext.js   # Context definition
│   ├── hooks/               # Custom React hooks
│   │   └── useAuth.js       # Authentication hook
│   ├── pages/               # Page components
│   │   ├── LoginPage.jsx    # Login/signup page
│   │   ├── Dashboard.jsx    # Main dashboard
│   │   └── AuthCallback.jsx  # OAuth callback handler
│   ├── utils/               # Utility functions
│   │   ├── api.js           # Axios instance and interceptors
│   │   └── guestStorage.js  # Guest mode localStorage utilities
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
└── vercel.json              # Vercel deployment config
```

## Key Components

### Pages

- **LoginPage**: Authentication interface with local signup/login and OAuth options
- **Dashboard**: Main application interface with graphs, transactions, and forms
- **AuthCallback**: Handles OAuth redirects and token processing

### Components

- **TransactionForm**: Form for adding new transactions
- **TransactionList**: Displays list of all transactions
- **TransactionItem**: Individual transaction card with delete functionality
- **InitialNetworthForm**: Form for setting/updating initial networth
- **NetworthGraph**: Area chart showing networth over time
- **IncomeExpenseGraph**: Bar chart comparing income and expenses
- **SpendingGraph**: Pie chart showing spending by category
- **ProtectedRoute**: Route guard for authenticated access

### Contexts

- **AuthContext**: Manages authentication state, user data, and auth methods (login, signup, logout, guest mode)

### Utilities

- **api.js**: Centralized Axios instance with base URL configuration and error handling
- **guestStorage.js**: Functions for managing guest transactions in localStorage

## Authentication Flow

1. User visits login page
2. Can choose to:
   - Sign up with email/password
   - Login with email/password
   - Sign in with Google/GitHub (OAuth)
   - Sign in as Guest (no authentication)
3. Authenticated users receive JWT token stored in localStorage
4. Token is sent in `Authorization` header for API requests
5. Protected routes check authentication status

## Guest Mode

Guest mode allows users to try the app without creating an account:

- Data is stored in browser localStorage
- All features work the same as authenticated users
- Data is lost when:
  - Browser data is cleared
  - User logs out
  - User switches browsers/devices

## API Integration

The frontend communicates with the backend API through:

- **Development**: Vite proxy redirects `/api/*` to `http://localhost:5001`
- **Production**: Uses `VITE_API_URL` environment variable or defaults to `http://localhost:5001`

All API calls go through the centralized `api.js` utility which handles:
- Base URL configuration
- Request/response interceptors
- Error handling and user-friendly error messages
- Token management

## Environment Variables

Create a `.env` file for production builds:

```env
VITE_API_URL=https://your-backend-url.com
```

## Styling

The application uses inline styles for all components. This provides:
- Component-scoped styling
- No CSS conflicts
- Easy customization
- No build-time CSS processing needed

## Routing

The app uses React Router for client-side routing:

- `/login` - Login/signup page
- `/auth/callback` - OAuth callback handler
- `/` - Dashboard (protected route)
- All other routes redirect to `/`

## Deployment

The frontend can be deployed to any static hosting service:

- **Vercel** (recommended) - See `vercel.json` for configuration
- **Netlify**
- **GitHub Pages**
- Any static file hosting

For deployment instructions, see the main [DEPLOYMENT.md](../DEPLOYMENT.md).

## Development Notes

- Fast Refresh is enabled for hot module replacement
- ESLint is configured for code quality
- The app uses React 19 features
- All components use functional components with hooks
- PropTypes are used for runtime type checking

## Troubleshooting

### Build errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

### API connection issues
- Ensure backend is running on port 5001
- Check `vite.config.js` proxy configuration
- Verify `VITE_API_URL` is set correctly for production

### Authentication issues
- Clear localStorage and try again
- Check browser console for error messages
- Verify backend authentication endpoints are working

## License

Licensed under the Apache License, Version 2.0. See [../LICENSE](../LICENSE) for details.
