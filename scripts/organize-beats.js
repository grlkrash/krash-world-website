#!/usr/bin/env node

/**
 * Script to organize beats and loops from source folder
 * Categorizes files, creates previews, and prepares ZIPs
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const SOURCE_DIR = '/Users/sonia/Downloads/BEATS 4 SITE'
const BEATS_DIR = path.join(__dirname, '../public/beats')
const DOWNLOADS_DIR = path.join(__dirname, '../public/downloads')
const IMAGES_DIR = path.join(__dirname, '../public/images')

// Ensure directories exist
;[BEATS_DIR, DOWNLOADS_DIR, IMAGES_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
})

function isLoop(filename) {
  const lower = filename.toLowerCase()
  return lower.includes('loop') || lower.includes('idea')
}

function getBestFile(files) {
  // Prefer WAV over MP3
  const wav = files.find(f => f.endsWith('.wav'))
  if (wav) return wav
  return files.find(f => f.endsWith('.mp3'))
}

function sanitizeName(name) {
  // Remove extension and clean up
  return name
    .replace(/\.(mp3|wav)$/i, '')
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase()
    .substring(0, 50)
}

async function organizeFiles() {
  const files = fs.readdirSync(SOURCE_DIR)
    .filter(f => f.match(/\.(mp3|wav)$/i))
    .map(f => path.join(SOURCE_DIR, f))

  const beats = []
  const loops = []

  // Categorize files
  files.forEach(file => {
    const filename = path.basename(file)
    if (isLoop(filename)) {
      loops.push(file)
    } else {
      beats.push(file)
    }
  })

  console.log(`\n📊 Found:`)
  console.log(`   ${beats.length} beats`)
  console.log(`   ${loops.length} loops`)
  console.log(`\n🎵 Processing beats...\n`)

  // Process beats
  const beatData = []
  beats.forEach((file, index) => {
    const filename = path.basename(file)
    const beatId = `beat-${index + 1}`
    const sanitized = sanitizeName(filename)
    
    console.log(`   ${beatId}: ${filename}`)
    
    beatData.push({
      id: beatId,
      originalFile: file,
      filename: filename,
      sanitized: sanitized,
      isWav: file.endsWith('.wav'),
      isMp3: file.endsWith('.mp3'),
    })
  })

  console.log(`\n🔄 Processing loops...\n`)

  // Process loops
  const loopData = []
  loops.forEach((file, index) => {
    const filename = path.basename(file)
    const loopId = `loop-${index + 1}`
    const sanitized = sanitizeName(filename)
    
    console.log(`   ${loopId}: ${filename}`)
    
    loopData.push({
      id: loopId,
      originalFile: file,
      filename: filename,
      sanitized: sanitized,
      isWav: file.endsWith('.wav'),
      isMp3: file.endsWith('.mp3'),
    })
  })

  // Save organization data
  const output = {
    beats: beatData,
    loops: loopData,
    totalBeats: beatData.length,
    totalLoops: loopData.length,
  }

  fs.writeFileSync(
    path.join(__dirname, '../beat-organization.json'),
    JSON.stringify(output, null, 2)
  )

  console.log(`\n✅ Organization complete!`)
  console.log(`   Data saved to: beat-organization.json`)
  console.log(`\n📝 Next steps:`)
  console.log(`   1. Review beat-organization.json`)
  console.log(`   2. Run: npm run create-previews`)
  console.log(`   3. Run: npm run create-zips`)
  console.log(`   4. Update beatstore/page.tsx with your beat data\n`)

  return output
}

organizeFiles().catch(console.error)
