import { NextRequest, NextResponse } from "next/server"
import { verifyTransaction, markAsDownloaded, getTransaction } from "@/app/services/beatstore/transaction-store"
import { readFile } from "fs/promises"
import { join } from "path"

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

    // Check if already downloaded (optional - remove if you want multiple downloads)
    // if (transaction.downloaded) {
    //   return NextResponse.json({ error: "Download link has already been used" }, { status: 403 })
    // }

    // Get the file path
    // For now, using public/downloads - you can change this to AWS S3 or other storage
    const fileName = `${beatId}.zip`
    const filePath = join(process.cwd(), "public", "downloads", fileName)

    try {
      // Read the file
      const fileBuffer = await readFile(filePath)

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
    } catch (fileError) {
      console.error("File read error:", fileError)
      return NextResponse.json(
        { error: "File not found. Please contact support with your transaction ID." },
        { status: 404 },
      )
    }
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
