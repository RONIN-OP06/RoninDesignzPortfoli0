# FIXED: Login Page Not Working

## The Problem
The login page was trying to connect to `http://localhost:3000/api` but no server was running there.

## The Solution
Changed the API to **always use Netlify Functions** instead of trying to connect to a local Express server.

## How to Run Now

### Option 1: Use Netlify Dev (RECOMMENDED)
This runs both the frontend AND the backend functions:

```bash
npm run dev:netlify
```

This will:
- Start the frontend on `http://localhost:8888`
- Start Netlify Functions on the same port
- Everything works together!

### Option 2: Regular Vite Dev (Functions won't work)
```bash
npm run dev
```

This only runs the frontend. The API calls will fail because Netlify Functions aren't running.

## What Changed

1. **API Client** (`src/lib/api-client.js`)
   - Now always uses `/.netlify/functions` endpoints
   - No more `localhost:3000` dependency

2. **Config** (`src/lib/config.js`)
   - Updated to use Netlify Functions
   - Works in both dev and production

3. **Package.json**
   - Added `dev:netlify` script to run Netlify dev server

## Testing Login

1. Run: `npm run dev:netlify`
2. Go to: `http://localhost:8888/login`
3. Sign in with your credentials
4. It should work now! ✅

## If You Don't Have Netlify CLI

Install it:
```bash
npm install -g netlify-cli
```

Then run:
```bash
npm run dev:netlify
```
