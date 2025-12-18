# S3 Download Configuration Verification

## ✅ Current Setup - CORRECT

### Download Flow

1. **Email Link**: `https://www.krash.world/download/[transactionId]`
2. **Download Page**: `/download/[token]` (Next.js page)
3. **Verification**: `/api/beatstore/verify?token=[transactionId]`
4. **Download API**: `/api/beatstore/download?token=[transactionId]&beatId=[beatId]`
5. **S3 Fetch**: API route fetches ZIP file from S3 bucket
6. **File Serve**: Returns ZIP file to user

### S3 Configuration

**Environment Variables Required (in Vercel):**
- ✅ `AWS_REGION` - Default: `us-east-2`
- ✅ `AWS_ACCESS_KEY_ID` - Your AWS access key
- ✅ `AWS_SECRET_ACCESS_KEY` - Your AWS secret key
- ✅ `S3_BUCKET_NAME` - Default: `krash-beatstore-aws`

**S3 File Locations:**
The download route tries these paths in order:
1. `downloads/${beatId}.zip` (e.g., `downloads/beat-1.zip`)
2. `${beatId}.zip` (e.g., `beat-1.zip`)

### Domain Configuration

**❌ NO NEED to configure krash.world domain in S3**

The download flow works like this:
- User clicks: `https://www.krash.world/download/[token]`
- Next.js serves the download page (hosted on Vercel)
- Page calls `/api/beatstore/download` (Next.js API route)
- API route uses AWS SDK to fetch from S3
- File is served through Next.js, not directly from S3

**Why this works:**
- S3 bucket doesn't need to be publicly accessible for downloads
- Files are fetched server-side using AWS credentials
- More secure (no direct S3 URLs exposed)
- Better control over access and verification

## Verification Checklist

### ✅ Code Configuration
- [x] Download route uses AWS SDK correctly
- [x] Environment variables are referenced correctly
- [x] S3 client is configured with credentials
- [x] File paths are checked in correct order
- [x] Error handling is in place

### ⚠️ Required Actions

1. **Upload ZIP Files to S3:**
   ```bash
   # Upload all ZIP files to S3 downloads/ folder
   aws s3 cp public/downloads/ s3://krash-beatstore-aws/downloads/ --recursive --region us-east-2
   ```

2. **Verify Files Exist:**
   - Check S3 bucket: `krash-beatstore-aws`
   - Verify files in `downloads/` folder
   - Files should be named: `beat-1.zip`, `beat-2.zip`, etc.

3. **Test Download Flow:**
   - Make a test purchase
   - Click download link in email
   - Verify file downloads correctly

## S3 Bucket Policy

**For Downloads:** No public access needed! Files are fetched server-side.

**For Previews:** If you want preview files publicly accessible, you need:
- Bucket policy allowing `s3:GetObject` for preview files
- OR files uploaded with `--acl public-read`

**Current Setup:** Downloads work without public access because they're fetched server-side using AWS credentials.

## Troubleshooting

### Issue: "File not found" error

**Check:**
1. File exists in S3: `downloads/${beatId}.zip` or `${beatId}.zip`
2. AWS credentials are correct in Vercel
3. S3 bucket name matches: `krash-beatstore-aws`
4. Region matches: `us-east-2`

### Issue: "Invalid or expired download link"

**Check:**
1. Transaction was stored correctly
2. Transaction hasn't expired (48 hour limit)
3. Token matches transaction ID

### Issue: Download works but file is corrupted

**Check:**
1. ZIP file was created correctly
2. File uploaded to S3 completely
3. No network issues during upload

## Summary

✅ **S3 Configuration is CORRECT**
- No domain configuration needed in S3
- Files are fetched server-side (secure)
- Environment variables are properly referenced
- Download flow is correctly implemented

**Next Steps:**
1. Upload ZIP files to S3 `downloads/` folder
2. Fix EmailJS template to use HTML links (see `FIX_EMAILJS_TEMPLATE_LINK.md`)
3. Test complete download flow
