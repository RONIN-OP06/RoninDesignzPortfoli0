# GitHub Setup Script for RoninDesignz
# Run this script after creating your GitHub repository

Write-Host "`n=== GitHub Repository Setup ===" -ForegroundColor Cyan

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
}

# Check git config
$userName = git config user.name
$userEmail = git config user.email

if (-not $userName -or -not $userEmail) {
    Write-Host "`n⚠️  Git user configuration needed!" -ForegroundColor Yellow
    Write-Host "Please set your git identity:" -ForegroundColor White
    Write-Host "  git config user.name 'Your Name'" -ForegroundColor Gray
    Write-Host "  git config user.email 'your.email@example.com'" -ForegroundColor Gray
    Write-Host "`nOr set globally:" -ForegroundColor White
    Write-Host "  git config --global user.name 'Your Name'" -ForegroundColor Gray
    Write-Host "  git config --global user.email 'your.email@example.com'`n" -ForegroundColor Gray
} else {
    Write-Host "✅ Git configured: $userName <$userEmail>" -ForegroundColor Green
}

# Check for sensitive files
Write-Host "`n🔒 Checking for sensitive files..." -ForegroundColor Cyan
$sensitiveFiles = @("members.json", "messages.json", ".env")
$foundSensitive = $false

foreach ($file in $sensitiveFiles) {
    if (Test-Path $file) {
        $status = git check-ignore $file 2>&1
        if ($status -match "error") {
            Write-Host "  ⚠️  $file exists and is NOT gitignored!" -ForegroundColor Red
            $foundSensitive = $true
        } else {
            Write-Host "  ✅ $file is gitignored" -ForegroundColor Green
        }
    }
}

if ($foundSensitive) {
    Write-Host "`n⚠️  Remove sensitive files from tracking:" -ForegroundColor Yellow
    Write-Host "  git rm --cached members.json messages.json .env" -ForegroundColor Gray
}

# Stage files
Write-Host "`n📦 Staging files..." -ForegroundColor Cyan
git add .

# Show what will be committed
Write-Host "`n📋 Files to be committed:" -ForegroundColor Cyan
git status --short | Select-Object -First 20

# Ask for repository URL
Write-Host "`n📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Create a new repository on GitHub (if you haven't already)" -ForegroundColor White
Write-Host "2. Copy the repository URL (e.g., https://github.com/username/repo-name.git)" -ForegroundColor White
Write-Host "3. Run these commands:" -ForegroundColor White
Write-Host "`n   git commit -m 'Initial commit: RoninDesignz portfolio'" -ForegroundColor Gray
Write-Host "   git branch -M main" -ForegroundColor Gray
Write-Host "   git remote add origin <YOUR_REPO_URL>" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host "`nOr provide the repository URL and I can help you set it up!`n" -ForegroundColor Cyan
