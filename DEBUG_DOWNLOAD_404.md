# Debug Summary: /api/beatstore/download 404 Error

## Issues Identified

### 1. 404 Error on `/api/beatstore/download`
**Status:** Route exists and is properly configured, but returning 404

**Possible Causes:**
- ✅ Route file exists at `app/api/beatstore/download/route.ts`
- ✅ Route handler is properly exported
- ⚠️ Route may be returning 404 from within handler (not a routing issue)

**Two scenarios where route returns 404:**
1. **Transaction not found** (line 40) - Less likely since `/api/beatstore/verify` works
2. **S3 file not found** (line 117) - Most likely cause

### 2. Metadata themeColor Warning
**Status:** ✅ Fixed
- Moved `themeColor` from `metadata` export to `viewport` export in `app/layout.tsx`
- This follows Next.js 14 App Router requirements

## Changes Made

### Enhanced Logging in Download Route
Added comprehensive logging to help debug:
- Request URL and headers logging
- All search parameters logging
- Transaction verification details
- S3 configuration check details
- Detailed error messages with stack traces
- File location attempts with specific error details

### Route Configuration
Added runtime configuration:
```typescript
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
```

## Debugging Steps

### Step 1: Check Vercel Function Logs
After the next download attempt, look for these log messages:

**Expected logs if route is called:**
```
🔵 Download route called: [URL]
📥 Download request - token: [token], beatId: [beatId]
🔍 Verifying transaction: [token] for beat: [beatId]
```

**If transaction not found:**
```
❌ Transaction not found: [token]
💡 Possible reasons:
   1. Transaction stored in different serverless instance
   2. Transaction expired (48 hour limit)
   3. Vercel KV not configured
```

**If S3 file not found:**
```
❌ S3 download failed for all locations
   Last error: [error message]
   Tried locations: downloads/[beatId].zip, [beatId].zip
   Beat ID: [beatId]
   Bucket: [bucket name]
```

### Step 2: Verify S3 File Exists
Check if the ZIP file exists in S3:
- Location 1: `downloads/[beatId].zip`
- Location 2: `[beatId].zip` (root level)

**Example:**
- If `beatId = "beat-1"`, check for:
  - `downloads/beat-1.zip`
  - `beat-1.zip`

### Step 3: Verify AWS Credentials
Ensure these environment variables are set in Vercel:
- `AWS_REGION` (default: `us-east-2`)
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `S3_BUCKET_NAME` (default: `krash-beatstore-aws`)

### Step 4: Check AWS Permissions
Verify the AWS credentials have:
- `s3:GetObject` permission on the bucket
- Access to the specific file paths

## Next Steps

1. **Deploy the updated route** with enhanced logging
2. **Trigger a download** and check Vercel function logs
3. **Identify the specific error** from the detailed logs
4. **Fix the root cause:**
   - If S3 file missing: Upload the ZIP file to S3
   - If transaction missing: Check Vercel KV configuration
   - If AWS permissions: Update IAM policy

## Testing

To test locally:
```bash
# Start dev server
npm run dev

# Test download endpoint
curl "http://localhost:3000/api/beatstore/download?token=TEST_TOKEN&beatId=TEST_BEAT_ID"
```

## Related Files
- `app/api/beatstore/download/route.ts` - Download API route
- `app/api/beatstore/verify/route.ts` - Verification route (working)
- `app/download/[token]/page.tsx` - Download page component
- `app/layout.tsx` - Root layout (metadata fix)
