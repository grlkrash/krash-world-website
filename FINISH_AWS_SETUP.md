# Finish AWS CLI Setup - Step by Step

## You Already Uploaded Files! ✅

Great! Now let's finish the setup so you can use the script in the future.

---

## Step 1: Get Your AWS Access Keys

### Option A: Create IAM User (Recommended)

1. Go to: https://console.aws.amazon.com/iam/
2. Click **"Users"** in left sidebar
3. Click **"Create user"** button
4. **Step 1 - User details:**
   - Username: `s3-uploader` (or any name you like)
   - Click **"Next"**
5. **Step 2 - Set permissions:**
   - Select **"Attach policies directly"**
   - Search for: `S3`
   - Check: **"AmazonS3FullAccess"**
   - Click **"Next"**
6. **Step 3 - Review and create:**
   - Review settings
   - Click **"Create user"**
7. **Create Access Keys:**
   - Click on the user you just created (the username)
   - Click **"Security credentials"** tab
   - Scroll to **"Access keys"** section
   - Click **"Create access key"** button
   - Select: **"Command Line Interface (CLI)"**
   - Check the warning box
   - Click **"Next"**
   - Click **"Create access key"**
8. **SAVE YOUR KEYS:**
   - **Access Key ID**: Copy this (starts with `AKIA...`)
   - **Secret Access Key**: Copy this (long string)
   - ⚠️ **IMPORTANT**: You can only see the secret key once! Save it now!

### Option B: Use Root Account (Faster, but less secure)

1. Click your username in top right corner
2. Click **"Security credentials"**
3. Scroll to **"Access keys"**
4. Click **"Create access key"**
5. Select **"Command Line Interface (CLI)"**
6. Check the warning box
7. Click **"Next"**
8. Click **"Create access key"**
9. **SAVE YOUR KEYS** (same as above)

---

## Step 2: Configure AWS CLI

Open Terminal and run:

```bash
aws configure
```

Enter when prompted:
1. **AWS Access Key ID**: Paste your Access Key ID
2. **AWS Secret Access Key**: Paste your Secret Access Key
3. **Default region name**: `us-east-2`
4. **Default output format**: (just press Enter)

---

## Step 3: Test It Works

Run this command:

```bash
aws s3 ls s3://krash-beatstore-aws
```

You should see a list of your uploaded files. If you see files, it worked! ✅

---

## Step 4: Test Upload Script

Try uploading one file as a test:

```bash
cd /Users/sonia/krashworld-website/krash-world-website
node scripts/upload-to-s3.js
```

It should show it's uploading files. You can cancel with `Ctrl+C` if you want (since files are already uploaded).

---

## Done! 🎉

Now you can use the script anytime in the future to upload new preview files!

---

## Troubleshooting

### "Access Denied"
- Check your IAM user has `AmazonS3FullAccess` policy
- Verify the access keys are correct

### "aws: command not found"
- Install AWS CLI: `brew install awscli`

### "Invalid credentials"
- Double-check you copied the keys correctly
- Make sure there are no extra spaces
