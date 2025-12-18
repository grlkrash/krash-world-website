# Quick S3 Upload Guide - Step by Step

## Your Bucket Info
- **Bucket Name**: `krash-beatstore-aws`
- **Region**: `us-east-2` (US East - Ohio)
- **Files to Upload**: 118 preview MP3 files from your local `public/beats/` folder

---

## Step 1: Install AWS CLI (if needed)

Check if you have it:
```bash
aws --version
```

If not installed:
```bash
brew install awscli
```

---

## Step 2: Configure AWS Credentials

```bash
aws configure
```

Enter:
- **AWS Access Key ID**: (your key)
- **AWS Secret Access Key**: (your secret)
- **Default region**: `us-east-2`
- **Default output format**: (just press Enter)

---

## Step 3: Set Bucket Permissions (IMPORTANT!)

Go to: https://us-east-2.console.aws.amazon.com/s3/buckets/krash-beatstore-aws?region=us-east-2

### 3a. Allow Public Access
1. Click **"Permissions"** tab
2. Scroll to **"Block public access"**
3. Click **"Edit"**
4. **UNCHECK** all boxes (unblock public access)
5. Click **"Save changes"**
6. Type `confirm` and click **"Confirm"**

### 3b. Add Bucket Policy
1. Still in **"Permissions"** tab
2. Scroll to **"Bucket policy"**
3. Click **"Edit"**
4. Paste this (it's already set for your bucket name):

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

5. Click **"Save changes"**

### 3c. Add CORS (for browser access)
1. Still in **"Permissions"** tab
2. Scroll to **"Cross-origin resource sharing (CORS)"**
3. Click **"Edit"**
4. Paste this:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

5. Click **"Save changes"**

---

## Step 4: Upload Preview Files

The script is already configured with your bucket name and region. Just run:

```bash
cd /Users/sonia/krashworld-website/krash-world-website
node scripts/upload-to-s3.js
```

This will:
- Upload all 118 preview files from `public/beats/` to S3
- Put them in a `previews/` folder in your bucket
- Make them publicly accessible

**Note**: `public/beats/` is a LOCAL folder on your computer, not in S3. The script uploads FROM your computer TO S3.

---

## Step 5: Test Upload

After upload completes, test a file:
```
https://krash-beatstore-aws.s3.us-east-2.amazonaws.com/previews/beat-1-preview.mp3
```

Should download or play the MP3 in your browser.

---

## Step 6: Update beat-data.json URLs

Run this command:
```bash
node scripts/update-s3-urls.js krash-beatstore-aws us-east-2 previews
```

This updates all preview URLs in `beat-data.json` to point to S3.

---

## Step 7: Commit and Push

```bash
git add beat-data.json
git commit -m "Update preview URLs to use S3"
git push
```

---

## Troubleshooting

### "Access Denied" when uploading
- Check AWS credentials: `aws s3 ls`
- Verify bucket name is correct
- Make sure you have S3 write permissions

### Files not accessible publicly
- Verify bucket policy is saved
- Check "Block public access" is OFF
- Wait a few minutes for changes to propagate

### Upload fails
- Check internet connection
- Verify AWS CLI is configured: `aws configure list`
- Try uploading one file manually:
  ```bash
  aws s3 cp public/beats/beat-1-preview.mp3 s3://krash-beatstore-aws/previews/beat-1-preview.mp3 --acl public-read --region us-east-2
  ```
