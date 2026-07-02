'use client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function ReportPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <header className="border-b border-blue-900/30 bg-slate-900/50 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href={`/readiness?id=${id}`} className="text-slate-400 hover:text-white text-sm">← Back to Readiness</Link>
          <span className="text-white font-semibold">Export Report</span>
          <div className="w-32"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 text-center">
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-12">
          <div className="text-6xl mb-6">📄</div>
          <h1 className="text-2xl font-bold text-white mb-4">Export Executive Report</h1>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Generate an AI-written executive summary with all findings, scores, and recommendations
            in Markdown format — ready for board presentation.
          </p>
          <div className="space-y-4">
            <a href={`${API_URL}/reports/${id}/markdown`} target="_blank"
              className="block w-full max-w-xs mx-auto bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-blue-500/20">
              📥 Download Markdown Report
            </a>
            <a href={`${API_URL}/reports/${id}/summary`} target="_blank"
              className="block w-full max-w-xs mx-auto border border-blue-800 hover:border-blue-600 text-blue-400 hover:text-blue-300 py-3 rounded-xl font-medium transition-colors">
              View JSON Summary
            </a>
          </div>
          <p className="text-slate-500 text-sm mt-8">
            The report includes AI-generated executive summary, readiness scores, risk analysis, security baseline, compliance gaps, and landing zone recommendations.
          </p>
        </div>
      </main>
    </div>
  )
}
