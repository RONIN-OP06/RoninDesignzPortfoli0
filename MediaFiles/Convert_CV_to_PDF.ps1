# Convert CV HTML to PDF
# This script will help you convert the HTML CV to PDF

$htmlFile = Join-Path $PSScriptRoot "Ronin_Beerwinkel_CV.html"
$pdfFile = Join-Path $PSScriptRoot "Ronin_Beerwinkel_CV.pdf"

Write-Host "CV HTML to PDF Converter" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""

# Check if HTML file exists
if (-not (Test-Path $htmlFile)) {
    Write-Host "Error: HTML file not found at $htmlFile" -ForegroundColor Red
    exit 1
}

Write-Host "HTML file found: $htmlFile" -ForegroundColor Green
Write-Host ""

# Method 1: Try using Microsoft Edge (Chromium-based)
$edgePath = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) {
    $edgePath = "${env:ProgramFiles}\Microsoft\Edge\Application\msedge.exe"
}

if (Test-Path $edgePath) {
    Write-Host "Found Microsoft Edge. Attempting to convert..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Opening HTML file in Edge..." -ForegroundColor Yellow
    Write-Host "Please use Edge's Print to PDF feature:" -ForegroundColor Yellow
    Write-Host "1. Press Ctrl+P or go to Menu > Print" -ForegroundColor White
    Write-Host "2. Select 'Save as PDF' as the destination" -ForegroundColor White
    Write-Host "3. Click 'Save' and save as: Ronin_Beerwinkel_CV.pdf" -ForegroundColor White
    Write-Host ""
    
    Start-Process $edgePath -ArgumentList "file:///$($htmlFile.Replace('\', '/'))"
    
    Write-Host "Alternative: Use an online HTML to PDF converter:" -ForegroundColor Cyan
    Write-Host "  - https://www.ilovepdf.com/html-to-pdf" -ForegroundColor White
    Write-Host "  - https://html2pdf.com/" -ForegroundColor White
    Write-Host "  - https://www.sejda.com/html-to-pdf" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "Microsoft Edge not found. Please use one of these methods:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Method 1: Browser Print to PDF" -ForegroundColor Cyan
    Write-Host "  1. Open Ronin_Beerwinkel_CV.html in any browser" -ForegroundColor White
    Write-Host "  2. Press Ctrl+P (or Cmd+P on Mac)" -ForegroundColor White
    Write-Host "  3. Select 'Save as PDF' as destination" -ForegroundColor White
    Write-Host "  4. Click Save" -ForegroundColor White
    Write-Host ""
    Write-Host "Method 2: Online Converter" -ForegroundColor Cyan
    Write-Host "  - https://www.ilovepdf.com/html-to-pdf" -ForegroundColor White
    Write-Host "  - https://html2pdf.com/" -ForegroundColor White
    Write-Host "  - https://www.sejda.com/html-to-pdf" -ForegroundColor White
    Write-Host ""
    Write-Host "Method 3: Install Node.js and use puppeteer" -ForegroundColor Cyan
    Write-Host "  npm install -g puppeteer" -ForegroundColor White
    Write-Host "  Then run a conversion script" -ForegroundColor White
    Write-Host ""
    
    # Try to open with default browser
    Start-Process $htmlFile
}

Write-Host "HTML file location: $htmlFile" -ForegroundColor Green
Write-Host "Target PDF location: $pdfFile" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
