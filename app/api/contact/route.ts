export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !subject || !message) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Log contact form submission
    console.log("📧 Contact Form Submission:", {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
    })

    // Option 1: Use Google Sheets (like newsletter)
    const GOOGLE_SHEETS_CONTACT_WEBHOOK = process.env.GOOGLE_SHEETS_CONTACT_WEBHOOK

    if (GOOGLE_SHEETS_CONTACT_WEBHOOK) {
      try {
        const sheetsResponse = await fetch(GOOGLE_SHEETS_CONTACT_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            subject,
            message,
            timestamp: new Date().toISOString(),
          }),
        })

        if (sheetsResponse.ok) {
          return Response.json({ success: true, method: "google-sheets" })
        }
      } catch (error) {
        console.error("Google Sheets error:", error)
      }
    }

    // If no email service is configured, still return success
    // The submission is logged above, and you can check logs
    return Response.json({
      success: true,
      method: "manual",
      message: "Contact form submitted. Please check logs.",
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
