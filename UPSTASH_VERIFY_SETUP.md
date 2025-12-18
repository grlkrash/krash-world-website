# Verify Upstash Setup - Quick Checklist

## ✅ You've Already Done:
- [x] Installed Upstash Redis from Vercel Marketplace
- [x] Connected it to your project

## Next Steps:

### Step 1: Verify Environment Variables (2 minutes)

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Check that these exist:
   - ✅ `KV_REST_API_URL` 
   - ✅ `KV_REST_API_TOKEN`
   - ✅ `KV_REST_API_READ_ONLY_TOKEN` (optional)

**If they're NOT there:**
- Go back to Upstash dashboard
- Copy the values from the "Quickstart" section
- Manually add them in Vercel

**If they ARE there:**
- ✅ You're good! Move to Step 2

### Step 2: Redeploy (1 minute)

1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Wait ~2 minutes for deployment

**OR** - Vercel might auto-redeploy when env vars are added. Check if a new deployment started.

### Step 3: Test (2 minutes)

1. Make a test purchase
2. Check Vercel logs:
   - Go to **Functions** tab
   - Look for `/api/beatstore/send-download` logs
   - Should see: `✅ Transaction stored in Vercel KV`
3. Click download link in email
4. Should work! ✅

## What to Look For in Logs:

**✅ Good (Working):**
```
✅ Transaction 1RX33952SU086001T stored in Vercel KV
✅ Transaction 1RX33952SU086001T found in KV
```

**❌ Bad (Not Working):**
```
⚠️ Transaction stored in memory (KV not available)
🔍 Transaction not found in memory
```

If you see the "bad" messages, the env vars aren't set correctly or you need to redeploy.

## That's It!

You don't need to:
- ❌ Install `@upstash/redis` (we use `@vercel/kv` which is already installed)
- ❌ Change any code
- ❌ Follow the Upstash quickstart steps (those are for a different SDK)

The code is already set up to work with the environment variables that Upstash provides!
