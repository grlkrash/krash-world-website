// Sales logging service - persistent tracking for all beat sales
// Stores sales in Redis for querying and provides admin visibility

import { Redis } from "@upstash/redis"

export interface Sale {
  id: string // Unique sale ID (transactionId-beatId)
  transactionId: string
  beatId: string
  beatTitle: string
  email: string
  amount: number
  isBundle: boolean
  bundleDiscount: number
  timestamp: number
  timestampISO: string
}

export interface SalesStats {
  totalSales: number
  totalRevenue: number
  salesLast24h: number
  revenueLast24h: number
  topBeats: { beatId: string; beatTitle: string; count: number }[]
}

// Lazy-initialized Redis client
let redis: Redis | null = null
let redisInitialized = false

function getRedisClient(): Redis | null {
  if (redisInitialized) return redis
  
  redisInitialized = true
  
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  
  if (!url || !token) {
    console.log("⚠️ Sales log: Redis not configured")
    return null
  }
  
  try {
    redis = new Redis({ url, token })
    return redis
  } catch (error) {
    console.error("❌ Sales log: Redis initialization failed:", error)
    return null
  }
}

const SALES_PREFIX = "sale:"
const SALES_LIST_KEY = "sales:all"
const STATS_KEY = "sales:stats"

// Log a new sale
export async function logSale({
  transactionId,
  beatId,
  beatTitle,
  email,
  amount,
  isBundle = false,
  bundleDiscount = 0,
}: {
  transactionId: string
  beatId: string
  beatTitle: string
  email: string
  amount: number
  isBundle?: boolean
  bundleDiscount?: number
}): Promise<Sale | null> {
  const client = getRedisClient()
  
  const saleId = `${transactionId}-${beatId}`
  const now = Date.now()
  
  const sale: Sale = {
    id: saleId,
    transactionId,
    beatId,
    beatTitle,
    email,
    amount,
    isBundle,
    bundleDiscount,
    timestamp: now,
    timestampISO: new Date(now).toISOString(),
  }

  console.log("💰 SALE LOGGED:", {
    beatTitle,
    beatId,
    amount: `$${amount}`,
    email: email.substring(0, 3) + "***@" + email.split("@")[1],
    timestamp: sale.timestampISO,
    isBundle,
  })

  if (!client) {
    console.warn("⚠️ Sale logged to console only (Redis not configured)")
    return sale
  }

  try {
    // Store individual sale (expires after 1 year)
    await client.set(`${SALES_PREFIX}${saleId}`, sale, { ex: 365 * 24 * 60 * 60 })
    
    // Add to sales list (score = timestamp for sorting)
    await client.zadd(SALES_LIST_KEY, { score: now, member: saleId })
    
    // Update stats
    await updateStats(client, sale)
    
    console.log(`✅ Sale ${saleId} saved to Redis`)
    return sale
  } catch (error) {
    console.error("❌ Failed to log sale to Redis:", error)
    return sale // Return sale even if Redis fails (logged to console)
  }
}

// Update running stats
async function updateStats(client: Redis, sale: Sale): Promise<void> {
  try {
    const stats = await client.get<SalesStats>(STATS_KEY) || {
      totalSales: 0,
      totalRevenue: 0,
      salesLast24h: 0,
      revenueLast24h: 0,
      topBeats: [],
    }

    stats.totalSales += 1
    stats.totalRevenue += sale.amount

    // Update top beats
    const existingBeat = stats.topBeats.find(b => b.beatId === sale.beatId)
    if (existingBeat) {
      existingBeat.count += 1
    } else {
      stats.topBeats.push({
        beatId: sale.beatId,
        beatTitle: sale.beatTitle,
        count: 1,
      })
    }
    
    // Sort by count, keep top 10
    stats.topBeats.sort((a, b) => b.count - a.count)
    stats.topBeats = stats.topBeats.slice(0, 10)

    await client.set(STATS_KEY, stats)
  } catch (error) {
    console.error("❌ Failed to update stats:", error)
  }
}

// Get recent sales
export async function getRecentSales(limit = 20): Promise<Sale[]> {
  const client = getRedisClient()
  if (!client) {
    console.warn("⚠️ Cannot get sales: Redis not configured")
    return []
  }

  try {
    // Get recent sale IDs (sorted by timestamp, newest first)
    const saleIds = await client.zrange(SALES_LIST_KEY, -limit, -1, { rev: true })
    
    if (!saleIds || saleIds.length === 0) return []

    // Fetch all sales
    const sales: Sale[] = []
    for (const saleId of saleIds) {
      const sale = await client.get<Sale>(`${SALES_PREFIX}${saleId}`)
      if (sale) sales.push(sale)
    }

    return sales
  } catch (error) {
    console.error("❌ Failed to get recent sales:", error)
    return []
  }
}

// Get sales stats
export async function getSalesStats(): Promise<SalesStats> {
  const client = getRedisClient()
  
  const defaultStats: SalesStats = {
    totalSales: 0,
    totalRevenue: 0,
    salesLast24h: 0,
    revenueLast24h: 0,
    topBeats: [],
  }

  if (!client) return defaultStats

  try {
    const stats = await client.get<SalesStats>(STATS_KEY)
    if (!stats) return defaultStats

    // Calculate 24h stats from recent sales
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
    const recentSaleIds = await client.zrangebyscore(SALES_LIST_KEY, oneDayAgo, Date.now())
    
    let salesLast24h = 0
    let revenueLast24h = 0
    
    for (const saleId of recentSaleIds) {
      const sale = await client.get<Sale>(`${SALES_PREFIX}${saleId}`)
      if (sale) {
        salesLast24h += 1
        revenueLast24h += sale.amount
      }
    }

    return {
      ...stats,
      salesLast24h,
      revenueLast24h,
    }
  } catch (error) {
    console.error("❌ Failed to get sales stats:", error)
    return defaultStats
  }
}

// Get sales by beat ID
export async function getSalesByBeat(beatId: string, limit = 50): Promise<Sale[]> {
  const client = getRedisClient()
  if (!client) return []

  try {
    // Get all sale IDs and filter by beatId
    const allSaleIds = await client.zrange(SALES_LIST_KEY, 0, -1, { rev: true })
    
    const sales: Sale[] = []
    for (const saleId of allSaleIds) {
      if (sales.length >= limit) break
      
      const sale = await client.get<Sale>(`${SALES_PREFIX}${saleId}`)
      if (sale && sale.beatId === beatId) {
        sales.push(sale)
      }
    }

    return sales
  } catch (error) {
    console.error("❌ Failed to get sales by beat:", error)
    return []
  }
}
