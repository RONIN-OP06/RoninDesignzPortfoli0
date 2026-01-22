# 🚨 CRITICAL ISSUE: /tmp is Ephemeral in Netlify Functions

## Problem Discovered

**Root Cause:** `/tmp` directory in Netlify Functions is **ephemeral and instance-specific**.

### What This Means:
- Each function invocation gets its own isolated `/tmp` directory
- Files written in one invocation are NOT visible to other invocations
- Files are cleared between cold starts
- Different function instances don't share `/tmp` storage

### Evidence:
```
Test: Create account → Status 201 (success)
Test: Get members → Count: 0 (empty!)
```

The account was "created" but immediately lost because:
1. `members.js` writes to `/tmp/members.json` in Container A
2. `login.js` reads from `/tmp/members.json` in Container B
3. Container B has an empty `/tmp` directory
4. Login fails because account doesn't exist

---

## Solutions

### Option 1: Use a Database (RECOMMENDED)
- **Fauna DB** - Serverless, free tier available
- **MongoDB Atlas** - Free tier available
- **Supabase** - PostgreSQL, free tier
- **PlanetScale** - MySQL, free tier

### Option 2: Use Netlify's Build Plugin Storage
- Store data in build artifacts
- Limited to build-time data

### Option 3: Use External Storage
- AWS S3
- Cloudinary
- Any external storage service

---

## Immediate Fix Required

We need to migrate from file-based storage to a database. The current file-based approach **will never work** in Netlify Functions due to the ephemeral nature of `/tmp`.

---

**Status:** BLOCKING - Login system cannot work with current architecture
