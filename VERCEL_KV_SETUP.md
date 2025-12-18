# Upstash Redis Setup for Transaction Storage (FREE)

## Problem

The transaction store was using **in-memory storage** which doesn't work on Vercel's serverless functions. Each function invocation can run on a different server instance, so transactions stored in one instance aren't available in another.

**Result:** Download links show "Invalid or expired download link" even though the transaction was just created.

## Solution: Upstash Redis (FREE)

**✅ IT'S FREE - No Credit Card Required!**

Upstash Redis provides persistent storage across serverless function invocations. The `@vercel/kv` package works with Upstash Redis.

**Free Tier:**
- 10,000 commands per day (plenty for downloads)
- 256 MB storage (more than enough)
- No credit card required
- Free forever

See `UPSTASH_REDIS_SETUP.md` for detailed step-by-step instructions.

## Setup Instructions

### Step 1: Create Vercel KV Database

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project: `krash-world-website`
3. Go to **Storage** tab
4. Click **Create Database**
5. Select **KV** (Redis)
6. Choose a name (e.g., `krash-transactions`)
7. Select a region (preferably same as your app)
8. Click **Create**

### Step 2: Link KV to Your Project

1. After creating the KV database, click **Connect**
2. The environment variables will be automatically added to your project:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN` (optional)

### Step 3: Redeploy

After linking KV, Vercel will automatically redeploy your project. The code will now use Vercel KV for transaction storage.

## How It Works

**Before (In-Memory - Broken):**
```
Purchase → Store in Instance A memory → User clicks link → Instance B doesn't have it → Error
```

**After (Vercel KV - Working):**
```
Purchase → Store in Vercel KV → User clicks link → Any instance can read from KV → Success
```

## Verification

After setup, check Vercel logs for:
- ✅ `Transaction stored in Vercel KV`
- ✅ `Transaction found in KV`

If you see:
- ⚠️ `Transaction stored in memory (KV not available)` - KV is not configured yet

## Fallback Behavior

The code includes a fallback to in-memory storage if Vercel KV is not configured. However, this will only work if:
- The purchase and download happen on the same serverless function instance
- This is unreliable and not recommended for production

## Cost

Vercel KV has a free tier:
- **Free**: 256 MB storage, 10,000 requests/day
- **Pro**: $0.20/GB storage, $0.20 per 1M requests

For transaction storage (small data, low volume), the free tier should be sufficient.

## Testing

1. Make a test purchase
2. Check Vercel logs - should see "Transaction stored in Vercel KV"
3. Click download link
4. Should work without "Invalid or expired" error
