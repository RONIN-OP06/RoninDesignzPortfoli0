# Setting Up Local Environment for Testing

## Issue
The dev server is running but functions are failing because `FAUNA_SECRET_KEY` is not available locally.

## Solution: Get FAUNA_SECRET_KEY from Netlify

### Step 1: Access Netlify Dashboard
1. Go to https://app.netlify.com
2. Navigate to your site
3. Go to **Site Settings** → **Environment Variables**
4. Find `FAUNA_SECRET_KEY`
5. Copy the value (it starts with `fn`)

### Step 2: Create .env File
Create a `.env` file in the project root:

```env
FAUNA_SECRET_KEY=fnAxxxxxxxxxxxxx
ADMIN_EMAILS=ronindesignz123@gmail.com,roninsyoutub123@gmail.com
```

**Important:** Add `.env` to `.gitignore` to keep it secret!

### Step 3: Restart Dev Server
1. Stop the current dev server (Ctrl+C)
2. Restart: `npm run dev:netlify`
3. The server will now have access to FAUNA_SECRET_KEY

### Step 4: Test
1. Test Fauna connection: `http://localhost:8888/.netlify/functions/test-fauna`
2. Setup admin accounts: `http://localhost:8888/.netlify/functions/setup-admins` (POST)
3. Test admin login: `http://localhost:8888/login`

---

## Alternative: Link Netlify Site

If your site is linked to Netlify, you can pull env vars:

```bash
# Link site (if not already linked)
netlify link

# Pull environment variables
netlify env:list

# The dev server should automatically use Netlify env vars
```

---

## After Testing: Deploy

Once everything works locally:
1. Commit your changes
2. Push to your repository
3. Netlify will auto-deploy
4. Or manually trigger: Netlify Dashboard → Deploys → Trigger deploy
