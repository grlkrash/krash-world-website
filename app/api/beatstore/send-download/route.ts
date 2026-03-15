import { storeTransaction } from "@/app/services/beatstore/transaction-store"
import { logSale } from "@/app/services/beatstore/sales-log"
import { notifySale, logSaleToGoogleSheets } from "@/app/services/beatstore/sale-notifications"
import type { LicenseId } from "@/app/services/beatstore/license-config"
import emailjs from "@emailjs/nodejs"
import { readFile } from "fs/promises"
import { join } from "path"

const PRODUCER_CREDIT = "GRLKRASH a/k/a Sonia Gibbs"
const PRODUCER_BMI_IPI = "01057188153"
const SPLIT_TERMS = "Producer 50% / Licensee 50% for publishing, royalties, and distribution"

interface BeatRecord {
  id: string
  price: number
  licensePrices?: { mp3?: number; wav?: number; stems?: number }
}

async function getBeats(): Promise<BeatRecord[]> {
  try {
    const data = JSON.parse(await readFile(join(process.cwd(), "beat-data.json"), "utf8"))
    return data?.beats || []
  } catch {
    return []
  }
}

async function getValidBeatPrices(beatId: string): Promise<number[]> {
  const beats = await getBeats()
  const beat = beats.find((b) => b.id === beatId)
  if (!beat) return []
  const lp = beat.licensePrices
  if (lp) return [lp.mp3, lp.wav, lp.stems].filter((p): p is number => typeof p === "number")
  return typeof beat.price === "number" ? [beat.price] : []
}

async function getBeatPrice(beatId: string): Promise<number | null> {
  const beats = await getBeats()
  const beat = beats.find((b) => b.id === beatId)
  if (!beat) return null
  const lp = beat.licensePrices
  if (lp?.mp3 != null) return lp.mp3
  return typeof beat.price === "number" ? beat.price : null
}

async function getBeatPrices(): Promise<Record<string, number>> {
  const beats = await getBeats()
  const acc: Record<string, number> = {}
  for (const b of beats) {
    if (typeof b?.id !== "string") continue
    const lp = b.licensePrices
    acc[b.id] = lp?.mp3 ?? (typeof b.price === "number" ? b.price : 0)
  }
  return acc
}

