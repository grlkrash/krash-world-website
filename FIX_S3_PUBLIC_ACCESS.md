# Fix S3 Public Access for Preview Files

## Problem
Preview files return `403 Forbidden` when accessed. Files need to be publicly accessible.

## Quick Fix (Easiest)

### Option 1: Make Files Public via AWS Console

1. Go to: https://us-east-2.console.aws.amazon.com/s3/buckets/krash-beatstore-aws?region=us-east-2

2. **Select All Files:**
   - Click the checkbox at the top (selects all files)
   - OR select files individually

3. **Make Public:**
   - Click **"Actions"** button (top right)
   - Click **"Make public using ACL"**
   - Click **"Make public"** in the confirmation dialog

4. **Test:**
   - Open: `https://krash-beatstore-aws.s3.us-east-2.amazonaws.com/beat-1-preview.mp3`
   - Should download/play the MP3

### Option 2: Use AWS CLI (If Configured)

```bash
export PATH="/opt/homebrew/bin:$PATH"
aws s3 cp s3://krash-beatstore-aws/ s3://krash-beatstore-aws/ --recursive --acl public-read --region us-east-2
```

This makes all existing files public.

## Verify Bucket Policy

1. Go to bucket → **"Permissions"** tab
2. Check **"Bucket policy"** - should have:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::krash-beatstore-aws/*"
    }
  ]
}
```

3. Check **"Block public access"** - should be OFF (all unchecked)

## Test After Fix

```bash
curl -I "https://krash-beatstore-aws.s3.us-east-2.amazonaws.com/beat-1-preview.mp3"
```

Should return: `HTTP/1.1 200 OK` (not 403)
