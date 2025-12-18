#!/usr/bin/env node

/**
 * Removes duplicate beats from beat-data.json
 * Strategy:
 * - For same title with different formats (MP3 vs WAV), keep WAV version, remove MP3
 * - For true duplicates (same title, price, format), remove the later one
 */

const fs = require('fs')
const path = require('path')

const beatDataPath = path.join(__dirname, '../beat-data.json')
const beatData = JSON.parse(fs.readFileSync(beatDataPath, 'utf8'))

console.log('\n🔍 Finding and removing duplicates...\n')

// Track titles and their beats
const titleMap = new Map()
const beatsToRemove = new Set()

// First pass: collect all beats by title
beatData.beats.forEach((beat, index) => {
  const title = beat.title.trim()
  if (!titleMap.has(title)) {
    titleMap.set(title, [])
  }
  titleMap.get(title).push({ beat, index })
})

// Second pass: identify duplicates to remove
titleMap.forEach((beatEntries, title) => {
  if (beatEntries.length > 1) {
    // Sort by: WAV first (keep), then by index (keep first)
    beatEntries.sort((a, b) => {
      // Prefer WAV versions (includesWav: true) - WAV should come first
      if (a.beat.includesWav !== b.beat.includesWav) {
        return a.beat.includesWav ? -1 : 1
      }
      // If same format, prefer higher price (premium version)
      if (a.beat.price !== b.beat.price) {
        return b.beat.price - a.beat.price
      }
      // If same price and format, keep the first one (lower index)
      return a.index - b.index
    })
    
    // Keep the first one, mark others for removal
    const toKeep = beatEntries[0]
    const toRemove = beatEntries.slice(1)
    
    console.log(`📝 "${title}" (${beatEntries.length} entries):`)
    console.log(`   ✅ Keeping: ${toKeep.beat.id} ($${toKeep.beat.price}, ${toKeep.beat.includesWav ? 'WAV' : 'MP3'})`)
    
    toRemove.forEach(({ beat, index }) => {
      beatsToRemove.add(index)
      console.log(`   ❌ Removing: ${beat.id} ($${beat.price}, ${beat.includesWav ? 'WAV' : 'MP3'})`)
    })
    console.log()
  }
})

// Remove duplicates (in reverse order to maintain indices)
const indicesToRemove = Array.from(beatsToRemove).sort((a, b) => b - a)
indicesToRemove.forEach(index => {
  beatData.beats.splice(index, 1)
})

// Update total count
beatData.totalBeats = beatData.beats.length

// Write updated data back
fs.writeFileSync(beatDataPath, JSON.stringify(beatData, null, 2), 'utf8')

console.log(`\n✅ Removed ${indicesToRemove.length} duplicate beats`)
console.log(`   Total beats: ${beatData.totalBeats} (was ${beatData.totalBeats + indicesToRemove.length})\n`)
