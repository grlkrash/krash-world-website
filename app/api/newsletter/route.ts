export async function POST(request: Request) {
  try {
    const { email, name } = await request.json()

    // Here you would integrate with your Google Sheets
    // For now, we'll just log the data
    console.log("Newsletter signup:", { email, name, timestamp: new Date().toISOString() })

    // You can use Google Sheets API or a service like Zapier to connect to your spreadsheet
    // Example with Google Sheets API:
    /*
    const sheets = google.sheets({ version: 'v4', auth: googleAuth })
    await sheets.spreadsheets.values.append({
      spreadsheetId: 'YOUR_SPREADSHEET_ID',
      range: 'Sheet1!A:D',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[new Date().toISOString(), email, name || 'Anonymous', 'Website']]
      }
    })
    */

    return Response.json({ success: true })
  } catch (error) {
    console.error("Newsletter signup error:", error)
    return Response.json({ success: false }, { status: 500 })
  }
}
