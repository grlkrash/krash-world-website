# Verify After S3 Upload Completes

## Once Upload Finishes (in a couple minutes):

### Step 1: Test Preview Files

Test a preview URL in your browser:
```
https://krash-beatstore-aws.s3.us-east-2.amazonaws.com/beat-1-preview.mp3
```

Should:
- ✅ Download or play the MP3
- ❌ NOT show "403 Forbidden"

### Step 2: Test Download Links

The download links in emails work like this:
1. User purchases → Gets email with link: `https://www.krash.world/download/[transactionId]`
2. Link goes to `/download/[token]` page
3. Page verifies token and downloads from `/api/beatstore/download?token=...&beatId=...`
4. API serves ZIP file from `public/downloads/[beatId].zip`

**Current Status:**
- ✅ 64 ZIP files exist in `public/downloads/`
- ✅ Download API route is configured
- ✅ Transaction store is set up
- ⏳ Waiting for S3 preview files to finish uploading

### Step 3: Verify Everything Works

After S3 upload completes, test:

1. **Preview on beatstore page:**
   - Go to `/beatstore`
   - Click play button on any beat
   - Should play audio from S3

2. **Download link (test purchase):**
   - Make a test purchase
   - Check email for download link
   - Click link → Should download ZIP file

### Step 4: If Preview Files Still Show 403

If you still get 403 Forbidden after upload:

1. **Check bucket permissions:**
   - Go to S3 bucket → Permissions tab
   - Verify "Block public access" is OFF
   - Verify bucket policy allows `s3:GetObject`

2. **Check file permissions:**
   - Select a file in S3
   - Click "Actions" → "Make public using ACL"
   - Or set ACL to "public-read" during upload

3. **Re-upload with public access:**
   - When uploading, under "Permissions"
   - Set ACL to "Grant public-read access"

---

## Quick Test Commands

Once upload finishes, run these:

```bash
# Test preview file access
curl -I "https://krash-beatstore-aws.s3.us-east-2.amazonaws.com/beat-1-preview.mp3"

# Should return: HTTP/1.1 200 OK (not 403)
```

---

## Summary

- ✅ **Download links**: Will work (ZIP files are ready)
- ⏳ **Preview links**: Waiting for S3 upload to complete
- ✅ **Email system**: Configured and ready
- ✅ **Transaction system**: Working

Once S3 upload finishes, everything should work! 🎉
