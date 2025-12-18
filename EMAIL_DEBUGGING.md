# Email Sending Debugging Guide

## Problem: Logs Say Email Sent, But No Email Received

### Step 1: Check Which Email Service is Configured

The system tries these in order:
1. **EmailJS** (if `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY` are set)
2. **SendGrid** (if `SENDGRID_API_KEY` is set)
3. **Google Sheets Webhook** (if `GOOGLE_SHEETS_BEATSTORE_WEBHOOK` is set)
4. **Manual** (logs purchase, no email sent)

### Step 2: Check Vercel Environment Variables

Go to: https://vercel.com/your-project/settings/environment-variables

Check if these are set:
- `EMAILJS_SERVICE_ID`
- `EMAILJS_TEMPLATE_ID`
- `EMAILJS_PUBLIC_KEY`
- `SENDGRID_API_KEY` (optional)
- `SENDGRID_FROM_EMAIL` (optional)
- `GOOGLE_SHEETS_BEATSTORE_WEBHOOK` (optional)

### Step 3: Test Email Sending

Run the test script:
```bash
cd /Users/sonia/krashworld-website/krash-world-website
node scripts/test-email-send.js your-email@example.com
```

This will:
- Show which services are configured
- Attempt to send a test email
- Show detailed error messages

### Step 4: Check Vercel Function Logs

1. Go to Vercel Dashboard
2. Click on your project
3. Go to "Functions" or "Logs" tab
4. Look for the `/api/beatstore/send-download` function
5. Check for:
   - `📧 Attempting EmailJS send...`
   - `📧 EmailJS response: [status]`
   - `✅ EmailJS email sent successfully` or `❌ EmailJS failed: [error]`

### Step 5: Common Issues

#### Issue: EmailJS Returns 200 But No Email

**Possible Causes:**
1. **Wrong template variables** - Check EmailJS template uses:
   - `{{to_email}}` (not `{{email}}`)
   - `{{beat_title}}`
   - `{{download_link}}`
   - `{{transaction_id}}`

2. **EmailJS rate limits** - Free tier has limits
   - Check EmailJS dashboard for quota

3. **Email in spam folder** - Check spam/junk folder

4. **Wrong email service** - Verify service is connected in EmailJS

**Fix:**
- Go to EmailJS dashboard
- Check template variables match exactly
- Verify service is active
- Check email logs in EmailJS dashboard

#### Issue: SendGrid Returns 200 But No Email

**Possible Causes:**
1. **Sender not verified** - SendGrid requires verified sender
2. **Email in spam** - Check spam folder
3. **Domain not verified** - If using custom domain

**Fix:**
- Verify sender email in SendGrid
- Check SendGrid activity logs
- Verify domain if using custom domain

#### Issue: All Services Return Success But No Email

**Possible Causes:**
1. **Email service not actually configured** - Check env vars
2. **Silent failures** - Service accepts request but doesn't send
3. **Wrong email address** - Typo in email

**Fix:**
- Run test script to see actual responses
- Check spam folder
- Verify email address is correct
- Check service-specific logs (EmailJS dashboard, SendGrid activity)

### Step 6: Verify EmailJS Template

1. Go to: https://dashboard.emailjs.com/
2. Click "Email Templates"
3. Find your template
4. Check variables:
   - `{{to_email}}` ✅
   - `{{beat_title}}` ✅
   - `{{download_link}}` ✅
   - `{{transaction_id}}` ✅

5. Test the template in EmailJS dashboard

### Step 7: Check Spam Folder

**Always check spam/junk folder!** Many transactional emails go to spam initially.

### Step 8: Manual Verification

If automated emails don't work, you can manually send:

1. Check Vercel logs for the download link
2. Copy the `secureDownloadUrl` from logs
3. Manually email the customer with the link

The system logs every purchase with the download link as a backup.

---

## Quick Test

Run this to test email sending right now:

```bash
cd /Users/sonia/krashworld-website/krash-world-website
node scripts/test-email-send.js grlkrashwrld@gmail.com
```

This will show you exactly what's configured and what errors occur.

---

## Next Steps

1. ✅ Run test script
2. ✅ Check Vercel environment variables
3. ✅ Verify EmailJS template variables
4. ✅ Check spam folder
5. ✅ Review Vercel function logs
6. ✅ Fix any configuration issues
