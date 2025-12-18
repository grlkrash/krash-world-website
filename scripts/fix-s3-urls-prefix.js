#!/usr/bin/env node

/**
 * Fix S3 URLs in beat-data.json to include the 'beats/' prefix
 * 
 * Usage:
 *   node scripts/fix-s3-urls-prefix.js
 */

const fs = require('fs')
const path = require('path')

const BEAT_DATA_PATH = path.join(__dirname, '../beat-data.json')
const data = JSON.parse(fs.readFileSync(BEAT_DATA_PATH, 'utf8'))

const baseUrl = 'https://krash-beatstore-aws.s3.us-east-2.amazonaws.com'

console.log(`\n🔄 Fixing S3 URLs to include 'beats/' prefix...\n`)

let updatedCount = 0

// Update beats
if (data.beats) {
  data.beats.forEach(beat => {
    if (beat.previewUrl && beat.previewUrl.startsWith(baseUrl) && !beat.previewUrl.includes('/beats/')) {
      const filename = beat.previewUrl.replace(`${baseUrl}/`, '')
      beat.previewUrl = `${baseUrl}/beats/${filename}`
      updatedCount++
    }
  })
}

// Update loops
if (data.loops) {
  data.loops.forEach(loop => {
    if (loop.previewUrl && loop.previewUrl.startsWith(baseUrl) && !loop.previewUrl.includes('/beats/')) {
      const filename = loop.previewUrl.replace(`${baseUrl}/`, '')
      loop.previewUrl = `${baseUrl}/beats/${filename}`
      updatedCount++
    }
  })
}

// Save updated data
fs.writeFileSync(BEAT_DATA_PATH, JSON.stringify(data, null, 2))

console.log(`✅ Updated ${updatedCount} preview URLs`)
console.log(`\n   Example: ${baseUrl}/beats/beat-1-preview.mp3`)
