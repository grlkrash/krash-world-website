# Fix: Download Link Using Vercel Preview URL

## Problem
Download links in confirmation emails were pointing to Vercel preview URLs (e.g., `https://krash-world-website-qv4u8918d-grlkrashs-projects.vercel.app`) instead of the production domain.

## Root Cause
The code in `app/api/beatstore/send-download/route.ts` was falling back to `VERCEL_URL` when `NEXT_PUBLIC_BASE_URL` was not set. `VERCEL_URL` is automatically set by Vercel and contains the preview/deployment URL, not the production domain.

## Solution Applied
Updated the download URL generation logic to:
1. **First priority**: Use `NEXT_PUBLIC_BASE_URL` if set (recommended)
2. **Second priority**: Use production domain `https://www.krash.world` when in production
3. **Third priority**: Fall back to `VERCEL_URL` (for preview deployments)
4. **Last resort**: Use `localhost:3000` for local development

## Required Action: Set Environment Variable in Vercel

**You MUST set this environment variable in Vercel for production:**

1. Go to: https://vercel.com/your-project/settings/environment-variables
2. Add a new environment variable:
   - **Name**: `NEXT_PUBLIC_BASE_URL`
   - **Value**: `https://www.krash.world` (or `https://krash.world` if you prefer)
   - **Environment**: Production (and optionally Preview/Development)

3. **Redeploy** your application after adding the variable

## Why This Happened
- **NOT related to PayPal sandbox credentials** - PayPal only handles payment processing
- The issue was purely in the download link URL generation logic
- The download flow itself is correct: Vercel page → verifies transaction → fetches from S3 → serves file

## Testing
After setting the environment variable and redeploying:
1. Make a test purchase
2. Check the confirmation email
3. Verify the download link uses `https://www.krash.world/download/[token]` instead of a Vercel preview URL

## Current Download Flow (Correct)
1. User receives email with link: `https://www.krash.world/download/[transactionId]`
2. User clicks link → Opens download page on your domain
3. Page verifies transaction via `/api/beatstore/verify`
4. User clicks download button → Calls `/api/beatstore/download`
5. API fetches ZIP file from S3 bucket
6. File is served to user

This flow is secure and correct - it verifies transactions before allowing downloads.

