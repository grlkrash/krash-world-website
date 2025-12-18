# AWS S3 Setup for Beat Previews

## Step-by-Step Guide

### 1. Prerequisites

Install AWS CLI if you haven't already:
```bash
brew install awscli
```

Configure AWS credentials:
```bash
aws configure
```
You'll need:
- AWS Access Key ID
- AWS Secret Access Key
- Default region (e.g., `us-east-1`)
- Default output format (just press Enter for `json`)

### 2. S3 Bucket Setup

#### Create Bucket (if not done already):
1. Go to AWS S3 Console: https://s3.console.aws.amazon.com/
2. Click "Create bucket"
3. Bucket name: `krash-world-beats` (or your choice)
4. Region: Choose closest to your users (e.g., `us-east-1`)
5. **IMPORTANT**: Uncheck "Block all public access" (we need public access for previews)
6. Acknowledge the warning about public access
7. Click "Create bucket"

#### Configure Bucket for Public Access:
1. Click on your bucket
2. Go to "Permissions" tab
3. Under "Bucket policy", click "Edit"
4. Add this policy (replace `YOUR_BUCKET_NAME`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

5. Click "Save changes"

#### Configure CORS (if needed):
1. Still in "Permissions" tab
2. Scroll to "Cross-origin resource sharing (CORS)"
3. Click "Edit"
4. Add this configuration:

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

5. Click "Save changes"

### 3. Upload Preview Files

#### Option A: Using the Script (Recommended)

1. Edit `scripts/upload-to-s3.js`:
   - Update `S3_BUCKET_NAME` with your bucket name
   - Update `S3_REGION` with your bucket's region
   - Optionally set `S3_PREFIX` to organize files (e.g., `"previews"`)

2. Run the script:
```bash
node scripts/upload-to-s3.js
```

#### Option B: Using AWS CLI Directly

```bash
# Upload all preview files
aws s3 cp public/beats/ s3://YOUR_BUCKET_NAME/previews/ \
  --recursive \
  --acl public-read \
  --region us-east-1
```

Replace:
- `YOUR_BUCKET_NAME` with your actual bucket name
- `us-east-1` with your bucket's region

### 4. Update beat-data.json

After uploading, you need to update the preview URLs in `beat-data.json`.

The script will output the base URL. Update all `previewUrl` fields from:
```json
"previewUrl": "/beats/beat-1-preview.mp3"
```

To:
```json
"previewUrl": "https://YOUR_BUCKET_NAME.s3.REGION.amazonaws.com/previews/beat-1-preview.mp3"
```

Or if you used a prefix:
```json
"previewUrl": "https://YOUR_BUCKET_NAME.s3.REGION.amazonaws.com/previews/beat-1-preview.mp3"
```

### 5. Test

1. Check a file URL in browser:
   `https://YOUR_BUCKET_NAME.s3.REGION.amazonaws.com/previews/beat-1-preview.mp3`

2. Should download or play the MP3 file

3. Update your site and test the preview player

### 6. Remove Local Files from Git (Optional)

Once S3 is working, you can remove preview files from Git LFS:

```bash
# Remove from Git LFS
git lfs untrack "public/beats/*.mp3"

# Remove files from Git (keep local)
git rm --cached public/beats/*.mp3

# Update .gitignore
echo "public/beats/*.mp3" >> .gitignore

# Commit
git add .gitignore .gitattributes
git commit -m "Remove preview files from Git, using S3 instead"
git push
```

## Troubleshooting

### Files not accessible publicly
- Check bucket policy allows `s3:GetObject` for `*`
- Verify "Block all public access" is OFF
- Check file ACL is `public-read`

### CORS errors in browser
- Verify CORS configuration in bucket
- Check that `AllowedOrigins` includes your domain or `*`

### Upload fails
- Verify AWS credentials: `aws s3 ls`
- Check bucket name is correct
- Verify region matches bucket region
