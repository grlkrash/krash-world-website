#!/usr/bin/env node

/**
 * Upload preview files to AWS S3
 * 
 * Prerequisites:
 * 1. Install AWS CLI: brew install awscli
 * 2. Configure AWS credentials: aws configure
 * 3. Set bucket name and region below
 */

const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================
const S3_BUCKET_NAME = 'krash-beatstore-aws' // Your bucket name
const S3_REGION = 'us-east-2' // US East (Ohio)
const S3_PREFIX = 'previews' // Optional: folder prefix in S3
const PUBLIC_ACCESS = true // Set to true to make files publicly accessible

// ============================================
// SCRIPT
// ============================================

const BEATS_DIR = path.join(__dirname, '../public/beats')

function checkAWSCLI() {
  try {
    execSync('which aws', { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

function uploadFile(localPath, s3Key) {
  const publicFlag = PUBLIC_ACCESS ? '--acl public-read' : ''
  const command = `aws s3 cp "${localPath}" "s3://${S3_BUCKET_NAME}/${s3Key}" ${publicFlag} --region ${S3_REGION}`
  
  try {
    execSync(command, { stdio: 'inherit' })
    return true
  } catch (error) {
    console.error(`❌ Failed to upload ${localPath}`)
    return false
  }
}

function uploadAllPreviews() {
  if (!checkAWSCLI()) {
    console.error('❌ AWS CLI not found. Install it with: brew install awscli')
    console.error('   Then configure with: aws configure')
    process.exit(1)
  }

  if (!fs.existsSync(BEATS_DIR)) {
    console.error(`❌ Directory not found: ${BEATS_DIR}`)
    process.exit(1)
  }

  if (S3_BUCKET_NAME === 'YOUR_BUCKET_NAME_HERE') {
    console.error('❌ Please update S3_BUCKET_NAME in the script!')
    process.exit(1)
  }

  console.log(`\n📦 Uploading preview files to S3...\n`)
  console.log(`   Bucket: ${S3_BUCKET_NAME}`)
  console.log(`   Region: ${S3_REGION}`)
  console.log(`   Prefix: ${S3_PREFIX || '(none)'}`)
  console.log(`   Public: ${PUBLIC_ACCESS ? 'Yes' : 'No'}\n`)

  const files = fs.readdirSync(BEATS_DIR)
    .filter(file => file.endsWith('.mp3'))
    .sort()

  console.log(`Found ${files.length} preview files\n`)

  let successCount = 0
  let failCount = 0

  files.forEach((file, index) => {
    const localPath = path.join(BEATS_DIR, file)
    const s3Key = S3_PREFIX ? `${S3_PREFIX}/${file}` : file
    
    console.log(`[${index + 1}/${files.length}] Uploading ${file}...`)
    
    if (uploadFile(localPath, s3Key)) {
      successCount++
    } else {
      failCount++
    }
  })

  console.log(`\n✅ Upload complete!`)
  console.log(`   Success: ${successCount}`)
  console.log(`   Failed: ${failCount}`)
  
  if (successCount > 0) {
    const baseUrl = `https://${S3_BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com`
    const urlPrefix = S3_PREFIX ? `${baseUrl}/${S3_PREFIX}` : baseUrl
    console.log(`\n📝 S3 Base URL: ${urlPrefix}/`)
    console.log(`\n   Example file URL: ${urlPrefix}/beat-1-preview.mp3`)
    console.log(`\n   Next step: Update beat-data.json with these URLs`)
  }
}

uploadAllPreviews()
