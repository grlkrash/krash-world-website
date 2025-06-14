// Google Sheets OAuth Setup for Newsletter
console.log("=== GOOGLE SHEETS OAUTH SETUP ===\n")

console.log("Since you have a Gmail account, we need to use OAuth instead of service account.")
console.log("Here's how to set it up:\n")

console.log("1. Go to console.cloud.google.com")
console.log("2. Create a new project or select existing")
console.log("3. Enable Google Sheets API")
console.log("4. Go to 'Credentials' > 'Create Credentials' > 'OAuth 2.0 Client IDs'")
console.log("5. Configure OAuth consent screen")
console.log("6. Add your domain to authorized domains")
console.log("7. Download the OAuth client configuration\n")

console.log("Alternative: Use Google Apps Script")
console.log("1. Go to script.google.com")
console.log("2. Create a new project")
console.log("3. Add this code:")

console.log(`
function doPost(e) {
  const sheet = SpreadsheetApp.openById('1Dw83Z6ulSvD-qc9p8RWt5wWML00ABTNd8aiI_Oo91Vc');
  const data = JSON.parse(e.postData.contents);
  
  sheet.getActiveSheet().appendRow([
    new Date(),
    data.email,
    data.name || 'Anonymous',
    data.source || 'Website'
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}
`)

console.log("\n4. Deploy as web app")
console.log("5. Set permissions to 'Anyone'")
console.log("6. Copy the web app URL")
console.log("7. Use this URL in your newsletter API route\n")

console.log("Your Spreadsheet ID: 1Dw83Z6ulSvD-qc9p8RWt5wWML00ABTNd8aiI_Oo91Vc")
console.log("This is the easiest method for Gmail accounts!")
