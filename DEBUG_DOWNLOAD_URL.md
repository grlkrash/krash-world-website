# Debug: Download URL Still Using Vercel Preview URL

## Issue
Even though `NEXT_PUBLIC_BASE_URL` is set in Vercel, download links in emails are still using Vercel preview URLs.

## Debugging Steps

### Step 1: Check Vercel Logs After Next Purchase

After making a test purchase, check your Vercel function logs. You should see debug output like:

```
🔍 Download URL Debug: {
  NEXT_PUBLIC_BASE_URL: "https://www.krash.world" (or "(not set)"),
  VERCEL_URL: "krash-world-website-xxx.vercel.app" (or "(not set)"),
  NODE_ENV: "production" (or "development")
}
🔗 Generated baseUrl: [the actual URL being used]
```

**What to look for:**
- If `NEXT_PUBLIC_BASE_URL` shows "(not set)" → The variable isn't being read
- If `NEXT_PUBLIC_BASE_URL` has a value but `baseUrl` is still Vercel → Logic issue
- If `NODE_ENV` is not "production" → Might be running in preview mode

### Step 2: Verify Environment Variable in Vercel

1. Go to: https://vercel.com/your-project/settings/environment-variables
2. Check for **either** of these variables (code checks both):
   - `BASE_URL` (recommended for API routes)
   - `NEXT_PUBLIC_BASE_URL` (also works)
3. Verify:
   - ✅ Variable name is exactly correct (case-sensitive, no typos)
   - ✅ Value is exactly: `https://www.krash.world` (no trailing slash, no quotes)
   - ✅ Environment scope includes "Production" (and "Preview" if you want)
   - ✅ No extra spaces or hidden characters

**Recommended**: Use `BASE_URL` (without `NEXT_PUBLIC_`) as it's more reliable in API routes.

### Step 3: Common Issues

#### Issue A: Variable Set for Wrong Environment
**Problem**: Variable is set for "Preview" but not "Production" (or vice versa)

**Fix**: 
- In Vercel, edit the variable
- Make sure "Production" is checked
- Redeploy

#### Issue B: Variable Name Typo
**Problem**: Variable might be named slightly differently

**Fix**:
- Double-check the exact name: `NEXT_PUBLIC_BASE_URL`
- Common mistakes: `NEXT_PUBLIC_BASEURL`, `NEXT_PUBLIC_BASE_URL_`, extra spaces

#### Issue C: Variable Has Wrong Value
**Problem**: Value might have trailing slash, quotes, or wrong domain

**Fix**:
- Should be: `https://www.krash.world`
- NOT: `https://www.krash.world/` (trailing slash)
- NOT: `"https://www.krash.world"` (quotes)
- NOT: `https://krash-world-website.vercel.app` (wrong domain)

#### Issue D: Build Cache Issue
**Problem**: Old build might be cached

**Fix**:
- In Vercel, go to Deployments
- Click "Redeploy" on the latest deployment
- Or trigger a new deployment by pushing a commit

#### Issue E: NEXT_PUBLIC_ Variables in API Routes
**Problem**: In Next.js, `NEXT_PUBLIC_` variables are primarily for client-side code. While they should work in API routes, there might be edge cases.

**Alternative Fix**: Use a regular environment variable (without `NEXT_PUBLIC_`):
- Set `BASE_URL` instead of `NEXT_PUBLIC_BASE_URL`
- Update code to check both: `process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL`

### Step 4: Test After Fix

1. Make a test purchase
2. Check Vercel logs for the debug output
3. Verify the email contains the correct domain
4. Test the download link

## Quick Fix: Use Regular Environment Variable

If `NEXT_PUBLIC_BASE_URL` continues to not work, we can switch to a regular environment variable:

1. In Vercel, add: `BASE_URL` = `https://www.krash.world`
2. Update the code to check `BASE_URL` first

This is more reliable for API routes since `NEXT_PUBLIC_` variables are optimized for client-side bundling.
