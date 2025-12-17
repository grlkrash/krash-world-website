import { NextRequest, NextResponse } from "next/server"
import { getTransaction } from "@/app/services/beatstore/transaction-store"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 })
    }

    const transaction = getTransaction(token)

    if (!transaction) {
      return NextResponse.json({ error: "Invalid or expired download link" }, { status: 404 })
    }

    return NextResponse.json({
      beatId: transaction.beatId,
      beatTitle: transaction.beatTitle,
      email: transaction.email,
      expiresAt: transaction.expiresAt,
    })
  } catch (error) {
    console.error("Verify error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
