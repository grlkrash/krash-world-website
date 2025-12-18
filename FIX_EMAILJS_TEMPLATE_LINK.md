# Fix EmailJS Template - Non-Clickable Download Link

## Problem

The download link in emails appears as plain text markdown instead of a clickable HTML link:
```
[DOWNLOAD BEAT](www.krash.world/download/2EF745417Y780600B)
```

## Root Cause

The EmailJS template is using **markdown syntax** instead of **HTML**. EmailJS templates need to use HTML for links to be clickable.

## Solution: Update EmailJS Template

### Step 1: Go to EmailJS Dashboard

1. Go to: https://dashboard.emailjs.com/
2. Click **"Email Templates"**
3. Find your purchase confirmation template
4. Click **"Edit"**

### Step 2: Replace Markdown with HTML

**❌ WRONG (Current - Markdown):**
```
[DOWNLOAD BEAT]({{download_link}})
```

**✅ CORRECT (HTML):**
```html
<a href="{{download_link}}" style="display: inline-block; padding: 12px 24px; background-color: #ffda0f; color: #000000; text-decoration: none; border-radius: 4px; font-weight: bold;">DOWNLOAD BEAT</a>
```

Or for a simpler text link:
```html
<a href="{{download_link}}">DOWNLOAD BEAT</a>
```

### Step 3: Ensure URL Has Protocol

The `{{download_link}}` variable is automatically sent with `https://` protocol from the code. However, if you're manually editing the template, make sure the link uses the full URL:

**✅ CORRECT:**
```html
<a href="{{download_link}}">Download</a>
```

**❌ WRONG:**
```html
<a href="www.krash.world/download/{{transaction_id}}">Download</a>
```

### Step 4: Test Template

1. Click **"Test"** in EmailJS dashboard
2. Send a test email to yourself
3. Verify the link is clickable in the email

## Template Variables Reference

Your template should use these variables (exact names):
- `{{to_email}}` - Recipient email address
- `{{beat_title}}` - Name of the beat purchased
- `{{download_link}}` - Full URL: `https://www.krash.world/download/[transactionId]`
- `{{transaction_id}}` - Transaction ID for reference

## Example Complete Template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #ffda0f;">THANK YOU FOR YOUR PURCHASE!</h1>
    <p>Your beat <strong>{{beat_title}}</strong> is ready for download.</p>
    <p>
      <a href="{{download_link}}" style="display: inline-block; padding: 12px 24px; background-color: #ffda0f; color: #000000; text-decoration: none; border-radius: 4px; font-weight: bold;">DOWNLOAD BEAT</a>
    </p>
    <p style="font-size: 12px; color: #666;">Transaction ID: {{transaction_id}}</p>
    <p style="font-size: 12px; color: #666;">KRASH WORLD © 2026</p>
  </div>
</body>
</html>
```

## Verification

After updating the template:
1. Make a test purchase
2. Check the email
3. The link should be:
   - ✅ Clickable (blue/underlined or styled button)
   - ✅ Uses full URL: `https://www.krash.world/download/[transactionId]`
   - ✅ Opens the download page when clicked

## Notes

- The code automatically sends the full URL with `https://` protocol
- No need to configure krash.world domain in S3 - the download flow goes through Next.js
- The download page (`/download/[token]`) verifies the transaction and serves the file from S3
