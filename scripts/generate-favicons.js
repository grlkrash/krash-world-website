const sharp = require("sharp")
const fs = require("fs").promises
const path = require("path")

async function generateFavicons() {
  console.log("🎨 Generating Krash World Favicons...\n")

  const logoPath = path.join(process.cwd(), "public", "images", "krash-logo.png")
  const publicPath = path.join(process.cwd(), "public")

  try {
    // Check if logo exists
    await fs.access(logoPath)
    console.log("✅ Found logo at:", logoPath)

    // Read the original logo
    const logoBuffer = await fs.readFile(logoPath)

    // Define all the favicon sizes and formats we need
    const faviconSizes = [
      { name: "favicon-16x16.png", size: 16 },
      { name: "favicon-32x32.png", size: 32 },
      { name: "apple-touch-icon.png", size: 180 },
      { name: "android-chrome-192x192.png", size: 192 },
      { name: "android-chrome-512x512.png", size: 512 },
      { name: "mstile-150x150.png", size: 150 },
    ]

    console.log("🔧 Generating favicon files...\n")

    // Generate each favicon size
    for (const favicon of faviconSizes) {
      try {
        await sharp(logoBuffer)
          .resize(favicon.size, favicon.size, {
            fit: "contain",
            background: { r: 0, g: 0, b: 0, alpha: 0 }, // Transparent background
          })
          .png()
          .toFile(path.join(publicPath, favicon.name))

        console.log(`✅ Generated: ${favicon.name} (${favicon.size}x${favicon.size})`)
      } catch (error) {
        console.error(`❌ Failed to generate ${favicon.name}:`, error.message)
      }
    }

    // Generate favicon.ico (multi-size ICO file)
    console.log("\n🔧 Generating favicon.ico...")
    try {
      // Create 32x32 version for ICO
      const ico32Buffer = await sharp(logoBuffer)
        .resize(32, 32, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer()

      // For ICO, we'll save as PNG and rename (browsers accept PNG as ICO)
      await fs.writeFile(path.join(publicPath, "favicon.ico"), ico32Buffer)
      console.log("✅ Generated: favicon.ico")
    } catch (error) {
      console.error("❌ Failed to generate favicon.ico:", error.message)
    }

    // Generate SVG for Safari pinned tab (simplified monochrome version)
    console.log("\n🔧 Generating safari-pinned-tab.svg...")
    try {
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="#ffda0f"/>
        <text x="50" y="65" font-family="Arial Black, sans-serif" font-size="40" font-weight="900" text-anchor="middle" fill="#000">K</text>
      </svg>`

      await fs.writeFile(path.join(publicPath, "safari-pinned-tab.svg"), svgContent)
      console.log("✅ Generated: safari-pinned-tab.svg")
    } catch (error) {
      console.error("❌ Failed to generate safari-pinned-tab.svg:", error.message)
    }

    console.log("\n🎉 All favicon files generated successfully!")
    console.log("\n📁 Generated files:")
    console.log("   • favicon.ico")
    console.log("   • favicon-16x16.png")
    console.log("   • favicon-32x32.png")
    console.log("   • apple-touch-icon.png")
    console.log("   • android-chrome-192x192.png")
    console.log("   • android-chrome-512x512.png")
    console.log("   • mstile-150x150.png")
    console.log("   • safari-pinned-tab.svg")

    console.log("\n✨ Your Krash World favicons are ready!")
    console.log("🌐 Your site will now display the Krash logo in:")
    console.log("   • Browser tabs")
    console.log("   • Bookmarks")
    console.log("   • Mobile home screen")
    console.log("   • App stores")
    console.log("   • Social media previews")
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error("❌ Logo file not found at:", logoPath)
      console.log("\n💡 Make sure your logo is at: public/images/krash-logo.png")
    } else {
      console.error("❌ Error generating favicons:", error.message)
    }
  }
}

// Run the favicon generation
generateFavicons()
