# Fauna DB Setup Guide

## Quick Setup for Netlify

### Step 1: Create Fauna Database

1. Go to [Fauna Dashboard](https://dashboard.fauna.com/)
2. Sign up or log in
3. Click "Create Database"
4. Name it: `ronindesignz-portfolio`
5. Select region closest to you
6. Click "Create"

### Step 2: Get API Key

1. In your database, click "Security" in the left sidebar
2. Click "New Key"
3. Name it: `Netlify Functions Key`
4. Select role: **Server** (for full access)
5. Click "Save"
6. **Copy the secret key** (you'll only see it once!)

### Step 3: Add to Netlify Environment Variables

1. Go to your Netlify site dashboard
2. Navigate to: **Site settings** → **Environment variables**
3. Click "Add a variable"
4. Key: `FAUNA_SECRET_KEY`
5. Value: Paste your Fauna secret key
6. Click "Save"

### Step 4: Deploy

The database will be automatically initialized on first function call. Collections and indexes will be created automatically.

---

## Database Schema

The following collections will be created automatically:

- **members** - User accounts
- **messages** - Contact form messages
- **projects** - Portfolio projects

### Indexes

- **members_by_email** - Unique index on email for fast lookups

---

## Testing

After setup, test with:

```bash
# Test signup
curl -X POST https://your-site.netlify.app/.netlify/functions/members \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"Test1234","phone":"1234567890"}'

# Test login
curl -X POST https://your-site.netlify.app/.netlify/functions/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'
```

---

## Troubleshooting

### Error: "Database not configured"
- Make sure `FAUNA_SECRET_KEY` is set in Netlify environment variables
- Redeploy after adding the variable

### Error: "Collection not found"
- Collections are created automatically on first use
- Wait a moment and try again

### Error: "Index not found"
- Indexes are created automatically on first use
- The function will retry on next call

---

**Note:** The database is automatically initialized when functions are called. No manual setup required!
