# Google Sheets Integration Setup Guide

## Step-by-Step Instructions

### Step 1: Create Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Newsletter Signups" (or any name you prefer)
4. Add headers in row 1:
   - Column A: `Timestamp`
   - Column B: `Email`
   - Column C: `Name`
5. **Copy the Spreadsheet ID** from the URL:
   - URL looks like: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - The ID is the long string between `/d/` and `/edit`

### Step 2: Create Google Apps Script
1. Go to [script.google.com](https://script.google.com)
2. Click **"New Project"**
3. Delete the default code and paste this:

```javascript
function doPost(e) {
  try {
    // Replace YOUR_SPREADSHEET_ID with the ID from Step 1
    const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const data = JSON.parse(e.postData.contents);
    
    sheet.getActiveSheet().appendRow([
      new Date(),
      data.email || '',
      data.name || 'Anonymous'
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. **Replace `YOUR_SPREADSHEET_ID`** with your actual spreadsheet ID from Step 1
5. Click **"Save"** (💾 icon) or press `Cmd+S` / `Ctrl+S`
6. Name your project: "Newsletter Webhook" (or any name)

### Step 3: Deploy as Web App
1. Click **"Deploy"** → **"New deployment"**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **"Web app"**
4. Configure:
   - **Description**: "Newsletter signup webhook"
   - **Execute as**: "Me" (your email)
   - **Who has access**: **"Anyone"** (IMPORTANT!)
5. Click **"Deploy"**
6. **Authorize access** when prompted:
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" → "Go to Newsletter Webhook (unsafe)"
   - Click "Allow"
7. **Copy the Web App URL** - it looks like:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

### Step 4: Update Your Code
1. Open `app/api/newsletter/route.ts`
2. Replace the `WEB_APP_URL` with your new URL from Step 3

### Step 5: Test It
1. Submit a test email through your website
2. Check your Google Sheet - the email should appear within seconds

## Troubleshooting

**If emails don't appear:**
- Check the Web App URL is correct
- Verify the script is deployed (not just saved)
- Make sure "Who has access" is set to "Anyone"
- Check browser console for errors
- Check server logs (emails are logged there as backup)

**If you get permission errors:**
- Re-deploy the script
- Make sure you authorized the script when prompted
- Verify the spreadsheet ID is correct
