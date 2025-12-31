#!/usr/bin/env node

/**
 * Upload ZIP download files to AWS S3
 * 
 * This uploads the beat ZIP files from public/downloads/ to S3
 * so they can be accessed by the download API.
 * 
 * Prerequisites:
 * 1. Install AWS CLI: brew install awscli
 * 2. Configure AWS credentials: aws configure
 */

const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

// ============================================
// CONFIGURATION
// ============================================
const S3_BUCKET_NAME = 'krash-beatstore-aws'
const S3_REGION = 'us-east-2'
const S3_PREFIX = 'downloads' // Files will be at s3://bucket/downloads/beat-1.zip
const PUBLIC_ACCESS = false // Keep false - downloads should go through API for verification

// ============================================
// SCRIPT
// ============================================

const DOWNLOADS_DIR = path.join(__dirname, '../public/downloads')

function checkAWSCLI() {
  try {
    execSync('which aws', { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

function uploadFile(localPath, s3Key) {
  // Note: Not using --acl public-read since we want authenticated access through the API
  const command = `aws s3 cp "${localPath}" "s3://${S3_BUCKET_NAME}/${s3Key}" --region ${S3_REGION}`
  
  try {
    execSync(command, { stdio: 'inherit' })
    return true
  } catch (error) {
    console.error(`❌ Failed to upload ${localPath}`)
    return false
  }
}

function uploadAllZips() {
  if (!checkAWSCLI()) {
    console.error('❌ AWS CLI not found. Install it with: brew install awscli')
    console.error('   Then configure with: aws configure')
    process.exit(1)
  }

  if (!fs.existsSync(DOWNLOADS_DIR)) {
    console.error(`❌ Directory not found: ${DOWNLOADS_DIR}`)
    process.exit(1)
  }

  console.log(`\n📦 Uploading ZIP files to S3...\n`)
  console.log(`   Bucket: ${S3_BUCKET_NAME}`)
  console.log(`   Region: ${S3_REGION}`)
  console.log(`   Prefix: ${S3_PREFIX}`)
  console.log(`   Source: ${DOWNLOADS_DIR}\n`)

  const files = fs.readdirSync(DOWNLOADS_DIR)
    .filter(file => file.endsWith('.zip'))
    .sort()

  console.log(`Found ${files.length} ZIP files\n`)

  if (files.length === 0) {
    console.log('No ZIP files found to upload.')
    console.log('Make sure you have .zip files in public/downloads/')
    process.exit(0)
  }

  let successCount = 0
  let failCount = 0

  files.forEach((file, index) => {
    const localPath = path.join(DOWNLOADS_DIR, file)
    const s3Key = `${S3_PREFIX}/${file}`
    
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
    console.log(`\n📝 Files uploaded to: s3://${S3_BUCKET_NAME}/${S3_PREFIX}/`)
    console.log(`\n   Example: s3://${S3_BUCKET_NAME}/${S3_PREFIX}/beat-1.zip`)
    console.log(`\n✅ The download API will now be able to serve these files!`)
  }
}

// Also upload any template files
function uploadTemplates() {
  const templatesDir = path.join(DOWNLOADS_DIR, 'templates')
  
  if (!fs.existsSync(templatesDir)) {
    console.log('\nNo templates directory found, skipping templates.')
    return
  }
  
  const files = fs.readdirSync(templatesDir)
    .filter(file => file.endsWith('.zip'))
    .sort()
    
  if (files.length === 0) {
    console.log('\nNo template ZIP files found.')
    return
  }
  
  console.log(`\n📦 Uploading ${files.length} template files...\n`)
  
  let successCount = 0
  
  files.forEach((file, index) => {
    const localPath = path.join(templatesDir, file)
    const s3Key = `${S3_PREFIX}/templates/${file}`
    
    console.log(`[${index + 1}/${files.length}] Uploading template ${file}...`)
    
    if (uploadFile(localPath, s3Key)) {
      successCount++
    }
  })
  
  console.log(`\n✅ Templates uploaded: ${successCount}`)
}

// Run
uploadAllZips()
uploadTemplates()

console.log(`
====================================
NEXT STEPS:
====================================

1. Verify files are in S3:
   aws s3 ls s3://${S3_BUCKET_NAME}/${S3_PREFIX}/

2. Test the health check endpoint:
   curl https://www.krash.world/api/beatstore/health

3. Make a test purchase and verify download works

4. If download still fails, check Vercel function logs for errors
`)

