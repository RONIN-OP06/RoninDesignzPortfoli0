# 🚀 Deploy to Vercel - Step by Step Guide

## ✅ Pre-Deployment Checklist

- [x] Code fixes committed and pushed to GitHub
- [x] Vercel configuration files ready (`vercel.json`, `vite.config.js`)
- [x] Build tested locally - works correctly
- [ ] Sign in to Vercel
- [ ] Import repository
- [ ] Configure project
- [ ] Set environment variables
- [ ] Deploy

## 📋 Step-by-Step Instructions

### Step 1: Sign In to Vercel

1. Go to https://vercel.com/login
2. Click **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub account
4. You'll be redirected to the Vercel dashboard

### Step 2: Import Your Repository

1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find and click on: **`RONIN-OP06/RoninDesignzPortfoli0`**
4. Click **"Import"**

### Step 3: Configure Project Settings

Vercel should auto-detect Vite, but verify these settings:

- **Framework Preset**: `Vite` (should be auto-detected)
- **Root Directory**: `./` (leave as default)
- **Build Command**: `npm run build` (should be auto-filled)
- **Output Directory**: `dist` (should be auto-filled)
- **Install Command**: `npm install` (should be auto-filled)
- **Node.js Version**: Select `18.x` or `20.x`

### Step 4: Add Environment Variables

**IMPORTANT**: You need to add these BEFORE deploying!

1. Scroll down to **"Environment Variables"** section
2. Click **"Add"** for each variable:

   **Variable 1:**
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-url.onrender.com`
     - ⚠️ **Replace with your actual Render backend URL!**
     - If you haven't deployed backend yet, use: `http://localhost:3000` (for now)
   - **Environments**: Check all three:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development

   **Variable 2:**
   - **Key**: `VITE_ADMIN_EMAILS`
   - **Value**: `ronindesignz123@gmail.com,roninsyoutub123@gmail.com`
   - **Environments**: Check all three:
     - ✅ Production
     - ✅ Preview
     - ✅ Development

3. Click **"Save"** after adding each variable

### Step 5: Deploy

1. Scroll to the bottom
2. Click **"Deploy"** button
3. Wait for the build to complete (1-3 minutes)
4. You'll see a success message with your deployment URL!

### Step 6: Get Your Deployment URL

After deployment completes:
- Your site will be live at: `https://your-project-name.vercel.app`
- **Copy this URL** - you'll need it for the backend configuration!

## 🔧 After Deployment

### If You Have a Backend Deployed:

1. Go to your Render backend dashboard
2. Update the `FRONTEND_URL` environment variable
3. Set it to your Vercel URL (e.g., `https://your-project-name.vercel.app`)
4. Render will automatically redeploy

### If You Don't Have a Backend Yet:

1. Follow `DEPLOY_NOW.md` to deploy backend to Render
2. Once backend is deployed, update `VITE_API_BASE_URL` in Vercel:
   - Go to Vercel → Your Project → Settings → Environment Variables
   - Edit `VITE_API_BASE_URL`
   - Update value to your Render backend URL
   - Click "Save"
   - Go to Deployments → Redeploy latest deployment

## ✅ Verification

After deployment, test your site:

1. Visit your Vercel URL
2. Open browser DevTools (F12) → Console tab
3. Check for any errors
4. Test navigation (click About, Portfolio, etc.)
5. Test user registration
6. Test contact form

## 🐛 Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Verify Node.js version is 18.x or 20.x
- Make sure all dependencies are in `package.json`

### 404 Errors on Routes

- The `vercel.json` file should handle this automatically
- If you see 404s, check that `vercel.json` is in your repository
- Redeploy after verifying

### API Connection Errors

- Verify `VITE_API_BASE_URL` is set correctly
- Check that backend is running and accessible
- Check browser console for CORS errors
- Ensure backend CORS allows your Vercel domain

### Environment Variables Not Working

- Make sure variable names start with `VITE_`
- No spaces around `=` sign
- Redeploy after adding/updating variables
- Check that variables are set for correct environment

## 🎉 Success!

Once deployed, your site will:
- ✅ Be accessible to everyone at your Vercel URL
- ✅ Auto-deploy on every push to GitHub
- ✅ Have HTTPS automatically enabled
- ✅ Work independently of your device

---

**Need Help?** Check `VERCEL_QUICK_FIX.md` for more troubleshooting tips!
