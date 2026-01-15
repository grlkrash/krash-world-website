// Admin API for viewing sales data
// Protected by ADMIN_API_KEY environment variable

import { NextRequest } from "next/server"
import { getRecentSales, getSalesStats, getSalesByBeat } from "@/app/services/beatstore/sales-log"

// Simple API key authentication
function isAuthorized(request: NextRequest): boolean {
  const adminKey = process.env.ADMIN_API_KEY
  if (!adminKey) {
    console.warn("⚠️ ADMIN_API_KEY not set - admin endpoints disabled")
    return false
  }

  // Check Authorization header
  const authHeader = request.headers.get("Authorization")
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7)
    if (token === adminKey) return true
  }

  // Check query parameter (for easy browser access)
  const url = new URL(request.url)
  const keyParam = url.searchParams.get("key")
  if (keyParam === adminKey) return true

  return false
}

export async function GET(request: NextRequest) {
  // Check authorization
  if (!isAuthorized(request)) {
    return Response.json(
      { error: "Unauthorized. Set ADMIN_API_KEY and pass it via Authorization header or ?key= param" },
      { status: 401 }
    )
  }

  const url = new URL(request.url)
  const action = url.searchParams.get("action") || "recent"
  const limit = parseInt(url.searchParams.get("limit") || "20", 10)
  const beatId = url.searchParams.get("beatId")

  try {
    switch (action) {
      case "stats": {
        const stats = await getSalesStats()
        return Response.json({
          success: true,
          stats,
        })
      }

      case "by-beat": {
        if (!beatId) {
          return Response.json({ error: "beatId parameter required for by-beat action" }, { status: 400 })
        }
        const sales = await getSalesByBeat(beatId, limit)
        return Response.json({
          success: true,
          beatId,
          count: sales.length,
          sales,
        })
      }

      case "recent":
      default: {
        const sales = await getRecentSales(limit)
        const stats = await getSalesStats()
        return Response.json({
          success: true,
          count: sales.length,
          stats: {
            totalSales: stats.totalSales,
            totalRevenue: stats.totalRevenue,
            salesLast24h: stats.salesLast24h,
            revenueLast24h: stats.revenueLast24h,
          },
          topBeats: stats.topBeats.slice(0, 5),
          sales,
        })
      }
    }
  } catch (error) {
    console.error("Admin sales API error:", error)
    return Response.json(
      { error: "Failed to fetch sales data", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
