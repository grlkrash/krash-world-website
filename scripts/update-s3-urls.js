#!/usr/bin/env node

/**
 * Update beat-data.json with S3 URLs after uploading previews
 * 
 * Usage:
 *   node scripts/update-s3-urls.js YOUR_BUCKET_NAME us-east-1 [prefix]
 * 
 * Example:
 *   node scripts/update-s3-urls.js krash-world-beats us-east-1 previews
 */

const fs = require('fs')
const path = require('path')

const BUCKET_NAME = process.argv[2]
const REGION = process.argv[3] || 'us-east-1'
const PREFIX = process.argv[4] || ''

if (!BUCKET_NAME) {
  console.error('❌ Usage: node scripts/update-s3-urls.js BUCKET_NAME [REGION] [PREFIX]')
  console.error('   Example: node scripts/update-s3-urls.js krash-world-beats us-east-1 previews')
  process.exit(1)
}

const BEAT_DATA_PATH = path.join(__dirname, '../beat-data.json')
const data = JSON.parse(fs.readFileSync(BEAT_DATA_PATH, 'utf8'))

const baseUrl = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com`
const urlPrefix = PREFIX ? `${baseUrl}/${PREFIX}` : baseUrl

console.log(`\n🔄 Updating preview URLs to S3...\n`)
console.log(`   Base URL: ${urlPrefix}/`)

let updatedCount = 0

// Update beats
if (data.beats) {
  data.beats.forEach(beat => {
    if (beat.previewUrl && beat.previewUrl.startsWith('/beats/')) {
      const filename = beat.previewUrl.replace('/beats/', '')
      beat.previewUrl = `${urlPrefix}/${filename}`
      updatedCount++
    }
  })
}

// Update loops
if (data.loops) {
  data.loops.forEach(loop => {
    if (loop.previewUrl && loop.previewUrl.startsWith('/beats/')) {
      const filename = loop.previewUrl.replace('/beats/', '')
      loop.previewUrl = `${urlPrefix}/${filename}`
      updatedCount++
    }
  })
}

// Save updated data
fs.writeFileSync(BEAT_DATA_PATH, JSON.stringify(data, null, 2))

console.log(`✅ Updated ${updatedCount} preview URLs`)
console.log(`\n   Example URL: ${data.beats?.[0]?.previewUrl || 'N/A'}`)
console.log(`\n   Next: Commit and push the updated beat-data.json`)
