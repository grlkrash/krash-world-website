// Transaction store with Vercel KV support and in-memory fallback
// Vercel KV provides persistent storage across serverless function invocations

import { kv } from "@vercel/kv"

interface Transaction {
  transactionId: string
  beatId: string
  email: string
  beatTitle: string
  createdAt: number
  expiresAt: number
  downloaded: boolean
}

// In-memory fallback store (used if Vercel KV is not configured)
// WARNING: This doesn't work reliably on Vercel serverless functions
// because each invocation may run on a different instance
const transactions = new Map<string, Transaction>()

// Check if Vercel KV is available
let kvAvailable = false
try {
  // Test KV connection (will fail if not configured)
  kvAvailable = typeof process.env.KV_REST_API_URL !== "undefined" && 
                typeof process.env.KV_REST_API_TOKEN !== "undefined"
} catch {
  kvAvailable = false
}

const KV_PREFIX = "transaction:"
const KV_TTL = 48 * 60 * 60 // 48 hours in seconds

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

  // Try Vercel KV first
  if (kvAvailable) {
    try {
      const ttl = expiresInHours * 60 * 60 // Convert to seconds
      await kv.set(getKVKey(transactionId), transaction, { ex: ttl })
      console.log(`✅ Transaction ${transactionId} stored in Vercel KV`)
      return
    } catch (error) {
      console.error(`❌ Failed to store transaction in KV, falling back to memory:`, error)
    }
  }

  // Fallback to in-memory (not reliable on serverless)
  transactions.set(transactionId, transaction)
  console.log(`⚠️ Transaction ${transactionId} stored in memory (KV not available - may not persist across invocations)`)
}

export async function getTransaction(transactionId: string): Promise<Transaction | undefined> {
  // Try Vercel KV first
  if (kvAvailable) {
    try {
      const transaction = await kv.get<Transaction>(getKVKey(transactionId))
      if (!transaction) {
        console.log(`🔍 Transaction ${transactionId} not found in KV`)
        return undefined
      }

      // Check if expired
      if (transaction.expiresAt < Date.now()) {
        await kv.del(getKVKey(transactionId))
        console.log(`⏰ Transaction ${transactionId} expired`)
        return undefined
      }

      console.log(`✅ Transaction ${transactionId} found in KV`)
      return transaction
    } catch (error) {
      console.error(`❌ Failed to get transaction from KV, falling back to memory:`, error)
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

  // Update in KV or memory
  if (kvAvailable) {
    try {
      const remainingTtl = Math.max(0, Math.floor((transaction.expiresAt - Date.now()) / 1000))
      if (remainingTtl > 0) {
        await kv.set(getKVKey(transactionId), transaction, { ex: remainingTtl })
      }
      return true
    } catch (error) {
      console.error(`❌ Failed to update transaction in KV:`, error)
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
