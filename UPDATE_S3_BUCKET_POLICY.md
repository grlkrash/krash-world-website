# Update S3 Bucket Policy

## Current Issue

Your bucket policy allows access to:
```
arn:aws:s3:::krash-beatstore-aws/*
```

But your files are stored in the `beats/` prefix:
```
s3://krash-beatstore-aws/beats/beat-1-preview.mp3
```

## Solution: Update Bucket Policy

### Step 1: Go to S3 Console
1. Open: https://us-east-2.console.aws.amazon.com/s3/buckets/krash-beatstore-aws?region=us-east-2&tab=permissions
2. Click the **"Permissions"** tab
3. Scroll to **"Bucket policy"** section
4. Click **"Edit"**

### Step 2: Update the Resource Path

Replace the current policy with this:

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

**Key Change**: Changed `/*` to `/beats/*` in the Resource path

### Step 3: Save Changes
1. Click **"Save changes"**
2. The policy should update immediately

### Step 4: Test

```bash
curl -I "https://krash-beatstore-aws.s3.us-east-2.amazonaws.com/beats/beat-1-preview.mp3"
```

Should return: `HTTP/1.1 200 OK` (not 403)

Or test in browser:
- https://krash-beatstore-aws.s3.us-east-2.amazonaws.com/beats/beat-1-preview.mp3

## Alternative: Allow Both Root and Beats

If you want to allow access to both root-level files AND files in the `beats/` folder, use this policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": [
                "arn:aws:s3:::krash-beatstore-aws/*",
                "arn:aws:s3:::krash-beatstore-aws/beats/*"
            ]
        }
    ]
}
```

But since all your preview files are in `beats/`, the first policy (with just `/beats/*`) is sufficient and more secure.

## CORS Configuration

Your CORS configuration looks correct and doesn't need changes:
- ✅ Allows GET and HEAD methods
- ✅ Allows all origins
- ✅ Allows all headers

This should work fine for audio playback.
