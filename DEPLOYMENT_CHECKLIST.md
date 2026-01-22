# Deployment Checklist

## Pre-Deployment Verification

### ✅ Completed
- [x] Fauna DB integration verified
- [x] All functions use Fauna DB correctly
- [x] Environment variables configured
- [x] Dev server tested locally
- [x] Code changes verified

### ⏳ Pending
- [ ] Admin login tested manually
- [ ] Admin accounts created in Fauna
- [ ] All functionality verified

---

## Manual Testing Steps

### 1. Test Admin Login
1. Open: `http://localhost:8888/login`
2. Enter:
   - Email: `ronindesignz123@gmail.com`
   - Password: `1NCORRECT1a`
3. Click "Sign In"
4. Expected: Redirect to `/admin/messages`

### 2. If Login Fails
**Option A: Create Admin Account via Signup**
1. Go to: `http://localhost:8888/signup`
2. Fill form with admin credentials
3. Sign up
4. Try login again

**Option B: Create Admin Account via API**
```bash
# Create admin account
curl -X POST http://localhost:8888/.netlify/functions/members \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin User","email":"ronindesignz123@gmail.com","password":"1NCORRECT1a","phone":""}'
```

**Option C: Use Setup Function**
```bash
# Setup admin accounts
curl -X POST http://localhost:8888/.netlify/functions/setup-admins
```

### 3. Test Other Features
- [ ] Sign up (new user)
- [ ] Contact form
- [ ] Admin messages page
- [ ] Navigation works

---

## Deployment Steps

### Step 1: Commit Changes
```bash
git add .
git commit -m "feat: Complete Fauna DB integration and verify all functions"
```

### Step 2: Push to Repository
```bash
git push origin main
# or
git push origin master
```

### Step 3: Verify Netlify Deployment
1. Go to Netlify Dashboard
2. Check Deploys tab
3. Wait for build to complete
4. Verify deployment status

### Step 4: Post-Deployment Testing
1. Test login on production URL
2. Verify admin accounts exist
3. Test all functions
4. Check function logs for errors

---

## Environment Variables in Netlify

Ensure these are set in Netlify Dashboard:
- `FAUNA_SECRET_KEY` - Your Fauna secret key
- `ADMIN_EMAILS` - Admin email addresses (optional, defaults in code)

**To set:**
1. Netlify Dashboard → Site Settings → Environment Variables
2. Add/verify `FAUNA_SECRET_KEY`
3. Redeploy if added/updated

---

## Post-Deployment: Create Admin Accounts

After deployment, create admin accounts:

**Option 1: Via Setup Function**
```
https://your-site.netlify.app/.netlify/functions/setup-admins
```
(POST request)

**Option 2: Via Signup Page**
1. Go to signup page
2. Create account with admin email
3. Login will automatically detect admin status

---

## Rollback Plan

If deployment fails:
1. Check Netlify build logs
2. Verify environment variables
3. Check function logs
4. Rollback to previous deployment if needed

---

## Success Criteria

✅ Admin can log in
✅ Admin redirects to `/admin/messages`
✅ Regular users can sign up
✅ Contact form works
✅ All functions respond correctly
✅ No console errors
