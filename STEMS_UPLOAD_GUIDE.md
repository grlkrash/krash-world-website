# Adding Stems to a Beat

This guide explains how to add stems (individual track files) to a beat for download.

## Prerequisites

1. **Main WAV file** - The full stereo bounce of the beat
2. **Stems folder** - A folder containing individual WAV/MP3 files for each track (drums, bass, synths, etc.)

## Step-by-Step Process

### Step 1: Prepare Your Stems

Organize your stems in a folder. Example structure:
```
~/Downloads/BUBBLEGUMJERK-stems/
├── drums.wav
├── bass.wav
├── synths.wav
├── keys.wav
├── fx.wav
└── vox.wav
```

**Tips:**
- Use descriptive filenames (drums, bass, melody, etc.)
- Export all stems at the same sample rate and bit depth as the main file
- WAV format is preferred for quality

### Step 2: Create the Stems ZIP Package

Run the stems packaging script:

```bash
cd /Users/sonia/krashworld-website/krash-world-website

node scripts/create-stems-zip.js <beat-id> <main-wav-path> <stems-folder-path>
```

**Example for BUBBLEGUMJERK (beat-75):**
```bash
node scripts/create-stems-zip.js beat-75 ~/Downloads/BUBBLEGUMJERK.wav ~/Downloads/BUBBLEGUMJERK-stems/
```

This creates `public/downloads/beat-75.zip` containing:
- BUBBLEGUMJERK.wav (main file)
- stems/ folder with all individual tracks

### Step 3: Update beat-data.json

Edit `beat-data.json` and update the beat entry:

```json
{
  "id": "beat-75",
  "title": "BUBBLEGUMJERK",
  "description": "Premium beat with full stems included. Perfect for mixing and remixing.",
  "includesWav": true,
  "includesStems": true,
  "fileFormat": "WAV + Stems",
  ...
}
```

**Key fields to update:**
- `includesStems`: Set to `true`
- `fileFormat`: Update to `"WAV + Stems"`
- `description`: Optionally update to mention stems

### Step 4: Upload to S3

Upload the new ZIP file to S3:

**Option A: Upload all ZIPs**
```bash
node scripts/upload-zips-to-s3.js
```

**Option B: Upload just this beat**
```bash
aws s3 cp "public/downloads/beat-75.zip" "s3://krash-beatstore-aws/downloads/beat-75.zip" --region us-east-2
```

### Step 5: Verify and Commit

1. **Verify the upload:**
```bash
aws s3 ls s3://krash-beatstore-aws/downloads/beat-75.zip
```

2. **Commit your changes:**
```bash
git add beat-data.json public/downloads/beat-75.zip
git commit -m "Add stems for BUBBLEGUMJERK (beat-75)"
git push
```

3. **Test the download** by making a test purchase or using an existing transaction token.

## What Gets Downloaded

When a customer purchases a beat with stems, they receive a ZIP containing:
```
BUBBLEGUMJERK.zip
├── BUBBLEGUMJERK.wav        (main stereo bounce)
└── stems/
    ├── drums.wav
    ├── bass.wav
    ├── synths.wav
    └── ... (other tracks)
```

## UI Display

Beats with stems will show:
- A purple "STEMS" badge next to the format
- "Full Stems Package" listed in the lease terms
- Updated file format showing "WAV + Stems"

## Quick Reference

| Beat | ID | Has Stems |
|------|-----|-----------|
| BUBBLEGUMJERK | beat-75 | ✅ Yes |

---

*Add more beats to this table as you add stems!*

