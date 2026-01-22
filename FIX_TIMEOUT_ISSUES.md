# Fixing Timeout and 500 Error Issues

## Current Problem
- Functions returning 500 Internal Server Error
- Login requests timing out
- Cannot create admin accounts

## Root Causes Identified

### 1. FAUNA_SECRET_KEY Issue
- Key length is only 20 characters (should be 50+)
- Fauna keys usually start with "fn"
- The key in .env might be a placeholder or incorrect

### 2. Server Needs Restart
- Code changes (timeout increase) require server restart
- Environment variables may not be loaded properly

## Solutions

### Step 1: Verify FAUNA_SECRET_KEY

**Get the correct key:**
1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Copy the `FAUNA_SECRET_KEY` value
3. OR go to Fauna Dashboard → Security → Keys
4. Copy a Server key (starts with `fn`, ~50+ characters)

**Update .env file:**
```env
FAUNA_SECRET_KEY=fnAxxxxxxxxxxxxx...your-full-key-here
ADMIN_EMAILS=ronindesignz123@gmail.com,roninsyoutub123@gmail.com
```

### Step 2: Restart Dev Server

**Stop current server:**
- Press Ctrl+C in the server terminal window

**Restart:**
```bash
npm run dev:netlify
```

**Wait for:**
- "Server now ready on http://localhost:8888"
- Functions to be compiled

### Step 3: Test Again

After restart, test:
```powershell
# Test Fauna connection
Invoke-WebRequest -Uri "http://localhost:8888/.netlify/functions/test-fauna" -Method GET

# Create admin account
$body = @{name='Admin';email='ronindesignz123@gmail.com';password='1NCORRECT1a';phone=''} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8888/.netlify/functions/members" -Method POST -Body $body -ContentType "application/json"

# Test login
$body = @{email='ronindesignz123@gmail.com';password='1NCORRECT1a'} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8888/.netlify/functions/login" -Method POST -Body $body -ContentType "application/json"
```

## If Still Failing

### Check Server Logs
Look at the terminal where `netlify dev` is running for error messages.

### Verify Fauna Database
1. Go to https://dashboard.fauna.com/
2. Verify database exists
3. Check if collections are created
4. Verify key has Server role (not Client)

### Alternative: Test in Production
If local dev continues to fail:
1. Deploy to Netlify
2. Test on production URL
3. Production environment variables should work

## Expected Behavior After Fix

✅ test-fauna returns success
✅ Can create members
✅ Can login successfully
✅ Admin status detected correctly
✅ No 500 errors
✅ No timeouts
