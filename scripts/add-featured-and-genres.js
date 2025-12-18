#!/usr/bin/env node

/**
 * Adds featured flags and genre tags to beats
 * You can manually edit beat-data.json to mark beats as featured and add genres
 */

const fs = require('fs')
const path = require('path')

const beatDataPath = path.join(__dirname, '../beat-data.json')
const beatData = JSON.parse(fs.readFileSync(beatDataPath, 'utf8'))

// Common genres for beats
const commonGenres = [
  'Trap', 'Hip-Hop', 'R&B', 'Pop', 'Drill', 'Afrobeat', 
  'Latin', 'Reggaeton', 'Dancehall', 'Electronic', 'Ambient'
]

// Function to guess genre from title (you can manually override)
function guessGenre(title) {
  const lower = title.toLowerCase()
  
  if (lower.includes('trap') || lower.includes('drill')) return 'Trap'
  if (lower.includes('r&b') || lower.includes('rnb') || lower.includes('smooth')) return 'R&B'
  if (lower.includes('latin') || lower.includes('reggaeton')) return 'Latin'
  if (lower.includes('afro') || lower.includes('african')) return 'Afrobeat'
  if (lower.includes('dance') || lower.includes('electronic')) return 'Electronic'
  if (lower.includes('ambient') || lower.includes('chill')) return 'Ambient'
  
  // Default to Hip-Hop for most beats
  return 'Hip-Hop'
}

// Add featured flag (default: false, you can manually set 2-3 to true)
// Add genre (default: guessed from title)
beatData.beats.forEach((beat, index) => {
  // Only add if not already present
  if (beat.featured === undefined) {
    beat.featured = false
  }
  if (!beat.genre) {
    beat.genre = guessGenre(beat.title)
  }
  // Allow multiple genres as array
  if (!Array.isArray(beat.genre)) {
    beat.genre = [beat.genre]
  }
})

// Same for loops
beatData.loops.forEach((loop) => {
  if (loop.featured === undefined) {
    loop.featured = false
  }
  if (!loop.genre) {
    loop.genre = ['Loop']
  }
  if (!Array.isArray(loop.genre)) {
    loop.genre = [loop.genre]
  }
})

// Save updated data
fs.writeFileSync(beatDataPath, JSON.stringify(beatData, null, 2))

console.log(`\n✅ Added featured and genre fields:`)
console.log(`   Featured beats: ${beatData.beats.filter(b => b.featured).length} (set manually in JSON)`)
console.log(`   All beats now have genre tags`)
console.log(`\n📝 To mark beats as featured:`)
console.log(`   1. Open beat-data.json`)
console.log(`   2. Find beats you want to feature (premium $50 ones)`)
console.log(`   3. Set "featured": true for 2-3 beats`)
console.log(`   4. Update "genre" arrays if needed`)
console.log(`\n💡 Common genres: ${commonGenres.join(', ')}\n`)
