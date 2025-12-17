#!/usr/bin/env node

/**
 * Updates pricing based on file types:
 * - MP3 only: $35
 * - WAV (includes MP3): $50
 * - Loops: $25
 */

const fs = require('fs')
const path = require('path')

const orgDataPath = path.join(__dirname, '../beat-organization.json')
const beatDataPath = path.join(__dirname, '../beat-data.json')

const orgData = JSON.parse(fs.readFileSync(orgDataPath, 'utf8'))
const beatData = JSON.parse(fs.readFileSync(beatDataPath, 'utf8'))

// Create a map of beat IDs to file types
const beatFileTypes = {}
orgData.beats.forEach(beat => {
  beatFileTypes[beat.id] = {
    hasWav: beat.isWav,
    hasMp3: beat.isMp3,
  }
})

// Update beat prices
beatData.beats.forEach(beat => {
  const fileType = beatFileTypes[beat.id]
  if (fileType) {
    if (fileType.hasWav) {
      // Has WAV = MP3 + WAV = $50
      beat.price = 50
      beat.includesWav = true
      beat.fileFormat = "MP3 + WAV"
    } else if (fileType.hasMp3) {
      // MP3 only = $35
      beat.price = 35
      beat.includesWav = false
      beat.fileFormat = "MP3"
    }
  }
})

// Update loop prices
beatData.loops.forEach(loop => {
  loop.price = 25
  loop.includesWav = false // Loops are typically MP3
  loop.fileFormat = "MP3"
})

// Save updated data
fs.writeFileSync(beatDataPath, JSON.stringify(beatData, null, 2))

console.log(`\n✅ Updated pricing:`)
console.log(`   Beats with WAV: ${beatData.beats.filter(b => b.includesWav).length} at $50`)
console.log(`   Beats MP3 only: ${beatData.beats.filter(b => !b.includesWav).length} at $35`)
console.log(`   Loops: ${beatData.loops.length} at $25`)
console.log(`\n📝 Saved to: beat-data.json\n`)
