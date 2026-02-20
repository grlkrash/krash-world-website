import { NextRequest, NextResponse } from "next/server"
import { PDFDocument, StandardFonts, rgb, type PDFPage, type PDFFont } from "pdf-lib"
import { getTransaction } from "@/app/services/beatstore/transaction-store"

const PRODUCER_CREDIT = "GRLKRASH a/k/a Sonia Gibbs"
const PRODUCER_BMI_IPI = "01057188153"

function sanitizeFilename({ value }: { value: string }) {
  return value.replace(/[^a-z0-9]/gi, "_").toLowerCase()
}

function drawWrappedText({
  page,
  font,
  text,
  x,
  y,
  size,
  lineHeight,
  maxWidth,
}: {
  page: PDFPage
  font: PDFFont
  text: string
  x: number
  y: number
  size: number
  lineHeight: number
  maxWidth: number
}) {
  const words = text.split(" ")
  let currentLine = ""
  let currentY = y

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word
    const textWidth = font.widthOfTextAtSize(nextLine, size)

    if (textWidth <= maxWidth) {
      currentLine = nextLine
      continue
    }

    page.drawText(currentLine, { x, y: currentY, size, color: rgb(0, 0, 0), font })
    currentLine = word
    currentY -= lineHeight
  }

  if (currentLine) page.drawText(currentLine, { x, y: currentY, size, color: rgb(0, 0, 0), font })
  return currentY - lineHeight
}

export async function GET(request: NextRequest) {
  try {
    const downloadToken = request.nextUrl.searchParams.get("token")
    if (!downloadToken)
      return NextResponse.json({ error: "Missing token" }, { status: 400 })

    const transaction = await getTransaction(downloadToken)
    if (!transaction)
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 404 })

    const pdf = await PDFDocument.create()
    const page = pdf.addPage([612, 792])
    const font = await pdf.embedFont(StandardFonts.Helvetica)
    const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold)
    page.setFont(font)

    const marginLeft = 54
    const maxWidth = 504
    let cursorY = 740

    page.setFont(fontBold)
    page.drawText("Beat License Certificate", {
      x: marginLeft,
      y: cursorY,
      size: 20,
      color: rgb(0, 0, 0),
    })

    cursorY -= 34
    page.setFont(font)
    page.drawText(`Issue Date: ${new Date(transaction.createdAt).toISOString()}`, {
      x: marginLeft,
      y: cursorY,
      size: 11,
      color: rgb(0, 0, 0),
    })

    cursorY -= 26
    page.setFont(fontBold)
    page.drawText("Producer", { x: marginLeft, y: cursorY, size: 12, color: rgb(0, 0, 0) })
    cursorY -= 18
    page.setFont(font)
    page.drawText(`${PRODUCER_CREDIT} | BMI IPI: ${PRODUCER_BMI_IPI}`, {
      x: marginLeft,
      y: cursorY,
      size: 11,
      color: rgb(0, 0, 0),
    })

    cursorY -= 30
    page.setFont(fontBold)
    page.drawText("Licensee", { x: marginLeft, y: cursorY, size: 12, color: rgb(0, 0, 0) })
    cursorY -= 18
    page.setFont(font)
    page.drawText(`${transaction.buyerName} (${transaction.email})`, {
      x: marginLeft,
      y: cursorY,
      size: 11,
      color: rgb(0, 0, 0),
    })

    cursorY -= 30
    page.setFont(fontBold)
    page.drawText("Track and Purchase Details", { x: marginLeft, y: cursorY, size: 12, color: rgb(0, 0, 0) })
    cursorY -= 18
    page.setFont(font)
    page.drawText(`Beat Title: ${transaction.beatTitle}`, { x: marginLeft, y: cursorY, size: 11, color: rgb(0, 0, 0) })
    cursorY -= 16
    page.drawText(`Beat ID: ${transaction.beatId}`, { x: marginLeft, y: cursorY, size: 11, color: rgb(0, 0, 0) })
    cursorY -= 16
    page.drawText(`License: ${transaction.licenseName}`, { x: marginLeft, y: cursorY, size: 11, color: rgb(0, 0, 0) })
    cursorY -= 16
    page.drawText(`Order ID: ${transaction.transactionId}`, { x: marginLeft, y: cursorY, size: 11, color: rgb(0, 0, 0) })
    cursorY -= 16
    page.drawText(`Terms Version: ${transaction.licenseTermsVersion}`, { x: marginLeft, y: cursorY, size: 11, color: rgb(0, 0, 0) })

    cursorY -= 30
    page.setFont(fontBold)
    page.drawText("Core Legal Allocation Terms", { x: marginLeft, y: cursorY, size: 12, color: rgb(0, 0, 0) })
    cursorY -= 18
    page.setFont(font)
    cursorY = drawWrappedText({
      page,
      font,
      text: "Licensee agrees that song registration, publishing administration, royalties, and distribution must be allocated 50% to Producer and 50% to Licensee.",
      x: marginLeft,
      y: cursorY,
      size: 11,
      lineHeight: 15,
      maxWidth,
    })
    cursorY = drawWrappedText({
      page,
      font,
      text: `Producer registration data: ${PRODUCER_CREDIT}, BMI IPI ${PRODUCER_BMI_IPI}.`,
      x: marginLeft,
      y: cursorY,
      size: 11,
      lineHeight: 15,
      maxWidth,
    })

    cursorY -= 12
    page.setFont(fontBold)
    page.drawText("Acknowledgment", { x: marginLeft, y: cursorY, size: 12, color: rgb(0, 0, 0) })
    cursorY -= 18
    page.setFont(font)
    drawWrappedText({
      page,
      font,
      text: "This certificate is generated from completed purchase records and is provided for release metadata, publishing administration, and contract support.",
      x: marginLeft,
      y: cursorY,
      size: 10,
      lineHeight: 14,
      maxWidth,
    })

    page.drawText(`KRASH WORLD | TERMS ${transaction.licenseTermsVersion} | ${new Date(transaction.createdAt).toISOString()}`, {
      x: marginLeft,
      y: 24,
      size: 8,
      color: rgb(0.45, 0.45, 0.45),
      font,
    })

    const pdfBytes = await pdf.save()
    const fileName = `${sanitizeFilename({ value: transaction.beatTitle })}_license.pdf`

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("License PDF generation error:", error)
    return NextResponse.json({ error: "Failed to generate license PDF" }, { status: 500 })
  }
}

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
