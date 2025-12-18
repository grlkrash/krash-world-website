import { storeTransaction } from "@/app/services/beatstore/transaction-store"
import emailjs from "@emailjs/nodejs"

export async function POST(request: Request) {
  try {
    const { email, beatId, beatTitle, downloadUrl, transactionId, optInNewsletter } = await request.json()

    if (!email || !beatId || !transactionId) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Store transaction for download verification
    storeTransaction(transactionId, beatId, email, beatTitle || "Beat", 48) // 48 hour expiry

    // Generate secure download link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
    const secureDownloadUrl = `${baseUrl}/download/${transactionId}`

    // Log the purchase for easy access (backup method)
    console.log("🎵 Beat Purchase:", {
      email,
      beatId,
      beatTitle,
      transactionId,
      timestamp: new Date().toISOString(),
      downloadUrl: secureDownloadUrl,
      optInNewsletter,
    })

    // Add to newsletter if opted in
    if (optInNewsletter && email) {
      try {
        const normalizedEmail = email.toLowerCase().trim()
        // Call newsletter API using the same Google Sheets webhook
        const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzgy2fJ1KQ3pjB7wOyWHwB-jcNfzCp_iJYftmB20Df65Jy_vbZwMqD6U4kyn_GgYZCP5g/exec'
        const newsletterResponse = await fetch(WEB_APP_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: normalizedEmail, 
            name: normalizedEmail.split("@")[0] || "Customer" 
          }),
        })
        if (newsletterResponse.ok) {
          console.log("✅ Added to newsletter:", normalizedEmail)
        } else {
          console.warn("⚠️ Newsletter signup may have failed or email may be duplicate:", normalizedEmail)
        }
      } catch (error) {
        console.error("Newsletter signup error:", error)
        // Don't fail the purchase if newsletter signup fails
      }
    } else if (optInNewsletter && !email) {
      console.warn("⚠️ Newsletter opt-in was checked but no email provided")
    }

    // Option 1: Use EmailJS (server-side email service)
    const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID
    const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID
    const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY
    const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY

    if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY && EMAILJS_PRIVATE_KEY) {
      try {
        console.log("📧 Attempting EmailJS send...")
        
        // Initialize EmailJS with public and private keys
        emailjs.init({
          publicKey: EMAILJS_PUBLIC_KEY,
          privateKey: EMAILJS_PRIVATE_KEY,
        })

        // Send email using EmailJS
        const emailjsResponse = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            to_email: email,
            beat_title: beatTitle || "Beat",
            download_link: secureDownloadUrl,
            transaction_id: transactionId,
          }
        )

        console.log(`📧 EmailJS response: ${emailjsResponse.status} ${emailjsResponse.text}`)
        
        if (emailjsResponse.status === 200) {
          console.log("✅ EmailJS email sent successfully")
          return Response.json({ success: true, method: "emailjs" })
        } else {
          console.error("❌ EmailJS failed:", emailjsResponse.text)
        }
      } catch (error) {
        console.error("❌ EmailJS error:", error)
        const errorMessage = error instanceof Error ? error.message : String(error)
        if (errorMessage.includes("non-browser")) {
          console.error("⚠️ EmailJS API for non-browser applications is disabled. Enable it in EmailJS dashboard: Account → Security → Allow EmailJS API for non-browser applications")
        }
      }
    } else {
      const missingVars = []
      if (!EMAILJS_SERVICE_ID) missingVars.push("EMAILJS_SERVICE_ID")
      if (!EMAILJS_TEMPLATE_ID) missingVars.push("EMAILJS_TEMPLATE_ID")
      if (!EMAILJS_PUBLIC_KEY) missingVars.push("EMAILJS_PUBLIC_KEY")
      if (!EMAILJS_PRIVATE_KEY) missingVars.push("EMAILJS_PRIVATE_KEY")
      console.log(`⚠️ EmailJS not configured (missing: ${missingVars.join(", ")})`)
    }

    // Option 2: Use Google Sheets (like newsletter) as fallback
    // You can set up a Google Apps Script to send emails
    const GOOGLE_SHEETS_WEBHOOK = process.env.GOOGLE_SHEETS_BEATSTORE_WEBHOOK

    if (GOOGLE_SHEETS_WEBHOOK) {
      try {
        console.log("📧 Attempting Google Sheets webhook...")
        const sheetsResponse = await fetch(GOOGLE_SHEETS_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            beatId,
            beatTitle,
            downloadUrl: secureDownloadUrl,
            transactionId,
            timestamp: new Date().toISOString(),
          }),
        })

        const sheetsBody = await sheetsResponse.text()
        console.log(`📧 Google Sheets response: ${sheetsResponse.status} ${sheetsResponse.statusText}`)
        if (sheetsBody) console.log(`📧 Google Sheets body:`, sheetsBody)

        if (sheetsResponse.ok) {
          console.log("✅ Google Sheets webhook called successfully")
          return Response.json({ success: true, method: "google-sheets" })
        } else {
          console.error("❌ Google Sheets webhook failed:", sheetsBody)
        }
      } catch (error) {
        console.error("❌ Google Sheets error:", error)
      }
    } else {
      console.log("⚠️ Google Sheets webhook not configured (missing GOOGLE_SHEETS_BEATSTORE_WEBHOOK)")
    }

    // If no email service is configured or all failed, still return success
    // The purchase is logged above, and you can manually send the email
    console.warn("⚠️ No email service succeeded. Purchase logged but email not sent.")
    console.log(`📧 Manual download link: ${secureDownloadUrl}`)
    return Response.json({
      success: true,
      method: "manual",
      message: "Purchase logged. Please send download link manually.",
      downloadUrl: secureDownloadUrl,
    })
  } catch (error) {
    console.error("Send download error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
