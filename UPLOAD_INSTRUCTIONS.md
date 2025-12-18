# Simple Upload Instructions

## Your Files Location

The preview files are located at:
```
/Users/sonia/krashworld-website/krash-world-website/public/beats/
```

This is INSIDE your project folder, not a separate folder on your computer.

## Two Ways to Upload

### Method 1: Using Script (Fastest - Recommended)

**Step 1**: Get AWS Keys (see FIND_AWS_KEYS.md)

**Step 2**: Configure AWS CLI
```bash
aws configure
```
Enter your keys when prompted.

**Step 3**: Run the upload script
```bash
cd /Users/sonia/krashworld-website/krash-world-website
node scripts/upload-to-s3.js
```

**Step 4**: Update URLs
```bash
node scripts/update-s3-urls.js krash-beatstore-aws us-east-2 previews
```

**Step 5**: Commit
```bash
git add beat-data.json
git commit -m "Update preview URLs to S3"
git push
```

---

### Method 2: Using AWS Web Console (No Keys Needed)

**Step 1**: Go to your bucket
https://us-east-2.console.aws.amazon.com/s3/buckets/krash-beatstore-aws?region=us-east-2

**Step 2**: Click "Upload" button

**Step 3**: Click "Add files"

**Step 4**: In the file picker, navigate to:
```
/Users/sonia/krashworld-website/krash-world-website/public/beats
```

**Step 5**: Select all MP3 files (you can select multiple)

**Step 6**: Under "Permissions", set:
- Access control list (ACL): **Grant public-read access**

**Step 7**: Click "Upload"

**Step 8**: Wait for upload to complete

**Step 9**: After upload, run:
```bash
cd /Users/sonia/krashworld-website/krash-world-website
node scripts/update-s3-urls.js krash-beatstore-aws us-east-2
```

**Step 10**: Commit
```bash
git add beat-data.json
git commit -m "Update preview URLs to S3"
git push
```

---

## Which Method?

- **Method 1 (Script)**: Faster, automated, but needs AWS keys
- **Method 2 (Web)**: Easier, no keys needed, but slower (manual)

I recommend Method 2 if you don't want to deal with keys!
