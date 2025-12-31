import { NextRequest, NextResponse } from "next/server"
import { markAsDownloaded, getTransaction } from "@/app/services/beatstore/transaction-store"
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { readFile } from "fs/promises"
import { join } from "path"

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-2",
  credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    : undefined,
})

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || "krash-beatstore-aws"
const S3_REGION = process.env.AWS_REGION || "us-east-2"

export async function GET(request: NextRequest) {
  const url = request.nextUrl.toString()
  console.log("🔵 Download route called:", url)
  console.log("🔵 Request method:", request.method)
  console.log("🔵 Request headers:", Object.fromEntries(request.headers.entries()))
  
  try {
    const searchParams = request.nextUrl.searchParams
    const downloadToken = searchParams.get("token") // Now downloadToken (transactionId-beatId)
    const beatId = searchParams.get("beatId")
    
    console.log(`📥 Download request - downloadToken: ${downloadToken}, beatId: ${beatId}`)
    console.log(`📥 All search params:`, Object.fromEntries(searchParams.entries()))

    if (!downloadToken || !beatId) {
      console.error(`❌ Missing required parameters - downloadToken: ${downloadToken}, beatId: ${beatId}`)
      return NextResponse.json({ error: "Missing token or beatId" }, { status: 400 })
    }

    // Verify transaction using downloadToken
    console.log(`🔍 Verifying transaction by downloadToken: ${downloadToken} for beat: ${beatId}`)
    const transaction = await getTransaction(downloadToken)
    if (!transaction) {
      console.error(`❌ Transaction not found for downloadToken: ${downloadToken}`)
      console.log(`💡 Possible reasons:`)
      console.log(`   1. Transaction stored in different serverless instance (in-memory issue)`)
      console.log(`   2. Transaction expired (48 hour limit)`)
      console.log(`   3. Vercel KV not configured`)
      console.log(`   4. Download token mismatch`)
      return NextResponse.json({ error: "Invalid or expired download link" }, { status: 404 })
    }

    console.log(`✅ Transaction found:`, {
      transactionId: transaction.transactionId,
      downloadToken: transaction.downloadToken,
      beatId: transaction.beatId,
      email: transaction.email,
      beatTitle: transaction.beatTitle,
    })

    if (transaction.beatId !== beatId) {
      console.error(`❌ Beat ID mismatch - transaction beatId: ${transaction.beatId}, requested beatId: ${beatId}`)
      return NextResponse.json({ error: "Transaction does not match beat" }, { status: 403 })
    }

    // Helper to fetch file from S3
    async function fetchFromS3(key: string): Promise<Buffer | null> {
      try {
        const response = await s3Client.send(new GetObjectCommand({ Bucket: S3_BUCKET_NAME, Key: key }))
        if (!response.Body) return null
        const chunks: Buffer[] = []
        for await (const chunk of response.Body as any) chunks.push(Buffer.from(chunk))
        console.log(`✅ Found: ${key}`)
        return Buffer.concat(chunks)
      } catch { return null }
    }

    // Try individual files first (better mobile UX), then ZIP
    const wavKey = `downloads/${beatId}.wav`
    const mp3Key = `downloads/${beatId}.mp3`
    const zipKey = `downloads/${beatId}.zip`

    const [wavBuffer, mp3Buffer] = await Promise.all([fetchFromS3(wavKey), fetchFromS3(mp3Key)])
    
    let fileBuffer: Buffer | null = null
    let contentType = "application/zip"
    let fileExt = "zip"

    // If both exist → ZIP, if only one → direct file
    if (wavBuffer && mp3Buffer) {
      fileBuffer = await fetchFromS3(zipKey)
      console.log(`📦 Both WAV+MP3 exist, serving ZIP`)
    } else if (wavBuffer) {
      fileBuffer = wavBuffer
      contentType = "audio/wav"
      fileExt = "wav"
      console.log(`🎵 Only WAV exists, serving directly`)
    } else if (mp3Buffer) {
      fileBuffer = mp3Buffer
      contentType = "audio/mpeg"
      fileExt = "mp3"
      console.log(`🎵 Only MP3 exists, serving directly`)
    } else {
      // Fallback to ZIP
      fileBuffer = await fetchFromS3(zipKey) || await fetchFromS3(`beats/${beatId}.zip`)
    }

    // Local fallback
    if (!fileBuffer) {
      for (const ext of ["wav", "mp3", "zip"]) {
        try {
          fileBuffer = await readFile(join(process.cwd(), "public", "downloads", `${beatId}.${ext}`))
          contentType = ext === "wav" ? "audio/wav" : ext === "mp3" ? "audio/mpeg" : "application/zip"
          fileExt = ext
          break
        } catch { continue }
      }
    }

    if (!fileBuffer) {
      return NextResponse.json({ error: "File not found. Please contact support." }, { status: 404 })
    }

    await markAsDownloaded(downloadToken)

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${transaction.beatTitle.replace(/[^a-z0-9]/gi, "_")}.${fileExt}"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("❌ Download route error:", error)
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
