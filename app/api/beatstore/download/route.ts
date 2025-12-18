import { NextRequest, NextResponse } from "next/server"
import { verifyTransaction, markAsDownloaded, getTransaction } from "@/app/services/beatstore/transaction-store"
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"

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
  try {
    const searchParams = request.nextUrl.searchParams
    const transactionId = searchParams.get("token")
    const beatId = searchParams.get("beatId")

    if (!transactionId || !beatId) {
      return NextResponse.json({ error: "Missing token or beatId" }, { status: 400 })
    }

    // Verify transaction
    console.log(`🔍 Verifying transaction: ${transactionId} for beat: ${beatId}`)
    const transaction = await getTransaction(transactionId)
    if (!transaction) {
      console.error(`❌ Transaction not found: ${transactionId}`)
      console.log(`💡 Possible reasons:`)
      console.log(`   1. Transaction stored in different serverless instance (in-memory issue)`)
      console.log(`   2. Transaction expired (48 hour limit)`)
      console.log(`   3. Vercel KV not configured`)
      return NextResponse.json({ error: "Invalid or expired download link" }, { status: 404 })
    }

    if (transaction.beatId !== beatId) {
      return NextResponse.json({ error: "Transaction does not match beat" }, { status: 403 })
    }

    // Verify S3 configuration
    console.log(`🔍 S3 Configuration Check:`)
    console.log(`   Bucket: ${S3_BUCKET_NAME}`)
    console.log(`   Region: ${S3_REGION}`)
    console.log(`   AWS_ACCESS_KEY_ID: ${process.env.AWS_ACCESS_KEY_ID ? "✅ Set" : "❌ Missing"}`)
    console.log(`   AWS_SECRET_ACCESS_KEY: ${process.env.AWS_SECRET_ACCESS_KEY ? "✅ Set" : "❌ Missing"}`)

    // Get the S3 key for the ZIP file
    // Try downloads/ prefix first, then root level
    const fileName = `${beatId}.zip`
    const s3Keys = [`downloads/${fileName}`, fileName]

    let fileBuffer: Buffer | null = null
    let lastError: Error | null = null

    // Try each possible S3 key location
    for (const s3Key of s3Keys) {
      try {
        console.log(`🔍 Attempting to fetch from S3: s3://${S3_BUCKET_NAME}/${s3Key}`)
        const command = new GetObjectCommand({
          Bucket: S3_BUCKET_NAME,
          Key: s3Key,
        })

        const response = await s3Client.send(command)
        
        if (!response.Body) {
          throw new Error("No file body returned from S3")
        }

        console.log(`✅ File found in S3 at: ${s3Key}`)
        console.log(`   Content-Type: ${response.ContentType || "application/zip"}`)
        console.log(`   Content-Length: ${response.ContentLength || "unknown"}`)

        // Convert stream to buffer
        // AWS SDK v3 Body is a Readable stream in Node.js
        const chunks: Buffer[] = []
        const stream = response.Body as any
        
        // Read the stream as async iterable
        for await (const chunk of stream) {
          chunks.push(Buffer.from(chunk))
        }

        fileBuffer = Buffer.concat(chunks)
        console.log(`✅ File downloaded from S3, size: ${fileBuffer.length} bytes`)
        break // Success, exit loop
      } catch (error) {
        lastError = error as Error
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.log(`❌ S3 key ${s3Key} failed: ${errorMessage}`)
        if (errorMessage.includes("AccessDenied") || errorMessage.includes("403")) {
          console.error(`   ⚠️ S3 Access Denied - check AWS credentials and bucket permissions`)
        } else if (errorMessage.includes("NoSuchKey") || errorMessage.includes("404")) {
          console.log(`   ℹ️ File not found at this location, trying next...`)
        }
        continue
      }
    }

    if (!fileBuffer) {
      console.error(`❌ S3 download failed for all locations`)
      console.error(`   Last error:`, lastError)
      console.error(`   Tried locations:`, s3Keys)
      console.error(`   💡 Make sure:`)
      console.error(`      1. ZIP files are uploaded to S3 bucket: ${S3_BUCKET_NAME}`)
      console.error(`      2. Files are in 'downloads/' folder or root`)
      console.error(`      3. AWS credentials have s3:GetObject permission`)
      return NextResponse.json(
        { error: "File not found. Please contact support with your transaction ID." },
        { status: 404 },
      )
    }

    // Mark as downloaded (optional)
    await markAsDownloaded(transactionId)

    // Return the file
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${transaction.beatTitle.replace(/[^a-z0-9]/gi, "_")}.zip"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
