# Fix S3 403 Forbidden Error

## Problem
Audio preview files return `403 Forbidden` because:
1. ✅ **FIXED**: URLs now include the `beats/` prefix (updated in beat-data.json)
2. ⚠️ **TODO**: Bucket needs a public read policy (bucket doesn't allow ACLs)

## Solution: Add Bucket Policy

Since the bucket doesn't allow ACLs, you need to add a bucket policy for public read access.

### Step 1: Go to S3 Console
1. Open: https://us-east-2.console.aws.amazon.com/s3/buckets/krash-beatstore-aws?region=us-east-2&tab=permissions
2. Click the **"Permissions"** tab

### Step 2: Add Bucket Policy
1. Scroll to **"Bucket policy"** section
2. Click **"Edit"**
3. Paste this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::krash-beatstore-aws/beats/*"
    }
  ]
}
```

4. Click **"Save changes"**

### Step 3: Verify Block Public Access Settings
1. In the same **"Permissions"** tab
2. Scroll to **"Block public access (bucket settings)"**
3. Click **"Edit"**
4. **Uncheck all 4 boxes** (or at least uncheck "Block public access to buckets and objects granted through new public bucket or access point policies")
5. Click **"Save changes"**
6. Type `confirm` when prompted

### Step 4: Test
```bash
curl -I "https://krash-beatstore-aws.s3.us-east-2.amazonaws.com/beats/beat-1-preview.mp3"
```

Should return: `HTTP/1.1 200 OK` (not 403)

Or test in browser:
- https://krash-beatstore-aws.s3.us-east-2.amazonaws.com/beats/beat-1-preview.mp3

## What Was Fixed

1. ✅ **URLs Updated**: All preview URLs in `beat-data.json` now include `/beats/` prefix
2. ✅ **Duplicate Prevention**: Newsletter subscriptions now use localStorage to prevent duplicates
3. ⚠️ **Bucket Policy**: You need to add the bucket policy above (can't be done via CLI easily)

## After Fixing

Once the bucket policy is added, the audio previews should work correctly. The URLs are already fixed in the codebase.
