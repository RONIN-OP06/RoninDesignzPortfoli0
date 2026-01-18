# Quick Deployment Guide

## 🚀 Fastest Way to Deploy (Recommended)

### Step 1: Deploy Backend to Render (5 minutes)

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `ronindesignz-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free (or Starter for better performance)

5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ADMIN_EMAILS=ronindesignz123@gmail.com,roninsyoutub123@gmail.com
   ```

6. Click **"Create Web Service"**
7. **Copy the URL** (e.g., `https://ronindesignz-backend.onrender.com`)

### Step 2: Deploy Frontend to Vercel (3 minutes)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variables:
   ```
   VITE_API_BASE_URL=https://ronindesignz-backend.onrender.com
   VITE_ADMIN_EMAILS=ronindesignz123@gmail.com,roninsyoutub123@gmail.com
   ```

6. Click **"Deploy"**
7. **Copy your frontend URL** (e.g., `https://ronindesignz.vercel.app`)

### Step 3: Update Backend CORS

1. Go back to Render dashboard
2. Update the `FRONTEND_URL` environment variable to your Vercel URL
3. Render will automatically redeploy

### Step 4: Test Your Site

Visit your Vercel URL and test:
- ✅ Homepage loads
- ✅ Portfolio gallery works
- ✅ User registration works
- ✅ Login works
- ✅ Contact form works

## 🎉 Done!

Your site is now live and accessible to everyone!

**Frontend URL**: `https://your-site.vercel.app`  
**Backend URL**: `https://your-backend.onrender.com`

## 📝 Important Notes

- **Free Tier Limits**: 
  - Render free tier spins down after 15 minutes of inactivity (first request may be slow)
  - Vercel free tier is generous and always-on

- **Upgrade Options**:
  - Render Starter ($7/month) - Always-on backend
  - Vercel Pro ($20/month) - More bandwidth and features

- **Custom Domain**: Both services allow you to add custom domains

## 🔄 Automatic Deployments

Both services automatically deploy when you push to GitHub:
- Push to `main` branch → Auto-deploy
- No manual deployment needed

## 🆘 Troubleshooting

**Backend not responding?**
- Check Render logs for errors
- Verify environment variables are set
- Wait 30 seconds for free tier to wake up

**Frontend can't connect to backend?**
- Verify `VITE_API_BASE_URL` matches your Render URL
- Check CORS settings in backend
- Ensure `FRONTEND_URL` in backend matches Vercel URL

**Build fails?**
- Check build logs in Vercel dashboard
- Verify Node.js version (should be 18+)
- Check for missing dependencies

---

**Need more help?** See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.
