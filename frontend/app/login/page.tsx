'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@demo.com')
  const [password, setPassword] = useState('demo123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password })
      Cookies.set('token', res.data.access_token, { expires: 1 })
      Cookies.set('user', JSON.stringify(res.data.user), { expires: 1 })
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center text-xl font-bold text-white">☁</div>
            <span className="text-xl font-bold text-white">CloudShift <span className="text-blue-400">AI</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Sign in to your account</h1>
          <p className="text-slate-400 mt-2">Access your cloud readiness assessments</p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="admin@demo.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
            <p className="text-xs text-slate-500 font-medium mb-2">Demo Credentials</p>
            <p className="text-xs text-slate-400">Email: <span className="text-blue-400">admin@demo.com</span></p>
            <p className="text-xs text-slate-400">Password: <span className="text-blue-400">demo123</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
