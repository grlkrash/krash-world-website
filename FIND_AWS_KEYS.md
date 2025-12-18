# How to Find Your AWS Access Keys

## Step 1: Go to AWS Console

1. Go to: https://console.aws.amazon.com/
2. Sign in with your AWS account

## Step 2: Open IAM (Identity and Access Management)

1. In the search bar at the top, type: **IAM**
2. Click on **"IAM"** service

## Step 3: Create Access Keys

### Option A: Create New User (Recommended for S3)

1. In IAM, click **"Users"** in the left sidebar
2. Click **"Create user"**
3. Username: `s3-uploader` (or any name)
4. Check **"Provide user access to the AWS Management Console"** - **NO, don't check this**
5. Instead, check **"Access key - Programmatic access"**
6. Click **"Next"**

### Option B: Use Your Root Account (Faster, but less secure)

1. Click your username in the top right
2. Click **"Security credentials"**
3. Scroll to **"Access keys"**
4. Click **"Create access key"**
5. Select **"Command Line Interface (CLI)"**
6. Check the warning box
7. Click **"Next"**
8. Click **"Create access key"**

## Step 4: Save Your Keys

**IMPORTANT**: You'll see:
- **Access Key ID**: (starts with `AKIA...`)
- **Secret Access Key**: (long string)

**SAVE THESE NOW** - you can only see the secret key once!

Copy both keys somewhere safe (Notes app, password manager, etc.)

## Step 5: Configure AWS CLI

Open Terminal and run:
```bash
aws configure
```

Enter:
1. **AWS Access Key ID**: Paste your Access Key ID
2. **AWS Secret Access Key**: Paste your Secret Access Key
3. **Default region name**: `us-east-2`
4. **Default output format**: (just press Enter)

## Step 6: Test It Works

```bash
aws s3 ls s3://krash-beatstore-aws
```

If you see your bucket (even if empty), it worked!

---

## Alternative: Use AWS Console Upload (No Keys Needed)

If you don't want to use command line, you can upload through the web interface:

1. Go to: https://us-east-2.console.aws.amazon.com/s3/buckets/krash-beatstore-aws?region=us-east-2
2. Click **"Upload"**
3. Click **"Add files"**
4. Navigate to: `/Users/sonia/krashworld-website/krash-world-website/public/beats/`
5. Select all 118 MP3 files
6. Click **"Upload"**

But this is slower - the script is faster!
