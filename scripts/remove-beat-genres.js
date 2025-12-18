#!/usr/bin/env node

/**
 * Removes all genre tags from beats
 * Leaves loops and templates unchanged
 */

const fs = require('fs')
const path = require('path')

const beatDataPath = path.join(__dirname, '../beat-data.json')
const beatData = JSON.parse(fs.readFileSync(beatDataPath, 'utf8'))

let beatsUpdated = 0

// Remove genre tags from all beats
beatData.beats.forEach((beat) => {
  if (beat.genre && beat.genre.length > 0) {
    beat.genre = []
    beatsUpdated++
  }
})

// Write updated data back to file
fs.writeFileSync(beatDataPath, JSON.stringify(beatData, null, 2), 'utf8')

console.log(`\n✅ Removed genre tags from ${beatsUpdated} beats`)
console.log(`   All beats now have empty genre arrays`)
console.log(`   Loops and templates were left unchanged\n`)
