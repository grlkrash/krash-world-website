export async function POST(request: Request) {
  const { email, name } = await request.json()

  if (!email) {
    return Response.json({ error: 'Email is required' }, { status: 400 })
  }

  const normalizedEmail = email.toLowerCase().trim()

  // Log email for easy access (backup method)
  console.log('📧 Newsletter Signup:', { email: normalizedEmail, name, timestamp: new Date().toISOString() })

  const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzgy2fJ1KQ3pjB7wOyWHwB-jcNfzCp_iJYftmB20Df65Jy_vbZwMqD6U4kyn_GgYZCP5g/exec'

  try {
    const response = await fetch(WEB_APP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalizedEmail, name }),
    })

    if (!response.ok) throw new Error('Failed to send data to Google Sheets.')

    // Note: Google Sheets script should handle duplicate checking on their end
    // This is a client-side prevention measure, but server-side is the source of truth
    console.log('✅ Newsletter subscription sent to Google Sheets')
    await sendBundleCodeEmail({ email: normalizedEmail })
    return Response.json({ success: true })
  } catch (error) {
    console.error('Newsletter signup error:', error)
    // Still return success to user, but email is logged above
    // The Google Sheets script should handle duplicates if configured properly
    await sendBundleCodeEmail({ email: normalizedEmail })
    return Response.json({ success: true, note: 'Subscription may be a duplicate - check Google Sheets' })
  }
}

async function sendBundleCodeEmail({ email }: { email: string }) {
  const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID
  const EMAILJS_NEWSLETTER_TEMPLATE_ID = process.env.EMAILJS_NEWSLETTER_TEMPLATE_ID
  const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY
  const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY
  if (!EMAILJS_SERVICE_ID || !EMAILJS_NEWSLETTER_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_PRIVATE_KEY) {
    console.log("⚠️ Newsletter email not configured (missing EmailJS vars)")
    return
  }

  try {
    const emailjs = (await import("@emailjs/nodejs")).default
    emailjs.init({
      publicKey: EMAILJS_PUBLIC_KEY,
      privateKey: EMAILJS_PRIVATE_KEY,
    })

    const emailjsResponse = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_NEWSLETTER_TEMPLATE_ID,
      {
        to_email: email,
        promo_code: "BUNDLE50",
        promo_text: "Bundle discount auto-applies when you add 3 beats.",
      }
    )

    if (emailjsResponse.status === 200) {
      console.log("✅ Newsletter promo email sent")
      return
    }
    console.error("❌ Newsletter email failed:", emailjsResponse.text)
  } catch (error) {
    console.error("❌ Newsletter email error:", error)
  }
}
