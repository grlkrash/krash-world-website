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
    const transaction = getTransaction(transactionId)
    if (!transaction) {
      return NextResponse.json({ error: "Invalid or expired download link" }, { status: 404 })
    }

    if (transaction.beatId !== beatId) {
      return NextResponse.json({ error: "Transaction does not match beat" }, { status: 403 })
    }

    // Get the S3 key for the ZIP file
    // Try downloads/ prefix first, then root level
    const fileName = `${beatId}.zip`
    const s3Keys = [`downloads/${fileName}`, fileName]

    let fileBuffer: Buffer | null = null
    let lastError: Error | null = null

    // Try each possible S3 key location
    for (const s3Key of s3Keys) {
      try {
        const command = new GetObjectCommand({
          Bucket: S3_BUCKET_NAME,
          Key: s3Key,
        })

        const response = await s3Client.send(command)
        
        if (!response.Body) {
          throw new Error("No file body returned from S3")
        }

        // Convert stream to buffer
        // AWS SDK v3 Body is a Readable stream in Node.js
        const chunks: Buffer[] = []
        const stream = response.Body as any
        
        // Read the stream as async iterable
        for await (const chunk of stream) {
          chunks.push(Buffer.from(chunk))
        }

        fileBuffer = Buffer.concat(chunks)
        break // Success, exit loop
      } catch (error) {
        lastError = error as Error
        console.log(`Tried S3 key ${s3Key}, not found. Trying next...`)
        continue
      }
    }

    if (!fileBuffer) {
      console.error("S3 download error:", lastError)
      return NextResponse.json(
        { error: "File not found. Please contact support with your transaction ID." },
        { status: 404 },
      )
    }

    // Mark as downloaded (optional)
    markAsDownloaded(transactionId)

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
