# GitHub Setup Guide

This guide will help you set up this project on GitHub.

## Initial Setup

1. **Create a new repository on GitHub**
   - Go to https://github.com/new
   - Name it: `ronindesignz` (or your preferred name)
   - Choose Private (recommended) or Public
   - Don't initialize with README, .gitignore, or license (we already have these)

2. **Initialize Git (if not already done)**
   ```bash
   git init
   ```

3. **Add all files**
   ```bash
   git add .
   ```

4. **Review what you're committing**
   ```bash
   git status
   ```
   
   Make sure these files are NOT being committed:
   - `.env`
   - `members.json`
   - `messages.json`
   - `node_modules/`
   - `dist/`

5. **Create initial commit**
   ```bash
   git commit -m "Initial commit: Portfolio website with React, Express, and Three.js"
   ```

6. **Add remote repository**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/ronindesignz.git
   ```
   (Replace YOUR_USERNAME with your GitHub username)

7. **Push to GitHub**
   ```bash
   git branch -M main
   git push -u origin main
   ```

## Environment Variables

Before pushing, make sure you have a `.env.example` file that shows what environment variables are needed:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# Admin Emails (comma-separated)
VITE_ADMIN_EMAILS=ronindesignz123@gmail.com,roninsyoutub123@gmail.com

# Email Configuration (for contact form)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
RECIPIENT_EMAIL=recipient@example.com

# Server Configuration
PORT=3000
NODE_ENV=development
```

**Important:** Never commit your actual `.env` file!

## After Pushing

1. **Update package.json repository URL**
   - Edit `package.json`
   - Update the repository URL to match your GitHub repo

2. **Add repository description**
   - Go to your GitHub repo settings
   - Add a description: "Modern portfolio website with React, Express, and Three.js"

3. **Set up GitHub Pages (optional)**
   - If you want to host the site on GitHub Pages
   - Go to Settings > Pages
   - Select source branch (usually `main`)
   - Select `/dist` folder

## Security Checklist

Before pushing, verify:
- [ ] `.env` is in `.gitignore`
- [ ] `members.json` is in `.gitignore`
- [ ] `messages.json` is in `.gitignore`
- [ ] No API keys in source code
- [ ] No passwords in source code
- [ ] Admin emails can be changed via environment variables

## Next Steps

- Add a GitHub Actions workflow for CI/CD (optional)
- Set up branch protection rules
- Add collaborators if needed
- Configure repository secrets for deployment
