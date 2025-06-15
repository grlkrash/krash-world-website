export async function POST(request: Request) {
  // 1. Get the email and name from the incoming request.
  const { email, name } = await request.json()

  // 2. Paste your Google Apps Script Web App URL here.
  const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbztZyRAZRn7jXYu1lQK52WrvWTt-rgDyj9yV8hrdRDkxMQ-BMRXIWfC65FrBGohrm5uKw/exec'

  try {
    // 3. Send the data to your Google Apps Script.
    const response = await fetch(WEB_APP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name }),
    })

    // Check if the data was sent successfully.
    if (!response.ok) {
      throw new Error('Failed to send data to Google Sheets.')
    }

    // 4. Return a success response to the user.
    return Response.json({ success: true })
  } catch (error) {
    console.error('Newsletter signup error:', error)
    return Response.json({ success: false }, { status: 500 })
  }
}
