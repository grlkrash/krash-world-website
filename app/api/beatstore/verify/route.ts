import { NextRequest, NextResponse } from "next/server"
import { getTransaction } from "@/app/services/beatstore/transaction-store"

export async function GET(request: NextRequest) {
  const url = request.nextUrl.toString()
  console.log("🔵 Verify route called:", url)
  console.log("🔵 Request method:", request.method)
  
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get("token") // This is now downloadToken (transactionId-beatId)
    
    console.log(`📥 Verify request - downloadToken: ${token}`)
    console.log(`📥 Token length: ${token?.length || 0}`)
    console.log(`📥 All search params:`, Object.fromEntries(searchParams.entries()))

    if (!token) {
      console.error("❌ Missing token parameter")
      return NextResponse.json({ error: "Missing token" }, { status: 400 })
    }

    console.log(`🔍 Looking up transaction by downloadToken: ${token}`)
    const transaction = await getTransaction(token)

    if (!transaction) {
      console.error(`❌ Transaction verification failed for downloadToken: ${token}`)
      console.log(`💡 This might be because:`)
      console.log(`   1. Transaction was stored in a different serverless function instance (in-memory store issue)`)
      console.log(`   2. Transaction expired (48 hour limit)`)
      console.log(`   3. Vercel KV not configured - transactions don't persist across invocations`)
      console.log(`   4. Token format mismatch (check for encoding issues)`)
      return NextResponse.json({ error: "Invalid or expired download link" }, { status: 404 })
    }

    console.log(`✅ Transaction found:`, {
      transactionId: transaction.transactionId,
      downloadToken: transaction.downloadToken,
      beatId: transaction.beatId,
      beatTitle: transaction.beatTitle,
      email: transaction.email,
      expiresAt: new Date(transaction.expiresAt).toISOString(),
      downloaded: transaction.downloaded,
    })

    return NextResponse.json({
      beatId: transaction.beatId,
      beatTitle: transaction.beatTitle,
      email: transaction.email,
      expiresAt: transaction.expiresAt,
      downloadToken: transaction.downloadToken,
    })
  } catch (error) {
    console.error("❌ Verify route error:", error)
    console.error("❌ Error stack:", error instanceof Error ? error.stack : "No stack trace")
    console.error("❌ Error details:", {
      message: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : "Unknown",
    })
    return NextResponse.json({ 
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 })
  }
}

// Export runtime configuration
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