async function verifyPayPalPayment({
  orderId,
  expectedBeatId,
  isBundle,
}: {
  orderId: string
  expectedBeatId: string
  isBundle: boolean
}): Promise<{ ok: boolean; amount: number }> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const secret = process.env.PAYPAL_CLIENT_SECRET
  if (!clientId || !secret) {
    console.error("❌ PayPal verification skipped: missing credentials")
    return { ok: false, amount: 0 }
  }
  
  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64")
  const tokenRes = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  })
  if (!tokenRes.ok) return { ok: false, amount: 0 }
  
  const { access_token } = await tokenRes.json()
  const orderRes = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${access_token}` },
  })
  if (!orderRes.ok) return { ok: false, amount: 0 }
  
  const order = await orderRes.json()
  if (order.status !== "COMPLETED") return { ok: false, amount: 0 }

  const purchaseUnit = order.purchase_units?.[0]
  const customId = purchaseUnit?.custom_id || ""
  const customIds = customId.split(",").map((value: string) => value.trim())
  if (!customIds.includes(expectedBeatId)) return { ok: false, amount: 0 }

  const amountValue = Number(purchaseUnit?.amount?.value)
  if (!Number.isFinite(amountValue)) return { ok: false, amount: 0 }
  if (purchaseUnit?.amount?.currency_code && purchaseUnit.amount.currency_code !== "USD") return { ok: false, amount: 0 }
  if (!isBundle) {
    const validPrices = await getValidBeatPrices(expectedBeatId)
    if (validPrices.length === 0) return { ok: false, amount: 0 }
    const amt = Number(amountValue.toFixed(2))
    if (!validPrices.some((p) => Number(p.toFixed(2)) === amt)) return { ok: false, amount: 0 }
    return { ok: true, amount: amountValue }
  }
  const prices = await getBeatPrices()
  const beatPrices = customIds.map((beatId: string) => prices[beatId])
  if (beatPrices.some((p: number) => typeof p !== "number")) return { ok: false, amount: 0 }
  const subtotal = beatPrices.reduce((sum: number, price: number) => sum + price, 0)
  const cheapest = beatPrices.length >= 3 ? Math.min(...beatPrices) : 0
  const expectedTotal = subtotal - cheapest * 0.5
  if (Number(amountValue.toFixed(2)) !== Number(expectedTotal.toFixed(2))) return { ok: false, amount: 0 }
  return { ok: true, amount: amountValue }
}

export async function POST(request: Request) {
  try {
    const {
      email,
      beatId,
      beatTitle,
      downloadUrl,
      transactionId,
      optInNewsletter,
      isBundle,
      bundleDiscount,
      licenseId,
      licenseName,
      licenseTermsVersion,
      buyerName,
      beatPrice: clientBeatPrice,
    }: {
      email?: string
      beatId?: string
      beatTitle?: string
      downloadUrl?: string
      transactionId?: string
      optInNewsletter?: boolean
      isBundle?: boolean
      bundleDiscount?: number
      licenseId?: LicenseId
      licenseName?: string
      licenseTermsVersion?: string
      buyerName?: string
      beatPrice?: number
    } = await request.json()

    if (!email || !beatId || !transactionId) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const serverBeatPrice = await getBeatPrice(beatId)
    if (serverBeatPrice === null) {
      return Response.json({ error: "Unknown beat" }, { status: 400 })
    }

    // Verify payment with PayPal before sending download
    const verifyResult = await verifyPayPalPayment({
      orderId: transactionId,
      expectedBeatId: beatId,
      isBundle: !!isBundle,
    })
    if (!verifyResult.ok) {
      console.error("❌ PayPal verification failed for order:", transactionId)
      return Response.json({ error: "Payment verification failed" }, { status: 403 })
    }
    console.log("✅ PayPal payment verified:", transactionId)

    // Store transaction for download verification - now returns unique downloadToken per beat
    const downloadToken = await storeTransaction(transactionId, beatId, email, beatTitle || "Beat", 48, {
      buyerName,
      licenseName,
      licenseTermsVersion,
    }) // 48 hour expiry

    // Generate secure download link using unique downloadToken (supports bundles!)
    // Priority: NEXT_PUBLIC_BASE_URL > production domain > VERCEL_URL (preview) > localhost
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      (process.env.NODE_ENV === "production" 
        ? "https://www.krash.world" 
        : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"))
    
    // Ensure URL always has protocol (https:// or http://)
    if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
      baseUrl = `https://${baseUrl}`
    }
    
    // Remove trailing slash if present
    baseUrl = baseUrl.replace(/\/$/, "")
    
    // Use downloadToken (transactionId-beatId) for unique URLs per beat in bundle
    const secureDownloadUrl = `${baseUrl}/download/${downloadToken}`
    const licensePdfUrl = `${baseUrl}/api/beatstore/license-pdf?token=${encodeURIComponent(downloadToken)}`

    // Log the purchase for easy access (backup method)
    const purchaseTimestamp = new Date().toISOString()
    console.log("🎵 Beat Purchase:", {
      email,
      beatId,
      beatTitle,
      licenseId,
      licenseName,
      licenseTermsVersion,
      transactionId,
      downloadToken,
      timestamp: purchaseTimestamp,
      downloadUrl: secureDownloadUrl,
      licensePdfUrl,
      optInNewsletter,
    })

    // ============================================
    // SALES TRACKING & NOTIFICATIONS
    // ============================================
    
    // Log sale to Redis (bundle: per-item price from client; single: verified PayPal amount)
    const saleAmount = isBundle ? (clientBeatPrice ?? serverBeatPrice ?? 0) : (verifyResult.amount ?? serverBeatPrice ?? 0)
    await logSale({
      transactionId,
      beatId,
      beatTitle: beatTitle || "Beat",
      email,
      amount: saleAmount,
      isBundle: isBundle || false,
      bundleDiscount: bundleDiscount || 0,
      licenseTermsVersion,
    })

    // Send instant notifications (Discord, Slack, Email)
    // Don't await - let it run in background so customer email isn't delayed
    notifySale({
      beatTitle: beatTitle || "Beat",
      beatId,
      amount: saleAmount,
      customerEmail: email,
      transactionId,
      isBundle: isBundle || false,
      bundleSize: isBundle ? undefined : 1,
      timestamp: purchaseTimestamp,
    }).catch(err => console.error("Notification error (non-blocking):", err))

    // Log to Google Sheets for spreadsheet tracking (optional)
    logSaleToGoogleSheets({
      beatTitle: beatTitle || "Beat",
      beatId,
      amount: saleAmount,
      customerEmail: email,
      transactionId,
      isBundle: isBundle || false,
      timestamp: purchaseTimestamp,
    }).catch(err => console.error("Google Sheets log error (non-blocking):", err))

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

    // Option 1: Use EmailJS (server-side email service)
    const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID
    const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID
    const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY
    const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY

    if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY && EMAILJS_PRIVATE_KEY) {
      try {
        console.log("📧 Attempting EmailJS send...")
        
        // Initialize EmailJS with public and private keys
        emailjs.init({
          publicKey: EMAILJS_PUBLIC_KEY,
          privateKey: EMAILJS_PRIVATE_KEY,
        })

        // Send email using EmailJS
        const emailjsResponse = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            to_email: email,
            beat_title: beatTitle || "Beat",
            download_link: secureDownloadUrl,
            license_pdf_url: licensePdfUrl,
            transaction_id: transactionId,
            buyer_name: buyerName || "Licensee",
            producer_credit: PRODUCER_CREDIT,
            producer_bmi_ipi: PRODUCER_BMI_IPI,
            split_terms: SPLIT_TERMS,
            license_name: licenseName || "Starter License",
            license_terms_version: licenseTermsVersion || "unknown",
          }
        )

        console.log(`📧 EmailJS response: ${emailjsResponse.status} ${emailjsResponse.text}`)
        
        if (emailjsResponse.status === 200) {
          console.log("✅ EmailJS email sent successfully")
          return Response.json({ success: true, method: "emailjs" })
        } else {
          console.error("❌ EmailJS failed:", emailjsResponse.text)
        }
      } catch (error) {
        console.error("❌ EmailJS error:", error)
        const errorMessage = error instanceof Error ? error.message : String(error)
        if (errorMessage.includes("non-browser")) {
          console.error("⚠️ EmailJS API for non-browser applications is disabled. Enable it in EmailJS dashboard: Account → Security → Allow EmailJS API for non-browser applications")
        }
      }
    } else {
      const missingVars = []
      if (!EMAILJS_SERVICE_ID) missingVars.push("EMAILJS_SERVICE_ID")
      if (!EMAILJS_TEMPLATE_ID) missingVars.push("EMAILJS_TEMPLATE_ID")
      if (!EMAILJS_PUBLIC_KEY) missingVars.push("EMAILJS_PUBLIC_KEY")
      if (!EMAILJS_PRIVATE_KEY) missingVars.push("EMAILJS_PRIVATE_KEY")
      console.log(`⚠️ EmailJS not configured (missing: ${missingVars.join(", ")})`)
    }

    // Option 2: Use Google Sheets (like newsletter) as fallback
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
            licensePdfUrl,
            transactionId,
            timestamp: new Date().toISOString(),
            buyerName: buyerName || "Licensee",
            producerCredit: PRODUCER_CREDIT,
            producerBmiIpi: PRODUCER_BMI_IPI,
            splitTerms: SPLIT_TERMS,
            licenseName: licenseName || "Starter License",
            licenseTermsVersion: licenseTermsVersion || "unknown",
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
      licensePdfUrl,
      producerCredit: PRODUCER_CREDIT,
      producerBmiIpi: PRODUCER_BMI_IPI,
      splitTerms: SPLIT_TERMS,
    })
  } catch (error) {
    console.error("Send download error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
