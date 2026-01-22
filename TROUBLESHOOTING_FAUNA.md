# Troubleshooting Fauna DB Configuration

## If you've already set FAUNA_SECRET_KEY in Netlify

### Step 1: Verify Environment Variable

1. Go to **Netlify Dashboard** → Your Site → **Site Settings** → **Environment Variables**
2. Check that `FAUNA_SECRET_KEY` is listed
3. Verify the value starts with `fn` (Fauna secret keys start with `fn`)
4. Make sure there are no extra spaces or quotes

### Step 2: Redeploy

**Important:** After adding/updating environment variables, you MUST redeploy:

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Clear cache and deploy site**
3. Wait for deployment to complete

### Step 3: Test Configuration

Test if Fauna is working by calling the test function:

```bash
# In browser or curl
https://your-site.netlify.app/.netlify/functions/test-fauna
```

Or test login directly:
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ronindesignz123@gmail.com","password":"1NCORRECT1a"}'
```

### Step 4: Check Function Logs

1. Go to **Netlify Dashboard** → Your Site → **Functions**
2. Click on a function (e.g., `login`)
3. Check the **Logs** tab for errors
4. Look for messages like:
   - `[DB] Fauna client initialized` ✅ Good
   - `FAUNA_SECRET_KEY environment variable is not set` ❌ Problem
   - `Database not configured` ❌ Problem

---

## Common Issues

### Issue 1: "Database not configured" Error

**Cause:** Environment variable not accessible in function

**Solutions:**
1. ✅ Verify variable is set in Netlify Dashboard
2. ✅ Redeploy after adding variable
3. ✅ Check variable name is exactly `FAUNA_SECRET_KEY` (case-sensitive)
4. ✅ For local dev, create `.env` file in project root:
   ```
   FAUNA_SECRET_KEY=fnAxxxxxxxxxxxxx
   ```

### Issue 2: "Authentication failed" or "Invalid key"

**Cause:** Wrong secret key or key doesn't have permissions

**Solutions:**
1. ✅ Get a new key from Fauna Dashboard
2. ✅ Make sure key has **Server** role (full access)
3. ✅ Copy the entire key (it's long, ~50+ characters)
4. ✅ Update in Netlify and redeploy

### Issue 3: "Collection not found"

**Cause:** Database not initialized yet

**Solutions:**
1. ✅ Collections are created automatically on first use
2. ✅ Wait a moment and try again
3. ✅ Call `/test-fauna` function to initialize

### Issue 4: Works locally but not in production

**Cause:** Environment variable not set in Netlify

**Solutions:**
1. ✅ Set `FAUNA_SECRET_KEY` in Netlify Dashboard (not just `.env`)
2. ✅ Redeploy after setting
3. ✅ Use `netlify dev` for local testing (reads Netlify env vars)

---

## Testing Locally

### Option 1: Using `.env` file

Create `.env` in project root:
```
FAUNA_SECRET_KEY=fnAxxxxxxxxxxxxx
ADMIN_EMAILS=ronindesignz123@gmail.com,roninsyoutub123@gmail.com
```

Then run:
```bash
npm run dev:netlify
```

### Option 2: Using Netlify CLI

```bash
# This will use environment variables from Netlify
netlify dev
```

---

## Verify Your Fauna Setup

1. **Check Fauna Dashboard:**
   - Go to https://dashboard.fauna.com/
   - Verify database exists
   - Check Security → Keys (should see your key)

2. **Test with test-fauna function:**
   ```
   https://your-site.netlify.app/.netlify/functions/test-fauna
   ```

3. **Check function logs:**
   - Netlify Dashboard → Functions → Logs
   - Look for `[DB]` prefixed messages

---

## Still Not Working?

1. **Check function logs** for specific error messages
2. **Verify key format:** Should start with `fn` and be ~50+ characters
3. **Try creating a new key** in Fauna Dashboard
4. **Ensure key has Server role** (not Client role)
5. **Redeploy** after any changes

---

## Quick Checklist

- [ ] `FAUNA_SECRET_KEY` set in Netlify Dashboard
- [ ] Key starts with `fn` and is complete
- [ ] Site redeployed after adding variable
- [ ] Key has Server role in Fauna
- [ ] Database exists in Fauna Dashboard
- [ ] Test function (`/test-fauna`) returns success
