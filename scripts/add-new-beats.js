#!/usr/bin/env node

/**
 * Adds new beats from additional folder, checking for duplicates
 */

const fs = require('fs')
const path = require('path')

const ORIGINAL_FOLDER = '/Users/sonia/Downloads/BEATS 4 SITE'
const NEW_FOLDER = '/Users/sonia/Downloads/BEATS 24-25 3'
const orgDataPath = path.join(__dirname, '../beat-organization.json')

// Load existing organization
const existingOrg = JSON.parse(fs.readFileSync(orgDataPath, 'utf8'))

// Get all existing filenames (normalized for comparison)
const existingFilenames = new Set(
  [...existingOrg.beats, ...existingOrg.loops].map(item => 
    item.filename.toLowerCase().trim()
  )
)

function isLoop(filename) {
  const lower = filename.toLowerCase()
  return lower.includes('loop') || lower.includes('idea')
}

function getAllAudioFiles(dir) {
  const files = []
  
  function walkDir(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)
      
      if (entry.isDirectory()) {
        // Skip certain folders or recurse
        if (!entry.name.startsWith('.')) {
          walkDir(fullPath)
        }
      } else if (entry.isFile() && /\.(mp3|wav)$/i.test(entry.name)) {
        files.push({
          fullPath,
          filename: entry.name,
          relativePath: path.relative(NEW_FOLDER, fullPath)
        })
      }
    }
  }
  
  walkDir(dir)
  return files
}

function normalizeFilename(filename) {
  return filename
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
}

function isDuplicate(filename, existingSet) {
  const normalized = normalizeFilename(filename)
  
  // Check exact match
  if (existingSet.has(normalized)) {
    return true
  }
  
  // Check variations (remove version numbers, parentheses, etc.)
  const baseName = normalized
    .replace(/\s*v\d+$/i, '')
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/\s*extendo/gi, '')
    .replace(/\s*slowed/gi, '')
    .trim()
  
  // Check if any existing file has the same base name
  for (const existing of existingSet) {
    const existingBase = existing
      .replace(/\s*v\d+$/i, '')
      .replace(/\s*\([^)]*\)/g, '')
      .replace(/\s*extendo/gi, '')
      .replace(/\s*slowed/gi, '')
      .trim()
    
    if (existingBase === baseName && existingBase.length > 0) {
      return true
    }
  }
  
  return false
}

// Get all files from new folder
console.log(`\n🔍 Scanning new folder: ${NEW_FOLDER}\n`)
const newFiles = getAllAudioFiles(NEW_FOLDER)

console.log(`📊 Found ${newFiles.length} audio files in new folder\n`)

// Separate new files from duplicates
const newBeats = []
const newLoops = []
const duplicates = []

newFiles.forEach(file => {
  if (isDuplicate(file.filename, existingFilenames)) {
    duplicates.push(file.filename)
  } else {
    if (isLoop(file.filename)) {
      newLoops.push(file)
    } else {
      newBeats.push(file)
    }
  }
})

console.log(`📈 Analysis:`)
console.log(`   ✅ ${newBeats.length} new beats found`)
console.log(`   ✅ ${newLoops.length} new loops found`)
console.log(`   ⚠️  ${duplicates.length} duplicates skipped\n`)

if (duplicates.length > 0) {
  console.log(`🔄 Duplicates found:`)
  duplicates.slice(0, 10).forEach(dup => console.log(`   - ${dup}`))
  if (duplicates.length > 10) {
    console.log(`   ... and ${duplicates.length - 10} more`)
  }
  console.log()
}

// Add new beats to organization
let nextBeatId = existingOrg.beats.length + 1
let nextLoopId = existingOrg.loops.length + 1

newBeats.forEach(file => {
  existingOrg.beats.push({
    id: `beat-${nextBeatId}`,
    originalFile: file.fullPath,
    filename: file.filename,
    sanitized: file.filename
      .replace(/\.(mp3|wav)$/i, '')
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase()
      .substring(0, 50),
    isWav: file.filename.endsWith('.wav'),
    isMp3: file.filename.endsWith('.mp3'),
  })
  nextBeatId++
})

newLoops.forEach(file => {
  existingOrg.loops.push({
    id: `loop-${nextLoopId}`,
    originalFile: file.fullPath,
    filename: file.filename,
    sanitized: file.filename
      .replace(/\.(mp3|wav)$/i, '')
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase()
      .substring(0, 50),
    isWav: file.filename.endsWith('.wav'),
    isMp3: file.filename.endsWith('.mp3'),
  })
  nextLoopId++
})

// Update totals
existingOrg.totalBeats = existingOrg.beats.length
existingOrg.totalLoops = existingOrg.loops.length

// Save updated organization
fs.writeFileSync(orgDataPath, JSON.stringify(existingOrg, null, 2))

console.log(`✅ Updated organization file`)
console.log(`   Total beats: ${existingOrg.totalBeats}`)
console.log(`   Total loops: ${existingOrg.totalLoops}`)
console.log(`\n📝 Next steps:`)
console.log(`   1. Run: npm run create-previews`)
console.log(`   2. Run: npm run create-zips`)
console.log(`   3. Run: node scripts/generate-beat-data.js`)
console.log(`   4. Restart dev server to see new beats\n`)
