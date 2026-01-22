# Quick Manual Test Guide

## Test Admin Login Now

### Step 1: Open Login Page
Open in your browser:
```
http://localhost:8888/login
```

### Step 2: Enter Credentials
- **Email:** `ronindesignz123@gmail.com`
- **Password:** `1NCORRECT1a`

### Step 3: Click "Sign In"

### Expected Results

**✅ Success:**
- Redirects to `/admin/messages`
- Shows admin dashboard
- Navigation shows "Messages" link

**❌ If "Invalid email or password":**
The admin account doesn't exist yet. Create it:

**Option A: Via Signup Page**
1. Go to: `http://localhost:8888/signup`
2. Fill form with admin credentials
3. Sign up
4. Try login again

**Option B: Via API (PowerShell)**
```powershell
$body = @{
    name = "Admin User"
    email = "ronindesignz123@gmail.com"
    password = "1NCORRECT1a"
    phone = ""
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8888/.netlify/functions/members" `
    -Method POST -Body $body -ContentType "application/json"
```

**Option C: Via Setup Function**
```powershell
Invoke-WebRequest -Uri "http://localhost:8888/.netlify/functions/setup-admins" `
    -Method POST -ContentType "application/json"
```

---

## After Successful Login Test

Once login works:
1. ✅ Test complete
2. ✅ Ready to deploy
3. Proceed with deployment steps
