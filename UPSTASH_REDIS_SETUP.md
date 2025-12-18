# Upstash Redis Setup (FREE) - Step by Step

## ✅ It's FREE - No Credit Card Required

Upstash Redis has a **free tier** that's perfect for transaction storage:
- **10,000 commands per day** (plenty for downloads)
- **256 MB storage** (more than enough for transactions)
- **No credit card required**
- **No expiration** (free tier doesn't expire)

## Step-by-Step Setup

### Step 1: Create Upstash Account

1. Go to: https://upstash.com/
2. Click **"Sign Up"** (use GitHub/Google for quick signup)
3. **No credit card needed** - the free tier is automatically available

### Step 2: Create Redis Database

1. After signing up, you'll see the dashboard
2. Click **"Create Database"** or **"New Database"**
3. Fill in:
   - **Name**: `krash-transactions` (or any name you like)
   - **Type**: **Redis** (should be selected by default)
   - **Region**: Choose closest to your Vercel deployment (e.g., `us-east-1`)
   - **Plan**: Select **"Free"** (it's free forever, no credit card)
4. Click **"Create"**

### Step 3: Get Your Credentials

After creating the database, you'll see:
- **UPSTASH_REDIS_REST_URL** (this is your `KV_REST_API_URL`)
- **UPSTASH_REDIS_REST_TOKEN** (this is your `KV_REST_API_TOKEN`)

**Copy both of these** - you'll need them in the next step.

### Step 4: Add to Vercel Environment Variables

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project: `krash-world-website`
3. Go to **Settings** → **Environment Variables**
4. Add these **3 variables**:

   **Variable 1:**
   - **Name**: `KV_REST_API_URL`
   - **Value**: Paste the `UPSTASH_REDIS_REST_URL` from Step 3
   - **Environment**: Select **Production**, **Preview**, and **Development**
   - Click **"Save"**

   **Variable 2:**
   - **Name**: `KV_REST_API_TOKEN`
   - **Value**: Paste the `UPSTASH_REDIS_REST_TOKEN` from Step 3
   - **Environment**: Select **Production**, **Preview**, and **Development**
   - Click **"Save"**

   **Variable 3 (Optional but recommended):**
   - **Name**: `KV_REST_API_READ_ONLY_TOKEN`
   - **Value**: If Upstash shows a read-only token, paste it here (otherwise skip)
   - **Environment**: Select **Production**, **Preview**, and **Development**
   - Click **"Save"**

### Step 5: Redeploy

1. Go to **Deployments** tab in Vercel
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

### Step 6: Test

1. Make a test purchase
2. Check Vercel logs (Functions tab) - you should see:
   - `✅ Transaction stored in Vercel KV`
3. Click the download link in the email
4. Should work! ✅

## Alternative: Use Vercel Marketplace Integration

If you prefer, you can also:
1. Go to Vercel Dashboard → Your Project → **Integrations** tab
2. Search for **"Upstash"**
3. Click **"Add Integration"**
4. Follow the prompts to connect Upstash
5. Vercel will automatically add the environment variables

## Cost Confirmation

**✅ FREE FOREVER:**
- 10,000 commands/day (each transaction = ~2-3 commands)
- 256 MB storage (each transaction = ~200 bytes)
- You can store **millions** of transactions on the free tier
- No credit card required
- No expiration

**If you exceed free tier** (very unlikely):
- $0.20 per 100K commands
- But you'd need 3,333+ downloads per day to exceed free tier

## Troubleshooting

**If you see "KV not available" in logs:**
- Check environment variables are set correctly
- Make sure you redeployed after adding variables
- Verify variable names are exactly: `KV_REST_API_URL` and `KV_REST_API_TOKEN`

**If you see connection errors:**
- Check the URL and token are correct (no extra spaces)
- Verify the database is active in Upstash dashboard
- Check the region matches your Vercel deployment region
