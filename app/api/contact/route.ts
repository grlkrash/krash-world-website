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

    // Option 1: Use SendGrid (server-side email service)
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
    const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || "noreply@krash.world"

    if (SENDGRID_API_KEY) {
      try {
        const sendgridResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${SENDGRID_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            personalizations: [
              {
                to: [{ email: "info@krash.world" }],
                subject: `Contact Form: ${subject}`,
              },
            ],
            from: { email: SENDGRID_FROM_EMAIL },
            reply_to: { email: email },
            content: [
              {
                type: "text/html",
                value: `
                  <html>
                    <body style="font-family: Arial, sans-serif; background: #000; color: #fff; padding: 20px;">
                      <div style="max-width: 600px; margin: 0 auto; background: #111; padding: 30px; border-radius: 10px; border: 1px solid #ffda0f;">
                        <h1 style="color: #ffda0f; font-size: 24px; margin-bottom: 20px;">New Contact Form Submission</h1>
                        <p style="color: #fff; line-height: 1.6;"><strong>From:</strong> ${name} (${email})</p>
                        <p style="color: #fff; line-height: 1.6;"><strong>Subject:</strong> ${subject}</p>
                        <div style="margin: 20px 0; padding: 20px; background: #000; border-left: 3px solid #ffda0f;">
                          <p style="color: #fff; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                        </div>
                        <p style="color: #999; font-size: 12px;">KRASH WORLD Contact Form</p>
                      </div>
                    </body>
                  </html>
                `,
              },
            ],
          }),
        })

        if (sendgridResponse.ok) {
          return Response.json({ success: true, method: "sendgrid" })
        }
      } catch (error) {
        console.error("SendGrid error:", error)
      }
    }

    // Option 2: Use Google Sheets (like newsletter)
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

    // Option 3: Use SendGrid (if configured)
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
    const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || "noreply@krash.world"

    if (SENDGRID_API_KEY) {
      try {
        const sendgridResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${SENDGRID_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            personalizations: [
              {
                to: [{ email: "info@krash.world" }],
                subject: `Contact Form: ${subject}`,
              },
            ],
            from: { email: SENDGRID_FROM_EMAIL },
            reply_to: { email: email },
            content: [
              {
                type: "text/html",
                value: `
                  <html>
                    <body style="font-family: Arial, sans-serif; background: #000; color: #fff; padding: 20px;">
                      <div style="max-width: 600px; margin: 0 auto; background: #111; padding: 30px; border-radius: 10px; border: 1px solid #ffda0f;">
                        <h1 style="color: #ffda0f; font-size: 24px; margin-bottom: 20px;">New Contact Form Submission</h1>
                        <p style="color: #fff; line-height: 1.6;"><strong>From:</strong> ${name} (${email})</p>
                        <p style="color: #fff; line-height: 1.6;"><strong>Subject:</strong> ${subject}</p>
                        <div style="margin: 20px 0; padding: 20px; background: #000; border-left: 3px solid #ffda0f;">
                          <p style="color: #fff; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                        </div>
                        <p style="color: #999; font-size: 12px;">KRASH WORLD Contact Form</p>
                      </div>
                    </body>
                  </html>
                `,
              },
            ],
          }),
        })

        if (sendgridResponse.ok) {
          return Response.json({ success: true, method: "sendgrid" })
        }
      } catch (error) {
        console.error("SendGrid error:", error)
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
