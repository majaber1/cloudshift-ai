'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function Dashboard() {
  const router = useRouter()
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) { router.push('/login'); return }
    const userData = Cookies.get('user')
    if (userData) setUser(JSON.parse(userData))
    fetchAssessments(token)
  }, [])

  const fetchAssessments = async (token: string) => {
    try {
      const res = await axios.get(`${API_URL}/assessments/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAssessments(res.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleLogout = () => { Cookies.remove('token'); Cookies.remove('user'); router.push('/login') }

  const stats = [
    { label: 'Total Assessments', value: assessments.length, icon: '📋', color: 'blue' },
    { label: 'Analyzed', value: assessments.filter((a: any) => a.status === 'analyzed').length, icon: '✅', color: 'green' },
    { label: 'In Progress', value: assessments.filter((a: any) => a.status === 'pending').length, icon: '🔄', color: 'yellow' },
    { label: 'Avg Score', value: '—', icon: '📊', color: 'purple' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-blue-900/30 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center text-lg font-bold text-white">☁</div>
            <span className="text-lg font-bold text-white">CloudShift <span className="text-blue-400">AI</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/dashboard" className="text-white font-medium">Dashboard</Link>
            <Link href="/upload" className="text-slate-400 hover:text-white transition-colors">New Assessment</Link>
          </nav>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">{user?.email}</span>
            <button onClick={handleLogout} className="text-sm text-slate-400 hover:text-white transition-colors">Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Assessment Dashboard</h1>
            <p className="text-slate-400 mt-1">Manage your cloud migration readiness assessments</p>
          </div>
          <Link href="/upload" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-lg shadow-blue-500/20">
            + New Assessment
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Assessments List */}
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700/40 flex items-center justify-between">
            <h2 className="text-white font-semibold">Your Assessments</h2>
          </div>
          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading assessments...</div>
          ) : assessments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 mb-4">No assessments yet</p>
              <Link href="/upload" className="text-blue-400 hover:text-blue-300 font-medium">
                Create your first assessment →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/30">
              {assessments.map((a: any) => (
                <div key={a.id} className="px-6 py-4 hover:bg-slate-700/20 transition-colors flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">{a.name}</h3>
                    <p className="text-slate-400 text-sm">{a.organization} · {new Date(a.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${a.status === 'analyzed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                      {a.status}
                    </span>
                    {a.status === 'analyzed' ? (
                      <Link href={`/readiness?id=${a.id}`} className="text-blue-400 hover:text-blue-300 text-sm font-medium">View Results →</Link>
                    ) : (
                      <Link href={`/upload?id=${a.id}`} className="text-slate-400 hover:text-white text-sm">Continue →</Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
