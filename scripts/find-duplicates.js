#!/usr/bin/env node

/**
 * Finds duplicate beat titles and other issues in beat-data.json
 */

const fs = require('fs')
const path = require('path')

const beatDataPath = path.join(__dirname, '../beat-data.json')
const beatData = JSON.parse(fs.readFileSync(beatDataPath, 'utf8'))

console.log('\n🔍 Checking for duplicates and issues...\n')

// Track titles and their occurrences
const titleMap = new Map()
const duplicates = []

// Check beats
beatData.beats.forEach((beat) => {
  const title = beat.title.trim()
  if (!titleMap.has(title)) {
    titleMap.set(title, [])
  }
  titleMap.get(title).push({
    id: beat.id,
    title: beat.title,
    price: beat.price,
    includesWav: beat.includesWav
  })
})

// Find duplicates
titleMap.forEach((beats, title) => {
  if (beats.length > 1) {
    duplicates.push({ title, beats })
  }
})

// Report duplicates
if (duplicates.length > 0) {
  console.log('❌ Found duplicate titles:\n')
  duplicates.forEach(({ title, beats }) => {
    console.log(`   "${title}" appears ${beats.length} times:`)
    beats.forEach((beat) => {
      console.log(`     - ${beat.id}: $${beat.price} ${beat.includesWav ? '(WAV)' : '(MP3)'}`)
    })
    console.log()
  })
} else {
  console.log('✅ No duplicate titles found in beats\n')
}

// Check for missing IDs (gaps in sequence)
const beatIds = beatData.beats.map(b => parseInt(b.id.replace('beat-', ''))).sort((a, b) => a - b)
const missingIds = []
for (let i = 1; i <= beatIds[beatIds.length - 1]; i++) {
  if (!beatIds.includes(i)) {
    missingIds.push(i)
  }
}

if (missingIds.length > 0) {
  console.log(`⚠️  Missing beat IDs: ${missingIds.map(id => `beat-${id}`).join(', ')}\n`)
}

// Summary
console.log(`📊 Summary:`)
console.log(`   Total beats: ${beatData.beats.length}`)
console.log(`   Unique titles: ${titleMap.size}`)
console.log(`   Duplicates found: ${duplicates.length}\n`)
