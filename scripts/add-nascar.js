#!/usr/bin/env node
// Add NASCAR: creates preview, zip, mp3, wav in public/. Then run upload-to-s3.js + upload-zips-to-s3.js
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
let AdmZip; try { AdmZip = require('adm-zip') } catch { console.error('npm install adm-zip --save-dev'); process.exit(1) }

const HOME = process.env.HOME
const MP3 = path.join(HOME, 'Downloads', 'NASCAR (120BPM) CSHARP MIN.mp3')
const WAV = path.join(HOME, 'Downloads', 'NASCAR (120BPM) CSHARP MIN.wav')
const STEMS = path.join(HOME, 'Downloads', 'NASCAR STEMS 120BPM CSHARPMIN .zip')
const ID = 'beat-nascar'
const DL = path.join(__dirname, '../public/downloads')
const BT = path.join(__dirname, '../public/beats')

;[MP3, WAV, STEMS].forEach((f) => { if (!fs.existsSync(f)) { console.error('❌ Missing:', f); process.exit(1) } })
fs.mkdirSync(BT, { recursive: true })
fs.mkdirSync(DL, { recursive: true })

try { execSync(`ffmpeg -i "${MP3}" -t 30 -b:a 128k -y "${path.join(BT, ID + '-preview.mp3')}"`, { stdio: 'ignore' }) }
catch { fs.copyFileSync(MP3, path.join(BT, ID + '-preview.mp3')) }

const zip = new AdmZip()
zip.addLocalFile(MP3)
zip.addLocalFile(WAV)
new AdmZip(STEMS).getEntries().forEach((e) => {
  if (!e.isDirectory && /\.(wav|mp3|aif|aiff)$/i.test(e.entryName)) zip.addFile('stems/' + path.basename(e.entryName), e.getData())
})
zip.writeZip(path.join(DL, ID + '.zip'))
fs.copyFileSync(MP3, path.join(DL, ID + '.mp3'))
fs.copyFileSync(WAV, path.join(DL, ID + '.wav'))
console.log('✅ Done. Run: node scripts/upload-to-s3.js && node scripts/upload-zips-to-s3.js')
