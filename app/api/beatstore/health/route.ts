import { NextResponse } from "next/server"
import { healthCheck } from "@/app/services/beatstore/transaction-store"

export async function GET() {
  console.log("🏥 Health check endpoint called")
  
  try {
    const status = await healthCheck()
    
    console.log("🏥 Health check results:", status)
    
    // Check environment variables
    const envCheck = {
      KV_REST_API_URL: !!process.env.KV_REST_API_URL,
      KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
      UPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN: !!process.env.UPSTASH_REDIS_REST_TOKEN,
      AWS_ACCESS_KEY_ID: !!process.env.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: !!process.env.AWS_SECRET_ACCESS_KEY,
      S3_BUCKET_NAME: !!process.env.S3_BUCKET_NAME,
      AWS_REGION: !!process.env.AWS_REGION,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "(not set)",
      NODE_ENV: process.env.NODE_ENV,
    }
    
    const allGood = status.redis && status.testWrite && status.testRead
    
    return NextResponse.json({
      status: allGood ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      redis: {
        connected: status.redis,
        error: status.redisError,
        testWrite: status.testWrite,
        testRead: status.testRead,
      },
      memory: {
        transactionCount: status.memoryTransactions,
      },
      environment: envCheck,
      recommendation: !status.redis 
        ? "Redis not connected. Check KV_REST_API_URL and KV_REST_API_TOKEN environment variables in Vercel."
        : !status.testWrite || !status.testRead
        ? "Redis connected but read/write tests failed. Check Redis permissions."
        : "All systems operational",
    }, {
      status: allGood ? 200 : 503,
    })
  } catch (error) {
    console.error("❌ Health check failed:", error)
    return NextResponse.json({
      status: "error",
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

