#!/usr/bin/env node

/**
 * Generates beat data for the beatstore page from organization file
 */

const fs = require('fs')
const path = require('path')

const orgData = JSON.parse(fs.readFileSync(path.join(__dirname, '../beat-organization.json'), 'utf8'))

function cleanTitle(filename) {
  // Remove extension and clean up
  return filename
    .replace(/\.(mp3|wav)$/i, '')
    .replace(/\s+v\d+$/i, '') // Remove version numbers
    .replace(/\s*\([^)]*\)/g, '') // Remove parentheses content
    .trim()
    .toUpperCase()
}

function generateDescription(filename) {
  const lower = filename.toLowerCase()
  if (lower.includes('loop')) {
    return 'Musical loop perfect for your projects. Includes full audio file.'
  }
  return 'Premium beat for your next project. Includes full audio file.'
}

const beats = orgData.beats.map(beat => ({
  id: beat.id,
  title: cleanTitle(beat.filename),
  description: generateDescription(beat.filename),
  price: 50, // Default price - you can update this
  previewUrl: `/beats/${beat.id}-preview.mp3`,
  coverImage: '/images/beat-cover.jpg', // Placeholder - update this path
}))

const loops = orgData.loops.map(loop => ({
  id: loop.id,
  title: cleanTitle(loop.filename),
  description: 'Musical loop perfect for your projects. Includes full audio file.',
  price: 30, // Loops might be cheaper
  previewUrl: `/beats/${loop.id}-preview.mp3`,
  coverImage: '/images/beat-cover.jpg', // Placeholder - update this path
}))

const output = {
  beats,
  loops,
  totalBeats: beats.length,
  totalLoops: loops.length,
}

fs.writeFileSync(
  path.join(__dirname, '../beat-data.json'),
  JSON.stringify(output, null, 2)
)

console.log(`\n✅ Generated beat data:`)
console.log(`   ${beats.length} beats`)
console.log(`   ${loops.length} loops`)
console.log(`\n📝 Saved to: beat-data.json`)
console.log(`\n⚠️  Next steps:`)
console.log(`   1. Copy your placeholder image to: public/images/beat-cover.jpg`)
console.log(`   2. Review beat-data.json and update titles/prices if needed`)
console.log(`   3. Run: npm run update-beatstore\n`)
