// Transaction store with Upstash Redis support and in-memory fallback
// Upstash Redis provides persistent storage across serverless function invocations
// Updated: Now uses downloadToken (transactionId-beatId) as unique key for bundles

import { Redis } from "@upstash/redis"

interface Transaction {
  transactionId: string
  beatId: string
  downloadToken: string // Unique token: transactionId-beatId
  email: string
  beatTitle: string
  createdAt: number
  expiresAt: number
  downloaded: boolean
}

// Generate unique download token for each beat in a bundle
export function generateDownloadToken(transactionId: string, beatId: string): string {
  return `${transactionId}-${beatId}`
}

// Lazy-initialized Redis client to ensure environment variables are available
let redis: Redis | null = null
let redisInitialized = false
let redisError: string | null = null

function getRedisClient(): Redis | null {
  if (redisInitialized) return redis
  
  redisInitialized = true
  
  // Check for Upstash/Vercel KV environment variables
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  
  console.log("🔧 Redis initialization check:")
  console.log(`   KV_REST_API_URL: ${process.env.KV_REST_API_URL ? "✅ Set" : "❌ Missing"}`)
  console.log(`   KV_REST_API_TOKEN: ${process.env.KV_REST_API_TOKEN ? "✅ Set" : "❌ Missing"}`)
  console.log(`   UPSTASH_REDIS_REST_URL: ${process.env.UPSTASH_REDIS_REST_URL ? "✅ Set" : "❌ Missing"}`)
  console.log(`   UPSTASH_REDIS_REST_TOKEN: ${process.env.UPSTASH_REDIS_REST_TOKEN ? "✅ Set" : "❌ Missing"}`)
  
  if (!url || !token) {
    redisError = `Missing env vars: ${!url ? "URL" : ""} ${!token ? "TOKEN" : ""}`
    console.log(`⚠️ Upstash Redis not configured: ${redisError}`)
    console.log("⚠️ Using in-memory fallback (WILL NOT WORK RELIABLY ON SERVERLESS)")
    return null
  }
  
  try {
    redis = new Redis({ url, token })
    console.log("✅ Upstash Redis client created successfully")
    return redis
  } catch (error) {
    redisError = error instanceof Error ? error.message : String(error)
    console.error("❌ Upstash Redis initialization failed:", redisError)
    redis = null
    return null
  }
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
): Promise<string> {
  const now = Date.now()
  // Generate unique download token for this beat (supports bundles)
  const downloadToken = generateDownloadToken(transactionId, beatId)
  
  const transaction: Transaction = {
    transactionId,
    beatId,
    downloadToken,
    email,
    beatTitle,
    createdAt: now,
    expiresAt: now + expiresInHours * 60 * 60 * 1000,
    downloaded: false,
  }

  const client = getRedisClient()
  
  // Try Upstash Redis first - use downloadToken as key (unique per beat)
  if (client) {
    try {
      const ttl = expiresInHours * 60 * 60 // Convert to seconds
      const key = getKVKey(downloadToken) // Use downloadToken as unique key!
      
      console.log(`📝 Storing transaction in Redis:`)
      console.log(`   Key: ${key}`)
      console.log(`   Download Token: ${downloadToken}`)
      console.log(`   TTL: ${ttl} seconds`)
      console.log(`   Data:`, { transactionId, beatId, email, beatTitle })
      
      await client.set(key, transaction, { ex: ttl })
      
      // Verify it was stored
      const verification = await client.get(key)
      if (verification) {
        console.log(`✅ Transaction ${downloadToken} stored and verified in Upstash Redis`)
      } else {
        console.error(`⚠️ Transaction ${downloadToken} stored but verification failed`)
      }
      return downloadToken
    } catch (error) {
      console.error(`❌ Failed to store transaction in Redis:`, error)
      console.error(`❌ Error details:`, {
        message: error instanceof Error ? error.message : String(error),
        name: error instanceof Error ? error.name : "Unknown",
      })
    }
  }

  // Fallback to in-memory (not reliable on serverless)
  transactions.set(downloadToken, transaction)
  console.log(`⚠️ Transaction ${downloadToken} stored in MEMORY ONLY`)
  console.log(`⚠️ WARNING: This will NOT persist across serverless invocations!`)
  console.log(`⚠️ Redis error: ${redisError || "Not configured"}`)
  return downloadToken
}

