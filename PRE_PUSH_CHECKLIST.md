# Pre-Push to GitHub Checklist

Before pushing this project to GitHub, please verify the following:

## ✅ Security Checks

- [ ] **Sensitive files are gitignored:**
  - `members.json` - Contains user passwords (hashed) and personal data
  - `messages.json` - Contains user messages and contact information
  - `.env` - Contains environment variables and secrets
  - All `.env.*` variants

- [ ] **No sensitive data in code:**
  - [ ] Check `src/lib/config.js` - Admin emails are hardcoded (consider moving to env)
  - [ ] Check `src/lib/config.js` - API_BASE_URL has hardcoded IP (consider using env)
  - [ ] No API keys or passwords in source code
  - [ ] No database connection strings

- [ ] **Verify gitignore is working:**
  ```bash
  git status
  # Should NOT show: members.json, messages.json, .env, node_modules/, dist/
  ```

## 📝 Documentation

- [ ] README.md is up to date
- [ ] CONTRIBUTING.md is created
- [ ] `.env.example` exists (if applicable)
- [ ] All installation steps are documented

## 🧹 Code Cleanup

- [ ] Remove console.log statements (or use proper logging)
- [ ] Remove commented-out code
- [ ] Remove test files (they're gitignored, but check)
- [ ] Remove temporary scripts

## 🔍 Final Review

- [ ] Test the project builds: `npm run build`
- [ ] Test the project runs: `npm start` and `npm run dev`
- [ ] Review all committed files: `git diff`
- [ ] Check file sizes (large media files might need Git LFS)

## 📦 Optional Improvements

- [ ] Consider adding a LICENSE file
- [ ] Consider moving admin emails to environment variables
- [ ] Consider moving API_BASE_URL to environment variables
- [ ] Add repository URL to package.json (after creating GitHub repo)

## 🚀 Ready to Push

Once all checks are complete:

1. Initialize git (if not already): `git init`
2. Add files: `git add .`
3. Review what's being added: `git status`
4. Commit: `git commit -m "Initial commit"`
5. Add remote: `git remote add origin <your-repo-url>`
6. Push: `git push -u origin main` (or `master`)

---

**Note:** If `members.json` or `messages.json` are already tracked by git, remove them:
```bash
git rm --cached members.json messages.json
git commit -m "Remove sensitive data files from tracking"
```
