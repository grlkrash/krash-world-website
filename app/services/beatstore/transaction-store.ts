// Transaction store with Upstash Redis support and in-memory fallback
// Upstash Redis provides persistent storage across serverless function invocations

import { Redis } from "@upstash/redis"

interface Transaction {
  transactionId: string
  beatId: string
  email: string
  beatTitle: string
  createdAt: number
  expiresAt: number
  downloaded: boolean
}

// Initialize Redis using Vercel-provided environment variables
// Vercel sets KV_REST_API_URL and KV_REST_API_TOKEN when Upstash is connected
// Falls back gracefully if not configured
let redis: Redis | null = null
try {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
    console.log("✅ Upstash Redis initialized")
  } else {
    console.log("⚠️ Upstash Redis not configured (missing env vars), using in-memory fallback")
  }
} catch (error) {
  console.log("⚠️ Upstash Redis initialization failed, using in-memory fallback:", error)
  redis = null
}

// In-memory fallback store (used if Upstash Redis is not configured)
// WARNING: This doesn't work reliably on Vercel serverless functions
// because each invocation may run on a different instance
const transactions = new Map<string, Transaction>()

const KV_PREFIX = "transaction:"

// Helper to get KV key
function getKVKey(transactionId: string): string {
  return `${KV_PREFIX}${transactionId}`
}

export async function storeTransaction(
  transactionId: string,
  beatId: string,
  email: string,
  beatTitle: string,
  expiresInHours: number = 48,
): Promise<void> {
  const now = Date.now()
  const transaction: Transaction = {
    transactionId,
    beatId,
    email,
    beatTitle,
    createdAt: now,
    expiresAt: now + expiresInHours * 60 * 60 * 1000,
    downloaded: false,
  }

  // Try Upstash Redis first
  if (redis) {
    try {
      const ttl = expiresInHours * 60 * 60 // Convert to seconds
      await redis.set(getKVKey(transactionId), transaction, { ex: ttl })
      console.log(`✅ Transaction ${transactionId} stored in Upstash Redis`)
      return
    } catch (error) {
      console.error(`❌ Failed to store transaction in Redis, falling back to memory:`, error)
    }
  }

  // Fallback to in-memory (not reliable on serverless)
  transactions.set(transactionId, transaction)
  console.log(`⚠️ Transaction ${transactionId} stored in memory (Redis not available - may not persist across invocations)`)
}

export async function getTransaction(transactionId: string): Promise<Transaction | undefined> {
  // Try Upstash Redis first
  if (redis) {
    try {
      const transaction = await redis.get<Transaction>(getKVKey(transactionId))
      if (!transaction) {
        console.log(`🔍 Transaction ${transactionId} not found in Redis`)
        return undefined
      }

      // Check if expired
      if (transaction.expiresAt < Date.now()) {
        await redis.del(getKVKey(transactionId))
        console.log(`⏰ Transaction ${transactionId} expired`)
        return undefined
      }

      console.log(`✅ Transaction ${transactionId} found in Redis`)
      return transaction
    } catch (error) {
      console.error(`❌ Failed to get transaction from Redis, falling back to memory:`, error)
    }
  }

  // Fallback to in-memory
  const transaction = transactions.get(transactionId)
  if (!transaction) {
    console.log(`🔍 Transaction ${transactionId} not found in memory`)
    return undefined
  }

  // Check if expired
  if (transaction.expiresAt < Date.now()) {
    transactions.delete(transactionId)
    console.log(`⏰ Transaction ${transactionId} expired`)
    return undefined
  }

  console.log(`✅ Transaction ${transactionId} found in memory`)
  return transaction
}

export async function markAsDownloaded(transactionId: string): Promise<boolean> {
  const transaction = await getTransaction(transactionId)
  if (!transaction) return false

  transaction.downloaded = true

  // Update in Redis or memory
  if (redis) {
    try {
      const remainingTtl = Math.max(0, Math.floor((transaction.expiresAt - Date.now()) / 1000))
      if (remainingTtl > 0) {
        await redis.set(getKVKey(transactionId), transaction, { ex: remainingTtl })
      }
      return true
    } catch (error) {
      console.error(`❌ Failed to update transaction in Redis:`, error)
    }
  }

  // Update in memory
  transactions.set(transactionId, transaction)
  return true
}

export async function verifyTransaction(transactionId: string, beatId: string): Promise<boolean> {
  const transaction = await getTransaction(transactionId)
  if (!transaction) {
    console.log(`❌ Transaction verification failed: ${transactionId} not found`)
    return false
  }
  if (transaction.beatId !== beatId) {
    console.log(`❌ Transaction verification failed: beatId mismatch. Expected ${beatId}, got ${transaction.beatId}`)
    return false
  }
  console.log(`✅ Transaction verification passed: ${transactionId}`)
  return true
}
