#!/usr/bin/env node
/**
 * Syncs accurate file format info from beat-organization.json to beat-data.json
 */
const fs = require('fs')
const path = require('path')

const orgPath = path.join(__dirname, '../beat-organization.json')
const dataPath = path.join(__dirname, '../beat-data.json')

const org = JSON.parse(fs.readFileSync(orgPath, 'utf8'))
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

// Build lookup from organization data
const orgLookup = {}
;[...org.beats, ...org.loops].forEach(item => {
  orgLookup[item.id] = item
})

// Update each beat's fileFormat
data.beats.forEach(beat => {
  const orgItem = orgLookup[beat.id]
  if (orgItem) {
    if (orgItem.isWav && orgItem.isMp3) {
      beat.fileFormat = "MP3 + WAV"
    } else if (orgItem.isWav) {
      beat.fileFormat = "WAV"
    } else if (orgItem.isMp3) {
      beat.fileFormat = "MP3"
    }
    beat.includesWav = orgItem.isWav
  }
})

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))
console.log('✅ Updated beat-data.json with accurate file formats')

