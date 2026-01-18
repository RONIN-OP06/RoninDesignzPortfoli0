# GitHub Setup Guide

## Step 1: Create Repository on GitHub

1. **In the browser** (already open at https://github.com/new):
   - Repository name: `ronindesignz` (or your preferred name)
   - Description: `Modern portfolio website with interactive project gallery`
   - Choose: **Private** or **Public** (your choice)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
   - Click **"Create repository"**

2. **After creating**, GitHub will show you the repository URL. It will look like:
   - `https://github.com/RONIN-OP06/ronindesignz.git` (HTTPS)
   - `git@github.com:RONIN-OP06/ronindesignz.git` (SSH)

## Step 2: Configure Git (if not already done)

Run these commands in your terminal:

```powershell
# Set your name and email (replace with your info)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Or set globally for all repositories:
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 3: Connect and Push

After creating the repository, **copy the repository URL** from GitHub and run:

```powershell
# Make initial commit
git add .
git commit -m "Initial commit: RoninDesignz portfolio"

# Set main branch
git branch -M main

# Add remote (replace YOUR_REPO_URL with the URL from GitHub)
git remote add origin YOUR_REPO_URL

# Push to GitHub
git push -u origin main
```

## Alternative: Use the Automated Script

After creating the repository, you can provide me the repository URL and I can help you set it up automatically!

---

## What's Already Prepared

✅ `.gitignore` - Excludes sensitive files  
✅ `README.md` - Complete documentation  
✅ `CONTRIBUTING.md` - Contribution guidelines  
✅ `PRE_PUSH_CHECKLIST.md` - Security checklist  
✅ All project files are ready to commit

## Security Notes

The following files are **automatically excluded** from git:
- `members.json` (user data)
- `messages.json` (messages)
- `.env` (environment variables)
- `node_modules/` (dependencies)
- `dist/` (build output)
