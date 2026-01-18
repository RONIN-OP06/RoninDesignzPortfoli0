# Deployment Guide

This guide will help you deploy the RoninDesignz portfolio website to make it accessible to public users.

## Deployment Architecture

Since this is a full-stack application, you'll need to deploy both the frontend and backend separately:

- **Frontend**: React application (static files) - Can be deployed to Vercel, Netlify, or GitHub Pages
- **Backend**: Express.js server (Node.js) - Needs a Node.js hosting service like Render, Railway, or Heroku

## Option 1: Vercel (Recommended - Easiest)

Vercel can deploy both frontend and backend from GitHub automatically.

### Frontend Deployment on Vercel

1. **Go to [Vercel](https://vercel.com)** and sign in with GitHub
2. **Import your repository** from GitHub
3. **Configure the project**:
   - Framework Preset: Vite
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables**:
   ```
   VITE_API_BASE_URL=https://your-backend-url.com
   VITE_ADMIN_EMAILS=your-admin-email@example.com
   ```

5. **Deploy** - Vercel will automatically deploy on every push to main branch

### Backend Deployment on Render (Free Tier Available)

1. **Go to [Render](https://render.com)** and sign in with GitHub
2. **Create a New Web Service**
3. **Connect your GitHub repository**
4. **Configure the service**:
   - Name: `ronindesignz-backend`
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Plan: Free (or paid for better performance)

5. **Add Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ADMIN_EMAILS=your-admin-email@example.com
   ```

6. **Deploy** - Render will automatically deploy on every push

7. **Update Frontend Environment Variable**:
   - Go back to Vercel
   - Update `VITE_API_BASE_URL` to your Render backend URL

## Option 2: Netlify + Railway

### Frontend on Netlify

1. **Go to [Netlify](https://netlify.com)** and sign in with GitHub
2. **Add new site from Git** → Select your repository
3. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Base directory: `./`

4. **Add Environment Variables**:
   ```
   VITE_API_BASE_URL=https://your-backend-url.railway.app
   VITE_ADMIN_EMAILS=your-admin-email@example.com
   ```

5. **Deploy**

### Backend on Railway

1. **Go to [Railway](https://railway.app)** and sign in with GitHub
2. **New Project** → Deploy from GitHub repo
3. **Configure**:
   - Start Command: `node server.js`
   - Add environment variables (see below)

4. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=3000
   FRONTEND_URL=https://your-site.netlify.app
   ADMIN_EMAILS=your-admin-email@example.com
   ```

## Option 3: GitHub Pages (Frontend Only)

GitHub Pages can only host static files, so you'll still need a backend service.

### Setup GitHub Pages

1. **Build the frontend**:
   ```bash
   npm run build
   ```

2. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Add to package.json scripts**:
   ```json
   "deploy": "npm run build && gh-pages -d dist"
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `/(root)`

**Note**: You'll still need to deploy the backend separately (Render, Railway, etc.)

## Post-Deployment Checklist

After deploying, ensure:

- [ ] Frontend is accessible at the deployed URL
- [ ] Backend API is accessible and responding
- [ ] Environment variables are set correctly
- [ ] CORS is configured to allow your frontend domain
- [ ] HTTPS is enabled (most platforms do this automatically)
- [ ] Test user registration and login
- [ ] Test contact form submission
- [ ] Test admin message dashboard (if applicable)

## Environment Variables Reference

### Frontend (Vite)
```
VITE_API_BASE_URL=https://your-backend-url.com
VITE_ADMIN_EMAILS=admin1@example.com,admin2@example.com
```

### Backend
```
NODE_ENV=production
PORT=3000 (or port provided by hosting service)
FRONTEND_URL=https://your-frontend-url.com
ADMIN_EMAILS=admin1@example.com,admin2@example.com
```

## Troubleshooting

### CORS Errors
If you see CORS errors, ensure:
- `FRONTEND_URL` in backend matches your frontend domain exactly
- No trailing slashes in URLs
- Backend allows your frontend origin

### API Connection Issues
- Verify `VITE_API_BASE_URL` matches your backend URL
- Check backend logs for errors
- Ensure backend is running and accessible

### Build Failures
- Check Node.js version (should be 16+)
- Verify all dependencies are in package.json
- Check build logs for specific errors

## Recommended Setup

For the easiest deployment experience, we recommend:

1. **Frontend**: Vercel (automatic deployments, free tier, great performance)
2. **Backend**: Render (free tier available, easy setup, automatic deployments)

Both services:
- Deploy automatically on git push
- Provide free SSL certificates
- Have generous free tiers
- Integrate seamlessly with GitHub

## Next Steps

1. Choose your deployment platform(s)
2. Set up the backend first (get the URL)
3. Deploy the frontend with the backend URL
4. Test all functionality
5. Share your live portfolio!

---

**Need Help?** Check the platform-specific documentation or review the error logs in your hosting service dashboard.
