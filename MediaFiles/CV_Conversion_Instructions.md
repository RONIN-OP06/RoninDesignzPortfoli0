# CV PDF Conversion Instructions

Your professional CV has been created in HTML format. Here are several ways to convert it to PDF:

## ✅ Method 1: Browser Print to PDF (Recommended - Easiest)

1. **Open the HTML file:**
   - Navigate to: `MediaFiles/Ronin_Beerwinkel_CV.html`
   - Double-click the file to open it in your default browser
   - OR right-click → "Open with" → Choose your browser (Chrome, Edge, Firefox)

2. **Print to PDF:**
   - Press `Ctrl + P` (or `Cmd + P` on Mac)
   - In the print dialog, select **"Save as PDF"** or **"Microsoft Print to PDF"** as the destination
   - Click **"More settings"** and ensure:
     - Margins: Default or Minimum
     - Scale: 100%
     - Background graphics: ✅ Enabled (important for styling)
   - Click **"Save"**
   - Save as: `Ronin_Beerwinkel_CV.pdf` in the MediaFiles folder

## 🌐 Method 2: Online HTML to PDF Converter

1. Visit one of these free online converters:
   - https://www.ilovepdf.com/html-to-pdf
   - https://html2pdf.com/
   - https://www.sejda.com/html-to-pdf

2. Upload `Ronin_Beerwinkel_CV.html`
3. Convert and download the PDF

## 💻 Method 3: Using PowerShell Script (Windows)

1. Open PowerShell in the MediaFiles folder
2. Run: `.\Convert_CV_to_PDF.ps1`
3. Follow the on-screen instructions

## 📝 Method 4: Using Node.js (Advanced)

If you want to automate the conversion:

```bash
cd MediaFiles
npm install puppeteer
node convert-to-pdf.js
```

---

## 📄 Files Created

- ✅ `Ronin_Beerwinkel_CV.html` - Professional HTML CV (ready to convert)
- ✅ `Ronin_Beerwinkel_CV_Polished.md` - Markdown version
- ✅ `Ronin_Beerwinkel_CV_ATS.txt` - ATS-friendly text version
- ✅ `Ronin_Beerwinkel_CV.md` - Standard markdown version

## ✨ Tips for Best PDF Quality

- Use **Chrome** or **Edge** browser for best results
- Enable **"Background graphics"** in print settings
- Set margins to **"Default"** or **"Minimum"**
- Ensure scale is set to **100%**
- Preview before saving to check formatting

---

**Recommended:** Use Method 1 (Browser Print to PDF) for the best results with minimal effort!
