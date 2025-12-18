#!/usr/bin/env node

/**
 * Creates ZIP files for downloads
 * Includes WAV if available, otherwise MP3
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const AdmZip = require('adm-zip')

const DOWNLOADS_DIR = path.join(__dirname, '../public/downloads')
const orgData = JSON.parse(fs.readFileSync(path.join(__dirname, '../beat-organization.json'), 'utf8'))

function createZip(beat, outputPath) {
  const zip = new AdmZip()
  const sourceFile = beat.originalFile
  
  // Add the main file
  const filename = path.basename(sourceFile)
  zip.addLocalFile(sourceFile)
  
  // If there's a WAV version, prefer that, otherwise use MP3
  // For now, just add what we have
  
  // Save ZIP
  zip.writeZip(outputPath)
  console.log(`   ✅ Created ZIP (${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB)`)
}

function processBeats() {
  console.log(`\n📦 Creating ZIP files for beats...\n`)
  
  orgData.beats.forEach((beat, index) => {
    const beatId = beat.id
    const outputFile = path.join(DOWNLOADS_DIR, `${beatId}.zip`)
    
    console.log(`   [${index + 1}/${orgData.beats.length}] ${beatId}: ${beat.filename}`)
    createZip(beat, outputFile)
  })

  console.log(`\n📦 Creating ZIP files for loops...\n`)
  
  orgData.loops.forEach((loop, index) => {
    const loopId = loop.id
    const outputFile = path.join(DOWNLOADS_DIR, `${loopId}.zip`)
    
    console.log(`   [${index + 1}/${orgData.loops.length}] ${loopId}: ${loop.filename}`)
    createZip(loop, outputFile)
  })

  console.log(`\n✅ ZIP files created in: public/downloads/`)
}

// Check if adm-zip is installed
try {
  require('adm-zip')
  processBeats()
} catch (error) {
  console.error(`\n❌ adm-zip package not found.`)
  console.error(`\nPlease install it manually with:`)
  console.error(`   npm install adm-zip --save-dev --legacy-peer-deps`)
  console.error(`\nThen run this script again.\n`)
  process.exit(1)
}
