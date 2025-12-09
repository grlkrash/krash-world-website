export async function POST(request: Request) {
  const { email, name } = await request.json()

  // Log email for easy access (backup method)
  console.log('📧 Newsletter Signup:', { email, name, timestamp: new Date().toISOString() })

  const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzgy2fJ1KQ3pjB7wOyWHwB-jcNfzCp_iJYftmB20Df65Jy_vbZwMqD6U4kyn_GgYZCP5g/exec'

  try {
    const response = await fetch(WEB_APP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name }),
    })

    if (!response.ok) throw new Error('Failed to send data to Google Sheets.')

    return Response.json({ success: true })
  } catch (error) {
    console.error('Newsletter signup error:', error)
    // Still return success to user, but email is logged above
    return Response.json({ success: true })
  }
}
