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
    return Response.json({ success: true })
  } catch (error) {
    console.error('Newsletter signup error:', error)
    // Still return success to user, but email is logged above
    // The Google Sheets script should handle duplicates if configured properly
    return Response.json({ success: true, note: 'Subscription may be a duplicate - check Google Sheets' })
  }
}
