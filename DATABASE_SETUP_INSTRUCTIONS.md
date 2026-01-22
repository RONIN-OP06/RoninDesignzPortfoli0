# Database Setup Instructions

## Current Status
✅ **Database code implemented** - All functions now use Fauna DB  
❌ **Database not configured** - Need to set up Fauna and add secret key

## Quick Setup Steps

### 1. Create Fauna Database

1. Go to https://dashboard.fauna.com/
2. Sign up or log in
3. Click **"Create Database"**
4. Name: `ronindesignz-portfolio`
5. Select region (closest to you)
6. Click **"Create"**

### 2. Get API Secret Key

1. In your database, click **"Security"** (left sidebar)
2. Click **"New Key"**
3. Name: `Netlify Functions Key`
4. Role: **Server** (for full access)
5. Click **"Save"**
6. **COPY THE SECRET KEY** (shown only once!)

### 3. Add to Netlify

1. Go to: https://app.netlify.com/sites/ronindesignz/configuration/env
2. Click **"Add a variable"** button
3. Key: `FAUNA_SECRET_KEY`
4. Value: Paste your secret key
5. Click **"Save"**
6. **Redeploy** your site (or wait for auto-deploy)

### 4. Setup Admin Accounts

After deployment, call the setup function:

```bash
curl -X POST https://ronindesignz.netlify.app/.netlify/functions/setup-admins
```

Or visit in browser:
https://ronindesignz.netlify.app/.netlify/functions/setup-admins

### 5. Test Login

Visit: https://ronindesignz.netlify.app/login

**Admin Credentials:**
- Email: `roninsyoutub123@gmail.com`
- Password: `1NCORRECT1a`

---

## Alternative: Check for Existing Database

If you already have a Fauna database claimed in Netlify:

1. Go to Netlify Dashboard → Your Site → **Integrations**
2. Look for **Fauna** integration
3. If found, use that database's secret key
4. Add it as `FAUNA_SECRET_KEY` environment variable

---

## Testing

After setup, test with:

```powershell
# Test login
$body = @{
    email = "roninsyoutub123@gmail.com"
    password = "1NCORRECT1a"
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://ronindesignz.netlify.app/.netlify/functions/login" `
    -Method POST -ContentType "application/json" -Body $body
```

---

## Troubleshooting

### Error: "Database not configured"
- Make sure `FAUNA_SECRET_KEY` is set in Netlify
- Redeploy after adding the variable

### Error: "401 Unauthorized" on login
- Admin accounts not created yet
- Run the `setup-admins` function first

### Error: "Collection not found"
- Collections are auto-created on first use
- Wait a moment and try again

---

**Note:** The database will be automatically initialized when functions are first called. No manual schema setup needed!
