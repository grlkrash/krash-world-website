#!/usr/bin/env node

/**
 * Test email sending to verify configuration
 */

const testEmail = process.argv[2] || 'grlkrashwrld@gmail.com'
const testTransactionId = 'TEST-' + Date.now()
const testBeatId = 'template-1'
const testBeatTitle = 'CLEAN STOCK 2'

console.log('\n🧪 Testing Email Sending...\n')
console.log(`   To: ${testEmail}`)
console.log(`   Beat: ${testBeatTitle}`)
console.log(`   Transaction ID: ${testTransactionId}\n`)

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.krash.world'
const secureDownloadUrl = `${baseUrl}/download/${testTransactionId}`

// Check EmailJS
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY

console.log('📧 EmailJS Configuration:')
console.log(`   Service ID: ${EMAILJS_SERVICE_ID ? '✅ Set' : '❌ Missing'}`)
console.log(`   Template ID: ${EMAILJS_TEMPLATE_ID ? '✅ Set' : '❌ Missing'}`)
console.log(`   Public Key: ${EMAILJS_PUBLIC_KEY ? '✅ Set' : '❌ Missing'}`)

if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
  console.log('\n📤 Attempting EmailJS send...')
  
  fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        to_email: testEmail,
        beat_title: testBeatTitle,
        download_link: secureDownloadUrl,
        transaction_id: testTransactionId,
      },
    }),
  })
    .then(async (response) => {
      const body = await response.text()
      console.log(`\n📧 EmailJS Response: ${response.status} ${response.statusText}`)
      console.log(`   Body: ${body}`)
      
      if (response.ok) {
        console.log('\n✅ Email sent successfully via EmailJS!')
        console.log(`   Check ${testEmail} inbox (and spam folder)`)
      } else {
        console.log('\n❌ EmailJS failed')
        console.log(`   Error: ${body}`)
      }
    })
    .catch((error) => {
      console.error('\n❌ EmailJS error:', error.message)
    })
} else {
  console.log('\n⚠️  EmailJS not fully configured')
}

// Check SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || "noreply@krash.world"

console.log('\n📧 SendGrid Configuration:')
console.log(`   API Key: ${SENDGRID_API_KEY ? '✅ Set' : '❌ Missing'}`)
console.log(`   From Email: ${SENDGRID_FROM_EMAIL}`)

if (SENDGRID_API_KEY) {
  console.log('\n📤 Attempting SendGrid send...')
  
  fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: testEmail }],
          subject: `Test: Your ${testBeatTitle} Download - KRASH WORLD`,
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
                  <h1 style="color: #ffda0f; font-size: 24px; margin-bottom: 20px;">TEST EMAIL - THANK YOU FOR YOUR PURCHASE!</h1>
                  <p style="color: #fff; line-height: 1.6;">This is a test email for beat <strong>${testBeatTitle}</strong>.</p>
                  <div style="margin: 30px 0;">
                    <a href="${secureDownloadUrl}" style="display: inline-block; background: #ffda0f; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">DOWNLOAD BEAT</a>
                  </div>
                  <p style="color: #999; font-size: 12px; margin-top: 30px;">Transaction ID: ${testTransactionId}</p>
                  <p style="color: #999; font-size: 12px;">KRASH WORLD © 2024</p>
                </div>
              </body>
            </html>
          `,
        },
      ],
    }),
  })
    .then(async (response) => {
      const body = await response.text()
      console.log(`\n📧 SendGrid Response: ${response.status} ${response.statusText}`)
      if (body) console.log(`   Body: ${body}`)
      
      if (response.ok) {
        console.log('\n✅ Email sent successfully via SendGrid!')
        console.log(`   Check ${testEmail} inbox (and spam folder)`)
      } else {
        console.log('\n❌ SendGrid failed')
        console.log(`   Error: ${body}`)
      }
    })
    .catch((error) => {
      console.error('\n❌ SendGrid error:', error.message)
    })
} else {
  console.log('\n⚠️  SendGrid not configured')
}

// Check Google Sheets
const GOOGLE_SHEETS_WEBHOOK = process.env.GOOGLE_SHEETS_BEATSTORE_WEBHOOK

console.log('\n📧 Google Sheets Webhook:')
console.log(`   Webhook URL: ${GOOGLE_SHEETS_WEBHOOK ? '✅ Set' : '❌ Missing'}`)

if (GOOGLE_SHEETS_WEBHOOK) {
  console.log('\n📤 Attempting Google Sheets webhook...')
  
  fetch(GOOGLE_SHEETS_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testEmail,
      beatId: testBeatId,
      beatTitle: testBeatTitle,
      downloadUrl: secureDownloadUrl,
      transactionId: testTransactionId,
      timestamp: new Date().toISOString(),
    }),
  })
    .then(async (response) => {
      const body = await response.text()
      console.log(`\n📧 Google Sheets Response: ${response.status} ${response.statusText}`)
      if (body) console.log(`   Body: ${body}`)
      
      if (response.ok) {
        console.log('\n✅ Google Sheets webhook called successfully!')
        console.log('   (This logs the purchase - may not send email directly)')
      } else {
        console.log('\n❌ Google Sheets webhook failed')
        console.log(`   Error: ${body}`)
      }
    })
    .catch((error) => {
      console.error('\n❌ Google Sheets error:', error.message)
    })
} else {
  console.log('\n⚠️  Google Sheets webhook not configured')
}

console.log('\n⏳ Waiting for responses...\n')
console.log('💡 Note: This script tests email sending. Check your inbox and spam folder!')
