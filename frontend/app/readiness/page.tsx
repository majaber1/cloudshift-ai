'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
  const label = score >= 70 ? 'Ready' : score >= 50 ? 'Partial' : 'Critical'
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{width: score + '%'}}></div>
      </div>
      <span className="text-sm font-bold text-white w-8">{score}</span>
      <span className={`text-xs px-2 py-0.5 rounded-full ${score >= 70 ? 'bg-green-500/10 text-green-400' : score >= 50 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'}`}>{label}</span>
    </div>
  )
}

export default function ReadinessPage() {
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

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <p className="text-slate-400">Loading results...</p>
    </div>
  )

  const id = searchParams.get('id')
  const scores = data?.readiness?.category_scores || {}
  const overall = data?.readiness?.overall_score || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <header className="border-b border-blue-900/30 bg-slate-900/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm">← Dashboard</Link>
          <span className="text-white font-semibold">Readiness Assessment Results</span>
          <a href={`${API_URL}/reports/${id}/markdown`} target="_blank"
            className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Export Report
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {data?.assessment && (
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">{data.assessment.name}</h1>
            <p className="text-slate-400 mt-1">{data.assessment.organization}</p>
          </div>
        )}

        {/* Overall Score */}
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-8 mb-8 text-center">
          <p className="text-slate-400 mb-4">Overall Cloud Readiness Score</p>
          <div className={`text-7xl font-black mb-4 ${overall >= 70 ? 'text-green-400' : overall >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
            {overall}
            <span className="text-3xl text-slate-500">/100</span>
          </div>
          <div className={`inline-block px-6 py-2 rounded-full text-lg font-semibold ${overall >= 70 ? 'bg-green-500/20 text-green-400' : overall >= 50 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
            {overall >= 70 ? '✅ Cloud Ready' : overall >= 50 ? '⚠️ Partially Ready' : '❌ Not Ready'}
          </div>
          <div className="mt-6 flex gap-2 justify-center text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> 0-49: Critical Gaps</span>
            <span className="flex items-center gap-1 ml-4"><span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span> 50-69: Partially Ready</span>
            <span className="flex items-center gap-1 ml-4"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> 70-100: Cloud Ready</span>
          </div>
        </div>

        {/* Category Scores */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {Object.entries(scores).map(([cat, data]: any) => (
            <div key={cat} className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold">{cat}</h3>
              </div>
              <ScoreBar score={data.score} />
              {data.justification && <p className="text-slate-400 text-xs mt-3">{data.justification}</p>}
            </div>
          ))}
        </div>

        {/* Analysis Results */}
        {data?.analysis && (
          <div className="space-y-6">
            {[
              { key: 'migration_risks', title: '⚠️ Migration Risks', link: '/risks' },
              { key: 'landing_zone', title: '🏗️ Landing Zone Recommendations', link: '/recommendations' },
              { key: 'security_baseline', title: '🔒 Security Baseline', link: null },
              { key: 'compliance_gaps', title: '📋 Compliance Gaps', link: null },
            ].map(section => data.analysis[section.key] && (
              <div key={section.key} className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-6">
                <h2 className="text-white font-bold text-lg mb-4">{section.title}</h2>
                <div className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                  {data.analysis[section.key]}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
