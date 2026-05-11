import { useState, useEffect } from 'react'
import { runAudit } from './auditEngine'

const TOOLS = [
  { id: 'cursor', name: 'Cursor', plans: ['Hobby', 'Pro', 'Business', 'Enterprise'] },
  { id: 'copilot', name: 'GitHub Copilot', plans: ['Individual', 'Business', 'Enterprise'] },
  { id: 'claude', name: 'Claude', plans: ['Free', 'Pro', 'Max', 'Team', 'Enterprise', 'API'] },
  { id: 'chatgpt', name: 'ChatGPT', plans: ['Plus', 'Team', 'Enterprise', 'API'] },
  { id: 'gemini', name: 'Gemini', plans: ['Pro', 'Ultra', 'API'] },
  { id: 'windsurf', name: 'Windsurf', plans: ['Free', 'Pro', 'Teams'] },
]

const DEFAULT_TOOL = { enabled: false, plan: '', seats: 1, monthlySpend: '' }

export default function App() {
  const [tools, setTools] = useState(() => {
    const saved = localStorage.getItem('auditTools')
    if (saved) return JSON.parse(saved)
    const initial = {}
    TOOLS.forEach(t => { initial[t.id] = { ...DEFAULT_TOOL } })
    return initial
  })
  const [teamSize, setTeamSize] = useState(() => localStorage.getItem('teamSize') || '')
  const [useCase, setUseCase] = useState(() => localStorage.getItem('useCase') || '')
  const [auditResult, setAuditResult] = useState(null)
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [summary, setSummary] = useState('')
  const [shareUrl, setShareUrl] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { localStorage.setItem('auditTools', JSON.stringify(tools)) }, [tools])
  useEffect(() => { localStorage.setItem('teamSize', teamSize) }, [teamSize])
  useEffect(() => { localStorage.setItem('useCase', useCase) }, [useCase])

  const updateTool = (id, field, value) => {
    setTools(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = runAudit(tools, parseInt(teamSize), useCase)
    setAuditResult(result)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    try {
      const res = await fetch('https://ai-spend-audit-8tq2.onrender.com/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audits: result.audits,
          totalMonthlySavings: result.totalMonthlySavings,
          totalAnnualSavings: result.totalAnnualSavings,
          useCase,
          teamSize,
        })
      })
      const data = await res.json()
      setSummary(data.summary)
    } catch (err) {
      setSummary('Your team could save money by optimizing your AI subscriptions. Review the recommendations above.')
    }

    try {
      const auditRes = await fetch('https://ai-spend-audit-8tq2.onrender.com/api/audits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tools,
          teamSize: parseInt(teamSize),
          useCase,
          monthlySavings: result.totalMonthlySavings,
          annualSavings: result.totalAnnualSavings,
          auditResults: result.audits,
        })
      })
      const auditData = await auditRes.json()
      setShareUrl(`${window.location.origin}/audit/${auditData.shareId}`)
    } catch (err) {
      console.error('Failed to save audit:', err)
    }

    setLoading(false)
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    try {
      await fetch('https://ai-spend-audit-8tq2.onrender.com/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          tools,
          teamSize: parseInt(teamSize),
          useCase,
          monthlySavings: auditResult.totalMonthlySavings,
          annualSavings: auditResult.totalAnnualSavings,
        })
      })
    } catch (err) {
      console.error('Failed to save lead:', err)
    }
    setEmailSubmitted(true)
  }

  if (auditResult) {
    const { audits, totalMonthlySavings, totalAnnualSavings } = auditResult
    const isOverspending = totalMonthlySavings > 100
    const isOptimal = totalMonthlySavings < 100

    return (
      <div className="min-h-screen bg-gray-950 text-white p-6">
        <div className="max-w-2xl mx-auto space-y-6">

          <div className="text-center py-8">
            <p className="text-gray-400 text-sm mb-2">YOUR AUDIT RESULTS</p>
            <h1 className="text-5xl font-black text-green-400 mb-1">
              ${totalMonthlySavings.toLocaleString()}/mo
            </h1>
            <p className="text-gray-300 text-lg">
              potential savings &middot; <span className="text-green-300 font-semibold">${totalAnnualSavings.toLocaleString()} annually</span>
            </p>
          </div>

          {summary && (
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
              <h3 className="text-sm text-gray-400 mb-2">AI ANALYSIS</h3>
              <p className="text-gray-200 leading-relaxed">{summary}</p>
            </div>
          )}

          {isOverspending && (
            <div className="bg-green-900 border border-green-500 rounded-xl p-5">
              <h2 className="text-green-300 font-bold text-lg mb-1">You could save even more with Credex</h2>
              <p className="text-gray-300 text-sm mb-3">
                Credex sells discounted AI credits — same tools, lower price. Companies saving $500+/mo typically save an additional 20-40% through credits.
              </p>
              <a
                href="https://credex.rocks"
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-green-500 hover:bg-green-400 text-black font-bold px-5 py-2 rounded-lg transition"
              >
                Book a Credex Consultation &rarr;
              </a>
            </div>
          )}

          {isOptimal && (
            <div className="bg-blue-900 border border-blue-500 rounded-xl p-5">
              <h2 className="text-blue-300 font-bold text-lg mb-1">You are spending well</h2>
              <p className="text-gray-300 text-sm">
                Your current AI stack looks optimized. We will notify you when new savings opportunities apply to your tools.
              </p>
            </div>
          )}

          {audits.map((audit, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-5">
              <h3 className="font-bold text-lg mb-3">{audit.toolName}</h3>
              {audit.results.length === 0 ? (
                <p className="text-gray-400 text-sm">Looking good — no issues found.</p>
              ) : (
                audit.results.map((r, j) => (
                  <div key={j} className="flex items-start gap-3 mb-3">
                    <span className="text-xl">
                      {r.type === 'downgrade' ? '⬇️' : r.type === 'warning' ? '⚠️' : 'ℹ️'}
                    </span>
                    <div>
                      <p className="text-sm text-gray-300">{r.message}</p>
                      {r.saving > 0 && (
                        <p className="text-green-400 font-semibold text-sm mt-1">
                          Save ${r.saving}/mo
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ))}

          {!emailSubmitted ? (
            <div className="bg-gray-900 rounded-xl p-5">
              <h3 className="font-bold text-lg mb-1">Get your full report</h3>
              <p className="text-gray-400 text-sm mb-3">We will email you a copy and alert you when new savings apply.</p>
              <form onSubmit={handleEmailSubmit} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-white"
                />
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-2 rounded-lg transition"
                >
                  Send
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-xl p-5 text-center">
              <p className="text-green-400 font-bold">Report sent to {email}</p>
            </div>
          )}

          {shareUrl && (
            <div className="bg-gray-900 rounded-xl p-5">
              <h3 className="font-bold text-lg mb-2">Share your audit</h3>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-gray-300 text-sm"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(shareUrl)}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded-lg transition"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setAuditResult(null)}
            className="w-full border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white py-3 rounded-xl transition"
          >
            &larr; Edit my inputs
          </button>

        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">AI Spend Audit</h1>
        <p className="text-gray-400 text-center mb-8">Find out if you are overpaying for AI tools</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-900 rounded-xl p-5 space-y-4">
            <h2 className="text-lg font-semibold">Your Team</h2>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm text-gray-400 mb-1 block">Team Size</label>
                <input
                  type="number"
                  min="1"
                  value={teamSize}
                  onChange={e => setTeamSize(e.target.value)}
                  placeholder="e.g. 5"
                  className="w-full bg-gray-800 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-gray-400 mb-1 block">Primary Use Case</label>
                <select
                  value={useCase}
                  onChange={e => setUseCase(e.target.value)}
                  className="w-full bg-gray-800 rounded-lg px-3 py-2 text-white"
                >
                  <option value="">Select...</option>
                  <option value="coding">Coding</option>
                  <option value="writing">Writing</option>
                  <option value="data">Data</option>
                  <option value="research">Research</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
            </div>
          </div>

          {TOOLS.map(tool => (
            <div key={tool.id} className="bg-gray-900 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  id={tool.id}
                  checked={tools[tool.id].enabled}
                  onChange={e => updateTool(tool.id, 'enabled', e.target.checked)}
                  className="w-4 h-4 accent-green-500"
                />
                <label htmlFor={tool.id} className="text-lg font-medium cursor-pointer">{tool.name}</label>
              </div>
              {tools[tool.id].enabled && (
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Plan</label>
                    <select
                      value={tools[tool.id].plan}
                      onChange={e => updateTool(tool.id, 'plan', e.target.value)}
                      className="w-full bg-gray-800 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="">Select...</option>
                      {tool.plans.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Seats</label>
                    <input
                      type="number"
                      min="1"
                      value={tools[tool.id].seats}
                      onChange={e => updateTool(tool.id, 'seats', parseInt(e.target.value))}
                      className="w-full bg-gray-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Monthly Spend ($)</label>
                    <input
                      type="number"
                      min="0"
                      value={tools[tool.id].monthlySpend}
                      onChange={e => updateTool(tool.id, 'monthlySpend', e.target.value)}
                      placeholder="0"
                      className="w-full bg-gray-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white font-bold py-3 rounded-xl transition"
          >
            {loading ? 'Analysing your stack...' : 'Run My Audit'}
          </button>
        </form>
      </div>
    </div>
  )
}