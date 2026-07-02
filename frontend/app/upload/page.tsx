'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const DOC_TYPES = [
  { value: 'discovery', label: 'Discovery Report' },
  { value: 'inventory', label: 'Infrastructure Inventory' },
  { value: 'architecture', label: 'Architecture Notes' },
  { value: 'compliance', label: 'Compliance Document' },
  { value: 'security', label: 'Security Policy' },
  { value: 'other', label: 'Other' },
]

export default function UploadPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [assessmentId, setAssessmentId] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', organization: '', description: '' })
  const [uploads, setUploads] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const id = searchParams.get('id')
    if (id) { setAssessmentId(parseInt(id)); setStep(2) }
  }, [])

  const token = () => Cookies.get('token') || ''

  const createAssessment = async () => {
    if (!form.name || !form.organization) return setMessage('Please fill in all required fields')
    try {
      const res = await axios.post(`${API_URL}/assessments/`, form, { headers: { Authorization: `Bearer ${token()}` } })
      setAssessmentId(res.data.id)
      setStep(2)
    } catch { setMessage('Failed to create assessment') }
  }

  const uploadFile = async (file: File, docType: string) => {
    if (!assessmentId) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('doc_type', docType)
    try {
      const res = await axios.post(`${API_URL}/assessments/${assessmentId}/upload`, fd, {
        headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'multipart/form-data' }
      })
      setUploads(prev => [...prev, { ...res.data, file_name: file.name, doc_type: docType }])
      setMessage('File uploaded successfully!')
    } catch { setMessage('Upload failed') }
    finally { setUploading(false) }
  }

  const runAnalysis = async () => {
    if (!assessmentId) return
    setAnalyzing(true)
    setMessage('Running AI analysis... this may take 2-5 minutes depending on model...')
    try {
      await axios.post(`${API_URL}/analysis/${assessmentId}/run`, {}, { headers: { Authorization: `Bearer ${token()}` }, timeout: 600000 })
      router.push(`/readiness?id=${assessmentId}`)
    } catch (e: any) { setMessage(e.response?.data?.detail || 'Analysis failed') }
    finally { setAnalyzing(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <header className="border-b border-blue-900/30 bg-slate-900/50 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm">← Back to Dashboard</Link>
          <span className="text-white font-semibold">New Assessment</span>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Steps */}
        <div className="flex items-center gap-4 mb-10">
          {['Create Assessment', 'Upload Documents', 'Run Analysis'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}`}>{step > i + 1 ? '✓' : i + 1}</div>
              <span className={`text-sm ${step === i + 1 ? 'text-white' : 'text-slate-500'}`}>{s}</span>
              {i < 2 && <span className="text-slate-600 ml-2">→</span>}
            </div>
          ))}
        </div>

        {message && <div className="mb-6 bg-blue-500/10 border border-blue-500/30 text-blue-300 px-4 py-3 rounded-lg text-sm">{message}</div>}

        {/* Step 1 */}
        {step === 1 && (
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Assessment Details</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Assessment Name *</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Q1 2025 Cloud Readiness Assessment" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Organization Name *</label>
                <input value={form.organization} onChange={e => setForm({...form, organization: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Ministry of Finance" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description (optional)</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 h-24 resize-none"
                  placeholder="Brief description of the assessment scope" />
              </div>
              <button onClick={createAssessment} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Create Assessment →
              </button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-8">
              <h2 className="text-xl font-bold text-white mb-2">Upload Documents</h2>
              <p className="text-slate-400 text-sm mb-6">Upload discovery reports, infrastructure inventories, architecture notes, or compliance documents (PDF, DOCX, TXT)</p>
              <FileUploader onUpload={uploadFile} uploading={uploading} />
            </div>

            {uploads.length > 0 && (
              <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Uploaded Files ({uploads.length})</h3>
                <div className="space-y-2">
                  {uploads.map((u, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <span className="text-green-400">✓</span>
                      <span className="text-white">{u.file_name}</span>
                      <span className="text-slate-500">({u.doc_type})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploads.length > 0 && (
              <button onClick={runAnalysis} disabled={analyzing}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-blue-500/20">
                {analyzing ? '🤖 Analyzing with AI... Please wait...' : '🚀 Run AI Analysis'}
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

function FileUploader({ onUpload, uploading }: { onUpload: (f: File, t: string) => void, uploading: boolean }) {
  const [file, setFile] = useState<File | null>(null)
  const [docType, setDocType] = useState('discovery')

  const handleSubmit = () => {
    if (file) { onUpload(file, docType); setFile(null) }
  }

  return (
    <div className="space-y-4">
      <select value={docType} onChange={e => setDocType(e.target.value)}
        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500">
        {DOC_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
      </select>
      <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
        <input type="file" accept=".pdf,.docx,.doc,.txt" onChange={e => setFile(e.target.files?.[0] || null)}
          className="w-full text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer" />
        {file && <p className="text-blue-400 text-sm mt-2">{file.name}</p>}
      </div>
      <button onClick={handleSubmit} disabled={!file || uploading}
        className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors">
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>
    </div>
  )
}
