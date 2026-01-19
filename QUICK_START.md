# Quick Start Guide

## Fast Development Server

```bash
npm run dev
```

The server starts with optimized settings for faster loading.

## Sign In/Out with Netlify

### Sign In
1. Go to `/login` or `/signup`
2. Enter your credentials
3. You'll be automatically redirected after successful login
   - Admin users → `/admin/messages`
   - Regular users → `/contact`

### Sign Out
- Click the "Logout" button in the navigation
- You'll be automatically redirected to home if on admin pages

## Testing Authentication

### Create a Test Account
1. Go to `/signup`
2. Fill in the form:
   - Name: Your name
   - Email: your-email@example.com
   - Password: At least 8 characters with uppercase, lowercase, and number
   - Phone: 10 digits (optional)

### Login
1. Go to `/login`
2. Enter your email and password
3. You'll be logged in and redirected

### Admin Access
Admin emails (set in environment or config):
- `ronindesignz123@gmail.com`
- `roninsyoutub123@gmail.com`

## Performance Optimizations

- **Faster builds**: Using esbuild minifier
- **Code splitting**: React, UI, and Three.js in separate chunks
- **Optimized dependencies**: Pre-bundled common packages
- **Request timeouts**: 10-second timeout for API calls
- **Memoized components**: Reduced re-renders

## Netlify Deployment

1. Push to GitHub
2. Connect to Netlify
3. Deploy automatically

The backend functions are automatically available at `/.netlify/functions/{function-name}`
