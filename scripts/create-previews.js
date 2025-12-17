#!/usr/bin/env node

/**
 * Creates preview MP3s from full beats (128kbps, ~30 seconds)
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const BEATS_DIR = path.join(__dirname, '../public/beats')
const orgData = JSON.parse(fs.readFileSync(path.join(__dirname, '../beat-organization.json'), 'utf8'))

function hasFFmpeg() {
  try {
    execSync('which ffmpeg', { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

function createPreview(sourceFile, outputFile) {
  const hasFFmpegInstalled = hasFFmpeg()
  
  if (!hasFFmpegInstalled) {
    console.log(`   ⚠️  ffmpeg not found. Copying full file as preview...`)
    fs.copyFileSync(sourceFile, outputFile)
    return
  }

  try {
    // Create 30-second preview at 128kbps
    execSync(
      `ffmpeg -i "${sourceFile}" -t 30 -b:a 128k -y "${outputFile}"`,
      { stdio: 'ignore' }
    )
    console.log(`   ✅ Created preview`)
  } catch (error) {
    console.log(`   ⚠️  Error creating preview, copying full file...`)
    fs.copyFileSync(sourceFile, outputFile)
  }
}

function processBeats() {
  console.log(`\n🎵 Creating preview files for beats...\n`)
  
  orgData.beats.forEach((beat, index) => {
    const beatId = beat.id
    const sourceFile = beat.originalFile
    const outputFile = path.join(BEATS_DIR, `${beatId}-preview.mp3`)
    
    console.log(`   [${index + 1}/${orgData.beats.length}] ${beatId}: ${beat.filename}`)
    
    // If source is already MP3, we can use it directly or convert
    if (beat.isMp3) {
      // Copy and potentially trim
      createPreview(sourceFile, outputFile)
    } else if (beat.isWav) {
      // Convert WAV to MP3 preview
      createPreview(sourceFile, outputFile)
    }
  })

  console.log(`\n🔄 Creating preview files for loops...\n`)
  
  orgData.loops.forEach((loop, index) => {
    const loopId = loop.id
    const sourceFile = loop.originalFile
    const outputFile = path.join(BEATS_DIR, `${loopId}-preview.mp3`)
    
    console.log(`   [${index + 1}/${orgData.loops.length}] ${loopId}: ${loop.filename}`)
    createPreview(sourceFile, outputFile)
  })

  console.log(`\n✅ Preview files created in: public/beats/`)
}

processBeats()
