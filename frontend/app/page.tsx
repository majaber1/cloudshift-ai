import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-blue-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-blue-500/20">
              ☁
            </div>
            <span className="text-xl font-bold text-white">CloudShift <span className="text-blue-400">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </div>
          <Link href="/login" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-blue-500/20">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm px-4 py-2 rounded-full mb-8">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
          Powered by Local AI — No Cloud API Required
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Cloud Migration
          <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Readiness Assessment
          </span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          Upload your infrastructure documents and get an AI-powered readiness score across 10 categories,
          migration risks, security gaps, and executive-ready reports — all running locally.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50">
            Start Free Assessment
          </Link>
          <a href="#features" className="border border-blue-800 hover:border-blue-600 text-slate-300 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all">
            Learn More
          </a>
        </div>

        {/* Score Preview */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
          {[
            {cat: "Compute", score: 78, color: "blue"},
            {cat: "Security", score: 55, color: "yellow"},
            {cat: "Network", score: 82, color: "green"},
            {cat: "Compliance", score: 43, color: "red"},
            {cat: "Identity", score: 71, color: "purple"},
          ].map((item) => (
            <div key={item.cat} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{item.score}</div>
              <div className="text-sm text-slate-400 mt-1">{item.cat}</div>
              <div className="mt-2 h-1.5 bg-slate-700 rounded-full">
                <div className="h-full bg-blue-500 rounded-full" style={{width: item.score + "%"}}></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Everything you need for cloud readiness</h2>
        <p className="text-slate-400 text-center mb-12">Upload documents, get scores, export board-ready reports</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {icon: "📊", title: "10-Category Readiness Score", desc: "Compute, Storage, Network, Security, Identity, Backup, DR, Monitoring, Cost, Compliance — all scored 0-100"},
            {icon: "⚠️", title: "Migration Risk Analysis", desc: "AI identifies technical, operational, and compliance risks before you start migrating"},
            {icon: "🔒", title: "Security Baseline Check", desc: "Evaluate your security posture against cloud security frameworks and best practices"},
            {icon: "📋", title: "Compliance Gap Analysis", desc: "Check gaps against ISO 27001, NCA ECC, PDPL, SAMA, and other GCC frameworks"},
            {icon: "🏗️", title: "Landing Zone Design", desc: "Get customized landing zone architecture recommendations based on your environment"},
            {icon: "📄", title: "Executive Report Export", desc: "One-click Markdown export with AI-written executive summary ready for board presentation"},
          ].map((f) => (
            <div key={f.title} className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-6 hover:border-blue-600/40 transition-colors">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Straightforward Pricing</h2>
        <p className="text-slate-400 text-center mb-12">One assessment or a full migration program</p>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {name: "Quick Assessment", price: "SAR 5,000", period: "one-time", features: ["1 organization", "Full 10-category score", "Risk analysis", "PDF report", "2-week turnaround"], highlight: false},
            {name: "Migration Ready", price: "SAR 15,000", period: "package", features: ["Up to 3 departments", "Full assessment suite", "Landing zone design", "Security baseline", "Compliance gaps", "60-day support"], highlight: true},
            {name: "Enterprise Program", price: "SAR 50,000", period: "custom", features: ["Unlimited assessments", "Wave planning", "Architecture review", "Compliance roadmap", "On-site workshops", "Dedicated consultant"], highlight: false},
          ].map((plan) => (
            <div key={plan.name} className={`rounded-xl p-6 border ${plan.highlight ? 'bg-blue-600/20 border-blue-500' : 'bg-slate-800/40 border-slate-700/40'}`}>
              <h3 className="text-white font-bold text-xl mb-1">{plan.name}</h3>
              <div className="text-3xl font-bold text-blue-400 mb-1">{plan.price}</div>
              <div className="text-slate-500 text-sm mb-6">{plan.period}</div>
              <ul className="space-y-2 mb-8">
                {plan.features.map(f => <li key={f} className="text-slate-300 text-sm flex gap-2"><span className="text-blue-400">✓</span>{f}</li>)}
              </ul>
              <Link href="/login" className={`block text-center py-3 rounded-lg font-semibold transition-colors ${plan.highlight ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'border border-blue-800 hover:border-blue-600 text-blue-400'}`}>
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-900/30 py-8 text-center text-slate-500 text-sm">
        <p>CloudShift AI — Powered by Ollama (qwen2.5:7b) — No paid APIs required</p>
        <p className="mt-2">Built for government entities, enterprises, and cloud consulting companies</p>
      </footer>
    </div>
  )
}
