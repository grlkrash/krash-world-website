# Complete AWS CLI Setup - Step by Step

## ✅ Step 1: Install AWS CLI (I'll do this for you)
Already done! ✅

## Step 2: Get Your AWS Access Keys

### In AWS Console:

1. Go to: https://console.aws.amazon.com/
2. Search for **"IAM"** in the top search bar
3. Click **"IAM"** service
4. Click **"Users"** in left sidebar
5. Click **"Create user"** button

### Create User:

**Step 1 - User details:**
- Username: `s3-uploader` (or any name you like)
- Click **"Next"**

**Step 2 - Set permissions:**
- Select **"Attach policies directly"**
- Search for: `S3`
- Check: **"AmazonS3FullAccess"**
- Click **"Next"**

**Step 3 - Review and create:**
- Review settings
- Click **"Create user"**

### Get Access Keys:

1. Click on the user you just created (`s3-uploader`)
2. Click **"Security credentials"** tab
3. Scroll to **"Access keys"** section
4. Click **"Create access key"**
5. Select **"Command Line Interface (CLI)"**
6. Check the confirmation box
7. Click **"Next"**
8. Click **"Create access key"**

### ⚠️ IMPORTANT - Save Your Keys:

You'll see:
- **Access Key ID**: (starts with `AKIA...`) - Copy this!
- **Secret Access Key**: (long string) - Copy this NOW! You can only see it once!

**Save both keys somewhere safe!**

---

## Step 3: Configure AWS CLI

Once you have your keys, tell me and I'll run:
```bash
aws configure
```

Or you can run it yourself:
```bash
aws configure
```

Enter:
1. **AWS Access Key ID**: (paste your Access Key ID)
2. **AWS Secret Access Key**: (paste your Secret Access Key)
3. **Default region name**: `us-east-2`
4. **Default output format**: (just press Enter)

---

## Step 4: Test It Works

I'll test it for you, or you can run:
```bash
aws s3 ls s3://krash-beatstore-aws
```

Should show your uploaded files!

---

## What I'll Do Next:

1. ✅ Install AWS CLI - DONE
2. ⏳ Wait for you to get AWS keys
3. ⏳ Configure AWS CLI (need your keys)
4. ✅ Update URLs in beat-data.json - READY
5. ✅ Test and commit - READY

**Just get your AWS keys and let me know when you have them!**
