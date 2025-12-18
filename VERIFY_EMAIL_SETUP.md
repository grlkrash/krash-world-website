# Verify Email Setup - Step by Step

## Current Status Check

### Step 1: Check Vercel Environment Variables

Go to: https://vercel.com/your-project/settings/environment-variables

**Required for EmailJS:**
- ✅ `EMAILJS_SERVICE_ID` - Your EmailJS service ID
- ✅ `EMAILJS_TEMPLATE_ID` - Your EmailJS template ID  
- ✅ `EMAILJS_PUBLIC_KEY` - Your EmailJS public key

**Optional:**
- `SENDGRID_API_KEY` - If using SendGrid instead
- `GOOGLE_SHEETS_BEATSTORE_WEBHOOK` - For logging purchases

### Step 2: Test Email Sending Locally

Run the test script (it will use your local env vars or you can set them):

```bash
cd /Users/sonia/krashworld-website/krash-world-website

# Option 1: Test with environment variables from Vercel
# (You'll need to set them locally first)

# Option 2: Test directly on production
# Make a test purchase and check Vercel logs
```

### Step 3: Check Vercel Function Logs

After a purchase, check Vercel logs for:

**Good signs:**
- `📧 Attempting EmailJS send...`
- `📧 EmailJS response: 200 OK`
- `✅ EmailJS email sent successfully`

**Bad signs:**
- `⚠️ EmailJS not configured (missing env vars)`
- `❌ EmailJS failed: [error message]`
- `📧 EmailJS response: 400` or `500`

### Step 4: Verify EmailJS Template

1. Go to: https://dashboard.emailjs.com/
2. Click "Email Templates"
3. Find your template
4. **CRITICAL**: Check these variables match EXACTLY:
   - `{{to_email}}` ✅ (NOT `{{email}}`)
   - `{{beat_title}}` ✅
   - `{{download_link}}` ✅
   - `{{transaction_id}}` ✅

5. Test the template in EmailJS dashboard

### Step 5: Check EmailJS Service

1. Go to EmailJS dashboard
2. Click "Email Services"
3. Verify your service is:
   - ✅ Active
   - ✅ Connected to an email provider (Gmail, Outlook, etc.)
   - ✅ Has quota remaining

### Step 6: Common Issues & Fixes

#### Issue: "EmailJS not configured"
**Fix:** Add missing env vars to Vercel

#### Issue: "EmailJS response: 400"
**Possible causes:**
- Wrong template variables
- Template not found
- Service not connected

**Fix:**
- Verify template variables match exactly
- Check template ID is correct
- Verify service is active

#### Issue: "EmailJS response: 200" but no email
**Possible causes:**
- Email in spam folder
- Wrong email address
- EmailJS service not sending
- Rate limit reached

**Fix:**
- Check spam folder
- Verify email address
- Check EmailJS dashboard for delivery status
- Check EmailJS quota/limits

#### Issue: All services fail, falls back to "manual"
**Fix:**
- Configure at least one email service
- Check all env vars are set in Vercel
- Verify service credentials are correct

### Step 7: Test on Production

1. Make a test purchase with PayPal sandbox
2. Check Vercel function logs immediately
3. Look for the detailed email logs we added
4. Check your email inbox (and spam)
5. If email received → ✅ Working!
6. If not → Check logs for specific error

---

## Quick Diagnostic

Run this to see what's configured:

```bash
# The test script will show you what's set up
node scripts/test-email-send.js your-email@example.com
```

---

## What the Logs Tell Us

When you check Vercel logs after a purchase, you should see:

```
🎵 Beat Purchase: { email, beatId, ... }
📧 Attempting EmailJS send...
📧 EmailJS response: 200 OK
📧 EmailJS body: [response]
✅ EmailJS email sent successfully
```

OR

```
⚠️ EmailJS not configured (missing env vars)
📧 Attempting SendGrid send...
```

OR

```
⚠️ No email service succeeded. Purchase logged but email not sent.
📧 Manual download link: https://www.krash.world/download/[token]
```

The last one means NO email was sent, but the purchase is logged and you can manually send the link.

---

## Next Steps

1. ✅ Check Vercel environment variables
2. ✅ Verify EmailJS template variables
3. ✅ Test email sending (make test purchase)
4. ✅ Check Vercel logs for detailed output
5. ✅ Fix any configuration issues found
