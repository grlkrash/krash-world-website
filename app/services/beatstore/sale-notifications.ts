// Sale notification service - sends alerts when beats are sold
// Supports Discord, Slack, and admin email notifications

export interface SaleNotification {
  beatTitle: string
  beatId: string
  amount: number
  customerEmail: string
  transactionId: string
  isBundle: boolean
  bundleSize?: number
  timestamp: string
}

// Send Discord webhook notification
async function sendDiscordNotification(sale: SaleNotification): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_SALES_WEBHOOK_URL
  if (!webhookUrl) return false

  try {
    const maskedEmail = sale.customerEmail.substring(0, 3) + "***@" + sale.customerEmail.split("@")[1]
    
    const embed = {
      title: "🎵 NEW BEAT SALE!",
      color: 0x00ff88, // Green
      fields: [
        { name: "Beat", value: sale.beatTitle, inline: true },
        { name: "Amount", value: `$${sale.amount}`, inline: true },
        { name: "Customer", value: maskedEmail, inline: true },
        { name: "Transaction ID", value: sale.transactionId.substring(0, 20) + "...", inline: false },
      ],
      footer: {
        text: sale.isBundle ? `🎁 Bundle purchase (${sale.bundleSize} beats)` : "Single purchase",
      },
      timestamp: sale.timestamp,
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "KRASH Sales Bot",
        avatar_url: "https://www.krash.world/images/krash-logo.png",
        embeds: [embed],
      }),
    })

    if (response.ok) {
      console.log("✅ Discord notification sent")
      return true
    } else {
      console.error("❌ Discord webhook failed:", response.status, await response.text())
      return false
    }
  } catch (error) {
    console.error("❌ Discord notification error:", error)
    return false
  }
}

// Send Slack webhook notification
async function sendSlackNotification(sale: SaleNotification): Promise<boolean> {
  const webhookUrl = process.env.SLACK_SALES_WEBHOOK_URL
  if (!webhookUrl) return false

  try {
    const maskedEmail = sale.customerEmail.substring(0, 3) + "***@" + sale.customerEmail.split("@")[1]
    
    const message = {
      blocks: [
        {
          type: "header",
          text: { type: "plain_text", text: "🎵 NEW BEAT SALE!", emoji: true },
        },
        {
          type: "section",
          fields: [
            { type: "mrkdwn", text: `*Beat:*\n${sale.beatTitle}` },
            { type: "mrkdwn", text: `*Amount:*\n$${sale.amount}` },
            { type: "mrkdwn", text: `*Customer:*\n${maskedEmail}` },
            { type: "mrkdwn", text: `*Type:*\n${sale.isBundle ? "Bundle" : "Single"}` },
          ],
        },
        {
          type: "context",
          elements: [
            { type: "mrkdwn", text: `Transaction: ${sale.transactionId.substring(0, 20)}... | ${sale.timestamp}` },
          ],
        },
      ],
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    })

    if (response.ok) {
      console.log("✅ Slack notification sent")
      return true
    } else {
      console.error("❌ Slack webhook failed:", response.status)
      return false
    }
  } catch (error) {
    console.error("❌ Slack notification error:", error)
    return false
  }
}

// Send admin email notification (using existing EmailJS setup)
async function sendAdminEmailNotification(sale: SaleNotification): Promise<boolean> {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL
  const googleWebhook = process.env.GOOGLE_SHEETS_SALES_NOTIFICATION_WEBHOOK
  
  if (!adminEmail && !googleWebhook) return false

  // Use Google Apps Script to send admin email (simpler than EmailJS for this)
  if (googleWebhook) {
    try {
      const response = await fetch(googleWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "sale_notification",
          adminEmail,
          ...sale,
        }),
      })

      if (response.ok) {
        console.log("✅ Admin email notification sent via Google Apps Script")
        return true
      }
    } catch (error) {
      console.error("❌ Admin email notification error:", error)
    }
  }

  return false
}

// Main notification function - sends to all configured channels
export async function notifySale(sale: SaleNotification): Promise<{
  discord: boolean
  slack: boolean
  email: boolean
}> {
  console.log("📢 Sending sale notifications for:", sale.beatTitle)

  // Send notifications in parallel
  const [discord, slack, email] = await Promise.all([
    sendDiscordNotification(sale),
    sendSlackNotification(sale),
    sendAdminEmailNotification(sale),
  ])

  const results = { discord, slack, email }
  
  const configured = [
    process.env.DISCORD_SALES_WEBHOOK_URL && "Discord",
    process.env.SLACK_SALES_WEBHOOK_URL && "Slack",
    (process.env.ADMIN_NOTIFICATION_EMAIL || process.env.GOOGLE_SHEETS_SALES_NOTIFICATION_WEBHOOK) && "Email",
  ].filter(Boolean)

  if (configured.length === 0) {
    console.warn("⚠️ No notification channels configured. Set DISCORD_SALES_WEBHOOK_URL, SLACK_SALES_WEBHOOK_URL, or ADMIN_NOTIFICATION_EMAIL")
  } else {
    console.log(`📢 Notification results:`, results)
  }

  return results
}

// Log sale to Google Sheets (for spreadsheet tracking)
export async function logSaleToGoogleSheets(sale: SaleNotification): Promise<boolean> {
  const webhookUrl = process.env.GOOGLE_SHEETS_SALES_LOG_WEBHOOK
  if (!webhookUrl) {
    console.log("ℹ️ Google Sheets sales log not configured (optional)")
    return false
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: sale.timestamp,
        beatTitle: sale.beatTitle,
        beatId: sale.beatId,
        amount: sale.amount,
        email: sale.customerEmail,
        transactionId: sale.transactionId,
        isBundle: sale.isBundle ? "Yes" : "No",
        bundleSize: sale.bundleSize || 1,
      }),
    })

    if (response.ok) {
      console.log("✅ Sale logged to Google Sheets")
      return true
    }
    return false
  } catch (error) {
    console.error("❌ Google Sheets log error:", error)
    return false
  }
}
