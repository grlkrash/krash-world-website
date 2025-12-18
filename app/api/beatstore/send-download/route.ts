import { storeTransaction } from "@/app/services/beatstore/transaction-store"

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

    // Option 1: Use EmailJS (free service)
    // You'll need to set up EmailJS at https://www.emailjs.com/
    const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID
    const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID
    const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY

    if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
      try {
        console.log("📧 Attempting EmailJS send...")
        const emailjsResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            service_id: EMAILJS_SERVICE_ID,
            template_id: EMAILJS_TEMPLATE_ID,
            user_id: EMAILJS_PUBLIC_KEY,
            template_params: {
              to_email: email,
              beat_title: beatTitle || "Your Beat",
              download_link: secureDownloadUrl,
              transaction_id: transactionId,
            },
          }),
        })

        const emailjsBody = await emailjsResponse.text()
        console.log(`📧 EmailJS response: ${emailjsResponse.status} ${emailjsResponse.statusText}`)
        console.log(`📧 EmailJS body:`, emailjsBody)

        if (emailjsResponse.ok) {
          console.log("✅ EmailJS email sent successfully")
          return Response.json({ success: true, method: "emailjs" })
        } else {
          console.error("❌ EmailJS failed:", emailjsBody)
        }
      } catch (error) {
        console.error("❌ EmailJS error:", error)
      }
    } else {
      console.log("⚠️ EmailJS not configured (missing env vars)")
    }

    // Option 2: Use SendGrid (if configured)
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
    const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || "noreply@krash.world"

    if (SENDGRID_API_KEY) {
      try {
        console.log("📧 Attempting SendGrid send...")
        const sendgridResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${SENDGRID_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            personalizations: [
              {
                to: [{ email }],
                subject: `Your ${beatTitle || "Beat"} Download - KRASH WORLD`,
              },
            ],
            from: { email: SENDGRID_FROM_EMAIL },
            content: [
              {
                type: "text/html",
                value: `
                  <html>
                    <body style="font-family: Arial, sans-serif; background: #000; color: #fff; padding: 20px;">
                      <div style="max-width: 600px; margin: 0 auto; background: #111; padding: 30px; border-radius: 10px; border: 1px solid #ffda0f;">
                        <h1 style="color: #ffda0f; font-size: 24px; margin-bottom: 20px;">THANK YOU FOR YOUR PURCHASE!</h1>
                        <p style="color: #fff; line-height: 1.6;">Your beat <strong>${beatTitle || "Beat"}</strong> is ready for download.</p>
                        <div style="margin: 30px 0;">
                          <a href="${secureDownloadUrl}" style="display: inline-block; background: #ffda0f; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">DOWNLOAD BEAT</a>
                        </div>
                        <p style="color: #999; font-size: 12px; margin-top: 30px;">Transaction ID: ${transactionId}</p>
                        <p style="color: #999; font-size: 12px;">KRASH WORLD © 2024</p>
                      </div>
                    </body>
                  </html>
                `,
              },
            ],
          }),
        })

        const sendgridBody = await sendgridResponse.text()
        console.log(`📧 SendGrid response: ${sendgridResponse.status} ${sendgridResponse.statusText}`)
        if (sendgridBody) console.log(`📧 SendGrid body:`, sendgridBody)

        if (sendgridResponse.ok) {
          console.log("✅ SendGrid email sent successfully")
          return Response.json({ success: true, method: "sendgrid" })
        } else {
          console.error("❌ SendGrid failed:", sendgridBody)
        }
      } catch (error) {
        console.error("❌ SendGrid error:", error)
      }
    } else {
      console.log("⚠️ SendGrid not configured (missing SENDGRID_API_KEY)")
    }

    // Option 3: Use Google Sheets (like newsletter) as fallback
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
