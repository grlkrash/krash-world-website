// Simple in-memory transaction store
// For production, consider using Vercel KV, Redis, or a database

interface Transaction {
  transactionId: string
  beatId: string
  email: string
  beatTitle: string
  createdAt: number
  expiresAt: number
  downloaded: boolean
}

// In-memory store (clears on server restart)
// For production, use Vercel KV or similar
const transactions = new Map<string, Transaction>()

// Clean up expired transactions every hour
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now()
    for (const [key, transaction] of transactions.entries()) {
      if (transaction.expiresAt < now) {
        transactions.delete(key)
      }
    }
  }, 60 * 60 * 1000) // 1 hour
}

export function storeTransaction(
  transactionId: string,
  beatId: string,
  email: string,
  beatTitle: string,
  expiresInHours: number = 48,
): void {
  const now = Date.now()
  transactions.set(transactionId, {
    transactionId,
    beatId,
    email,
    beatTitle,
    createdAt: now,
    expiresAt: now + expiresInHours * 60 * 60 * 1000,
    downloaded: false,
  })
}

export function getTransaction(transactionId: string): Transaction | undefined {
  const transaction = transactions.get(transactionId)
  if (!transaction) return undefined

  // Check if expired
  if (transaction.expiresAt < Date.now()) {
    transactions.delete(transactionId)
    return undefined
  }

  return transaction
}

export function markAsDownloaded(transactionId: string): boolean {
  const transaction = transactions.get(transactionId)
  if (!transaction) return false

  transaction.downloaded = true
  return true
}

export function verifyTransaction(transactionId: string, beatId: string): boolean {
  const transaction = getTransaction(transactionId)
  if (!transaction) return false
  if (transaction.beatId !== beatId) return false
  return true
}
