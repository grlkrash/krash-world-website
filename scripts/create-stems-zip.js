#!/usr/bin/env node

/**
 * Creates a ZIP file containing the main WAV + stems folder for a beat
 * 
 * Usage:
 *   node scripts/create-stems-zip.js <beat-id> <main-wav-path> <stems-folder-path>
 * 
 * Example:
 *   node scripts/create-stems-zip.js beat-75 ~/Downloads/BUBBLEGUMJERK.wav ~/Downloads/BUBBLEGUMJERK-stems/
 * 
 * This will create: public/downloads/beat-75.zip containing:
 *   - BUBBLEGUMJERK.wav (main stereo bounce)
 *   - stems/
 *     - drums.wav
 *     - bass.wav
 *     - synths.wav
 *     - etc...
 */

const fs = require('fs')
const path = require('path')

// Check for adm-zip
let AdmZip
try {
  AdmZip = require('adm-zip')
} catch {
  console.error('❌ adm-zip package not found.')
  console.error('\nInstall with: npm install adm-zip --save-dev --legacy-peer-deps')
  process.exit(1)
}

const DOWNLOADS_DIR = path.join(__dirname, '../public/downloads')

function createStemsZip(beatId, mainWavPath, stemsFolderPath) {
  console.log('\n📦 Creating stems ZIP package...\n')
  console.log(`   Beat ID: ${beatId}`)
  console.log(`   Main WAV: ${mainWavPath}`)
  console.log(`   Stems folder: ${stemsFolderPath}`)
  
  // Validate inputs
  if (!fs.existsSync(mainWavPath)) {
    console.error(`\n❌ Main WAV file not found: ${mainWavPath}`)
    process.exit(1)
  }
  
  if (!fs.existsSync(stemsFolderPath)) {
    console.error(`\n❌ Stems folder not found: ${stemsFolderPath}`)
    process.exit(1)
  }
  
  const stats = fs.statSync(stemsFolderPath)
  if (!stats.isDirectory()) {
    console.error(`\n❌ Stems path is not a directory: ${stemsFolderPath}`)
    process.exit(1)
  }
  
  // Get stem files
  const stemFiles = fs.readdirSync(stemsFolderPath)
    .filter(f => f.endsWith('.wav') || f.endsWith('.mp3') || f.endsWith('.aif') || f.endsWith('.aiff'))
  
  if (stemFiles.length === 0) {
    console.error('\n❌ No audio files found in stems folder!')
    console.error('   Looking for: .wav, .mp3, .aif, .aiff files')
    process.exit(1)
  }
  
  console.log(`\n   Found ${stemFiles.length} stem files:`)
  stemFiles.forEach(f => console.log(`     - ${f}`))
  
  // Create ZIP
  const zip = new AdmZip()
  
  // Add main WAV file at root
  const mainFileName = path.basename(mainWavPath)
  console.log(`\n   Adding main file: ${mainFileName}`)
  zip.addLocalFile(mainWavPath)
  
  // Add stems in a "stems" subfolder
  console.log('   Adding stems folder...')
  stemFiles.forEach(stemFile => {
    const stemPath = path.join(stemsFolderPath, stemFile)
    zip.addLocalFile(stemPath, 'stems')
    console.log(`     + stems/${stemFile}`)
  })
  
  // Write ZIP
  const outputPath = path.join(DOWNLOADS_DIR, `${beatId}.zip`)
  
  // Backup existing zip if present
  if (fs.existsSync(outputPath)) {
    const backupPath = path.join(DOWNLOADS_DIR, `${beatId}-backup-${Date.now()}.zip`)
    fs.renameSync(outputPath, backupPath)
    console.log(`\n   📋 Backed up existing ZIP to: ${path.basename(backupPath)}`)
  }
  
  zip.writeZip(outputPath)
  
  const zipStats = fs.statSync(outputPath)
  const sizeMB = (zipStats.size / 1024 / 1024).toFixed(2)
  
  console.log(`\n✅ Created: ${outputPath}`)
  console.log(`   Size: ${sizeMB} MB`)
  console.log(`\n   Contents:`)
  console.log(`     - ${mainFileName}`)
  console.log(`     - stems/ (${stemFiles.length} files)`)
  
  console.log(`
====================================
NEXT STEPS:
====================================

1. Update beat-data.json for ${beatId}:
   - Set "includesStems": true
   - Set "fileFormat": "WAV + Stems"

2. Upload the ZIP to S3:
   node scripts/upload-zips-to-s3.js
   
   OR upload just this file:
   aws s3 cp "public/downloads/${beatId}.zip" "s3://krash-beatstore-aws/downloads/${beatId}.zip" --region us-east-2

3. Commit changes:
   git add beat-data.json public/downloads/${beatId}.zip
   git commit -m "Add stems for ${beatId}"
   git push
`)
}

// Parse CLI args
const args = process.argv.slice(2)

if (args.length < 3) {
  console.log(`
📦 Create Stems ZIP Package

Usage:
  node scripts/create-stems-zip.js <beat-id> <main-wav-path> <stems-folder-path>

Example:
  node scripts/create-stems-zip.js beat-75 ~/Downloads/BUBBLEGUMJERK.wav ~/Downloads/BUBBLEGUMJERK-stems/

This creates a ZIP at public/downloads/<beat-id>.zip containing:
  - The main WAV file (stereo bounce)
  - stems/ folder with individual stem files
`)
  process.exit(0)
}

const [beatId, mainWavPath, stemsFolderPath] = args

// Expand ~ in paths
const expandPath = p => p.replace(/^~/, process.env.HOME)

createStemsZip(beatId, expandPath(mainWavPath), expandPath(stemsFolderPath))