export async function getTransaction(downloadToken: string): Promise<Transaction | undefined> {
  console.log(`🔍 Looking up transaction by download token: ${downloadToken}`)
  
  const client = getRedisClient()
  
  // Try Upstash Redis first
  if (client) {
    try {
      const key = getKVKey(downloadToken)
      console.log(`🔍 Redis lookup key: ${key}`)
      
      const transaction = await client.get<Transaction>(key)
      
      if (!transaction) {
        console.log(`❌ Transaction ${downloadToken} NOT found in Redis`)
        
        // Debug: List all keys to see what's stored
        try {
          const keys = await client.keys(`${KV_PREFIX}*`)
          console.log(`📋 All transaction keys in Redis (${keys.length} total):`, keys.slice(0, 10))
          if (keys.length > 10) console.log(`   ... and ${keys.length - 10} more`)
        } catch (e) {
          console.log(`   (Could not list keys: ${e})`)
        }
        
        return undefined
      }

      // Check if expired (Redis TTL should handle this, but double-check)
      if (transaction.expiresAt < Date.now()) {
        await client.del(key)
        console.log(`⏰ Transaction ${downloadToken} expired (was stored but past expiry)`)
        return undefined
      }

      console.log(`✅ Transaction ${downloadToken} FOUND in Redis:`, {
        beatId: transaction.beatId,
        email: transaction.email,
        beatTitle: transaction.beatTitle,
        expiresAt: new Date(transaction.expiresAt).toISOString(),
      })
      return transaction
    } catch (error) {
      console.error(`❌ Failed to get transaction from Redis:`, error)
      console.error(`❌ Error details:`, {
        message: error instanceof Error ? error.message : String(error),
        name: error instanceof Error ? error.name : "Unknown",
      })
    }
  } else {
    console.log(`⚠️ Redis client not available (error: ${redisError})`)
  }

  // Fallback to in-memory
  console.log(`🔍 Checking in-memory store...`)
  console.log(`📋 In-memory transactions (${transactions.size} total):`, Array.from(transactions.keys()))
  
  const transaction = transactions.get(downloadToken)
  if (!transaction) {
    console.log(`❌ Transaction ${downloadToken} NOT found in memory either`)
    return undefined
  }

  // Check if expired
  if (transaction.expiresAt < Date.now()) {
    transactions.delete(downloadToken)
    console.log(`⏰ Transaction ${downloadToken} expired in memory`)
    return undefined
  }

  console.log(`⚠️ Transaction ${downloadToken} found in MEMORY (may be unreliable)`)
  return transaction
}

export async function markAsDownloaded(downloadToken: string): Promise<boolean> {
  const transaction = await getTransaction(downloadToken)
  if (!transaction) return false

  transaction.downloaded = true

  const client = getRedisClient()
  
  // Update in Redis or memory
  if (client) {
    try {
      const remainingTtl = Math.max(0, Math.floor((transaction.expiresAt - Date.now()) / 1000))
      if (remainingTtl > 0) {
        await client.set(getKVKey(downloadToken), transaction, { ex: remainingTtl })
        console.log(`✅ Transaction ${downloadToken} marked as downloaded in Redis`)
      }
      return true
    } catch (error) {
      console.error(`❌ Failed to update transaction in Redis:`, error)
    }
  }

  // Update in memory
  transactions.set(downloadToken, transaction)
  console.log(`⚠️ Transaction ${downloadToken} marked as downloaded in memory only`)
  return true
}

export async function verifyTransaction(downloadToken: string, beatId: string): Promise<boolean> {
  const transaction = await getTransaction(downloadToken)
  if (!transaction) {
    console.log(`❌ Transaction verification failed: ${downloadToken} not found`)
    return false
  }
  if (transaction.beatId !== beatId) {
    console.log(`❌ Transaction verification failed: beatId mismatch. Expected ${beatId}, got ${transaction.beatId}`)
    return false
  }
  console.log(`✅ Transaction verification passed: ${downloadToken}`)
  return true
}

// Health check function for debugging
export async function healthCheck(): Promise<{
  redis: boolean
  redisError: string | null
  memoryTransactions: number
  testWrite: boolean
  testRead: boolean
}> {
  const client = getRedisClient()
  const result = {
    redis: !!client,
    redisError: redisError,
    memoryTransactions: transactions.size,
    testWrite: false,
    testRead: false,
  }
  
  if (client) {
    try {
      // Test write
      const testKey = "health-check-test"
      await client.set(testKey, { test: true, timestamp: Date.now() }, { ex: 60 })
      result.testWrite = true
      
      // Test read
      const testValue = await client.get(testKey)
      result.testRead = !!testValue
      
      // Cleanup
      await client.del(testKey)
    } catch (error) {
      console.error("Health check error:", error)
    }
  }
  
  return result
}
