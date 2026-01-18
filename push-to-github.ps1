# Automated GitHub Push Script
# Run this after creating your repository on GitHub

param(
    [Parameter(Mandatory=$true)]
    [string]$RepoUrl
)

Write-Host "`n=== Pushing to GitHub ===" -ForegroundColor Cyan

# Validate URL
if ($RepoUrl -notmatch "github\.com") {
    Write-Host "❌ Invalid GitHub URL. Please provide a valid GitHub repository URL." -ForegroundColor Red
    Write-Host "Example: https://github.com/username/repo-name.git" -ForegroundColor Yellow
    exit 1
}

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
    Write-Host "Please run:" -ForegroundColor White
    Write-Host "  git config user.name 'Your Name'" -ForegroundColor Gray
    Write-Host "  git config user.email 'your.email@example.com'`n" -ForegroundColor Gray
    exit 1
}

Write-Host "✅ Git configured: $userName <$userEmail>" -ForegroundColor Green

# Check for sensitive files
Write-Host "`n🔒 Verifying sensitive files are excluded..." -ForegroundColor Cyan
$sensitiveFiles = @("members.json", "messages.json", ".env")
$allSafe = $true

foreach ($file in $sensitiveFiles) {
    if (Test-Path $file) {
        $ignored = git check-ignore $file 2>&1
        if ($ignored -match "error" -or $ignored -eq "") {
            Write-Host "  ⚠️  $file is NOT gitignored!" -ForegroundColor Red
            $allSafe = $false
        } else {
            Write-Host "  ✅ $file is safely excluded" -ForegroundColor Green
        }
    }
}

if (-not $allSafe) {
    Write-Host "`n❌ Please fix sensitive file exclusions before pushing!" -ForegroundColor Red
    exit 1
}

# Stage all files
Write-Host "`n📦 Staging files..." -ForegroundColor Cyan
git add .

# Check if there are changes to commit
$status = git status --porcelain
if (-not $status) {
    Write-Host "⚠️  No changes to commit. Repository may already be up to date." -ForegroundColor Yellow
} else {
    # Make initial commit
    Write-Host "📝 Creating initial commit..." -ForegroundColor Cyan
    git commit -m "Initial commit: RoninDesignz portfolio" 2>&1 | Out-Null
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Commit failed. Check for errors above." -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Commit created successfully" -ForegroundColor Green
}

# Set main branch
Write-Host "`n🌿 Setting main branch..." -ForegroundColor Cyan
git branch -M main 2>&1 | Out-Null

# Check if remote already exists
$existingRemote = git remote get-url origin 2>&1
if ($existingRemote -notmatch "error") {
    Write-Host "⚠️  Remote 'origin' already exists: $existingRemote" -ForegroundColor Yellow
    $update = Read-Host "Update to new URL? (y/n)"
    if ($update -eq "y" -or $update -eq "Y") {
        git remote set-url origin $RepoUrl
        Write-Host "✅ Remote URL updated" -ForegroundColor Green
    } else {
        Write-Host "Using existing remote URL" -ForegroundColor Yellow
        $RepoUrl = $existingRemote
    }
} else {
    # Add remote
    Write-Host "🔗 Adding remote repository..." -ForegroundColor Cyan
    git remote add origin $RepoUrl 2>&1 | Out-Null
    Write-Host "✅ Remote added: $RepoUrl" -ForegroundColor Green
}

# Push to GitHub
Write-Host "`n🚀 Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "This may prompt for your GitHub credentials." -ForegroundColor Yellow
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "`nYour repository is now available at:" -ForegroundColor Cyan
    $repoWebUrl = $RepoUrl -replace "\.git$", "" -replace "git@github\.com:", "https://github.com/" -replace "github\.com:", "github.com/"
    Write-Host "  $repoWebUrl" -ForegroundColor White
} else {
    Write-Host "`n❌ Push failed. Common issues:" -ForegroundColor Red
    Write-Host "  - Authentication required (use GitHub CLI or personal access token)" -ForegroundColor Yellow
    Write-Host "  - Repository doesn't exist or you don't have access" -ForegroundColor Yellow
    Write-Host "  - Network connectivity issues" -ForegroundColor Yellow
    Write-Host "`nTry pushing manually: git push -u origin main" -ForegroundColor Cyan
}
