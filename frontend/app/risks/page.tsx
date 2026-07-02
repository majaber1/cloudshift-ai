'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function RisksPage() {
  const searchParams = useSearchParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const id = searchParams.get('id')
    if (!id) return
    const token = Cookies.get('token')
    if (!token) return
    axios.get(`${API_URL}/analysis/${id}/results`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const id = searchParams.get('id')

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><p className="text-slate-400">Loading risks...</p></div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <header className="border-b border-blue-900/30 bg-slate-900/50 backdrop-blur">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href={`/readiness?id=${id}`} className="text-slate-400 hover:text-white text-sm">← Back to Readiness</Link>
          <span className="text-white font-semibold">Migration Risk Analysis</span>
          <div className="w-32"></div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Migration Risks</h1>
          <p className="text-slate-400 mt-1">{data?.assessment?.organization}</p>
        </div>

        {data?.analysis?.migration_risks ? (
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-8">
            <div className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
              {data.analysis.migration_risks}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">No risk data available. Run analysis first.</div>
        )}
      </main>
    </div>
  )
}
