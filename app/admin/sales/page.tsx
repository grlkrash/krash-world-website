"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, DollarSign, TrendingUp, Music, RefreshCw, Lock, Unlock, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Sale {
  id: string
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

interface SalesData {
  success: boolean
  count: number
  stats: {
    totalSales: number
    totalRevenue: number
    salesLast24h: number
    revenueLast24h: number
  }
  topBeats: { beatId: string; beatTitle: string; count: number }[]
  sales: Sale[]
}

export default function AdminSalesPage() {
  const [apiKey, setApiKey] = useState("")
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [salesData, setSalesData] = useState<SalesData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check for saved API key on mount
  useEffect(() => {
    const savedKey = sessionStorage.getItem("admin-api-key")
    if (savedKey) {
      setApiKey(savedKey)
      fetchSales(savedKey)
    }
  }, [])

  const fetchSales = async (key: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/sales?action=recent&limit=50&key=${encodeURIComponent(key)}`)
      
      if (response.status === 401) {
        setError("Invalid API key")
        setIsAuthorized(false)
        sessionStorage.removeItem("admin-api-key")
        return
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      setSalesData(data)
      setIsAuthorized(true)
      sessionStorage.setItem("admin-api-key", key)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch sales")
      setIsAuthorized(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (apiKey.trim()) {
      fetchSales(apiKey.trim())
    }
  }

  const handleLogout = () => {
    setIsAuthorized(false)
    setSalesData(null)
    setApiKey("")
    sessionStorage.removeItem("admin-api-key")
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const maskEmail = (email: string) => {
    const [local, domain] = email.split("@")
    return local.substring(0, 3) + "***@" + domain
  }

  // Auth screen
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#ffda0f]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-[#ffda0f]" />
            </div>
            <h1 className="text-2xl font-black text-[#ffda0f]">SALES DASHBOARD</h1>
            <p className="text-gray-400 text-sm mt-2">Enter your admin API key to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Admin API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white"
            />
            
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <Button
              type="submit"
              disabled={isLoading || !apiKey.trim()}
              className="w-full bg-[#ffda0f] text-black hover:bg-[#ffda0f]/80 font-bold"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Unlock className="mr-2 h-4 w-4" />
                  Access Dashboard
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/" className="text-gray-500 text-sm hover:text-gray-400">
              ← Back to site
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-white">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-black text-[#ffda0f]">SALES DASHBOARD</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => fetchSales(apiKey)}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="border-gray-700 text-gray-300 hover:text-white"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        {salesData?.stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="h-5 w-5 text-[#00ff88]" />
                <span className="text-gray-400 text-sm">Total Revenue</span>
              </div>
              <div className="text-2xl font-black text-[#00ff88]">
                ${salesData.stats.totalRevenue.toFixed(0)}
              </div>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="h-5 w-5 text-[#ffda0f]" />
                <span className="text-gray-400 text-sm">Total Sales</span>
              </div>
              <div className="text-2xl font-black text-[#ffda0f]">
                {salesData.stats.totalSales}
              </div>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-purple-400" />
                <span className="text-gray-400 text-sm">Last 24h</span>
              </div>
              <div className="text-2xl font-black text-purple-400">
                ${salesData.stats.revenueLast24h.toFixed(0)}
              </div>
              <div className="text-xs text-gray-500">
                {salesData.stats.salesLast24h} sales
              </div>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Music className="h-5 w-5 text-cyan-400" />
                <span className="text-gray-400 text-sm">Top Beat</span>
              </div>
              <div className="text-lg font-bold text-cyan-400 truncate">
                {salesData.topBeats[0]?.beatTitle || "—"}
              </div>
              <div className="text-xs text-gray-500">
                {salesData.topBeats[0]?.count || 0} sales
              </div>
            </div>
          </div>
        )}

        {/* Top Beats */}
        {salesData?.topBeats && salesData.topBeats.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-white mb-4">🔥 Top Selling Beats</h2>
            <div className="flex flex-wrap gap-2">
              {salesData.topBeats.map((beat, i) => (
                <div
                  key={beat.beatId}
                  className="bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-2 flex items-center gap-3"
                >
                  <span className="text-[#ffda0f] font-bold">#{i + 1}</span>
                  <span className="text-white">{beat.beatTitle}</span>
                  <span className="text-gray-500 text-sm">({beat.count} sales)</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sales Table */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-lg font-bold text-white">Recent Sales</h2>
          </div>
          
          {salesData?.sales && salesData.sales.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr className="text-left text-xs text-gray-400 uppercase">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Beat</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {salesData.sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-800/30">
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {formatDate(sale.timestamp)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-white font-medium">{sale.beatTitle}</span>
                        <span className="text-gray-500 text-xs ml-2">({sale.beatId})</span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm">
                        {maskEmail(sale.email)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[#00ff88] font-bold">${sale.amount}</span>
                        {sale.bundleDiscount > 0 && (
                          <span className="text-gray-500 text-xs ml-1">
                            (-${sale.bundleDiscount})
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {sale.isBundle ? (
                          <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded">
                            Bundle
                          </span>
                        ) : (
                          <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                            Single
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No sales recorded yet</p>
              <p className="text-sm mt-2">Sales will appear here after your first purchase</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
