import { useState, useEffect } from 'react'

const TOOLS = [
  { id: 'cursor', name: 'Cursor', plans: ['Hobby', 'Pro', 'Business', 'Enterprise'] },
  { id: 'copilot', name: 'GitHub Copilot', plans: ['Individual', 'Business', 'Enterprise'] },
  { id: 'claude', name: 'Claude', plans: ['Free', 'Pro', 'Max', 'Team', 'Enterprise', 'API'] },
  { id: 'chatgpt', name: 'ChatGPT', plans: ['Plus', 'Team', 'Enterprise', 'API'] },
  { id: 'gemini', name: 'Gemini', plans: ['Pro', 'Ultra', 'API'] },
  { id: 'windsurf', name: 'Windsurf', plans: ['Free', 'Pro', 'Teams'] },
]

const DEFAULT_TOOL = { enabled: false, plan: '', seats: 1, monthlySpend: '' }

function App() {
  const [tools, setTools] = useState(() => {
    const saved = localStorage.getItem('auditTools')
    if (saved) return JSON.parse(saved)
    const initial = {}
    TOOLS.forEach(t => { initial[t.id] = { ...DEFAULT_TOOL } })
    return initial
  })

  const [teamSize, setTeamSize] = useState(() => localStorage.getItem('teamSize') || '')
  const [useCase, setUseCase] = useState(() => localStorage.getItem('useCase') || '')

  useEffect(() => {
    localStorage.setItem('auditTools', JSON.stringify(tools))
  }, [tools])

  useEffect(() => {
    localStorage.setItem('teamSize', teamSize)
    localStorage.setItem('useCase', useCase)
  }, [teamSize, useCase])

  const updateTool = (id, field, value) => {
    setTools(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Form submitted! We will build the audit engine next.')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">AI Spend Audit</h1>
        <p className="text-gray-400 text-center mb-8">Find out if you're overpaying for AI tools</p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Team Info */}
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

          {/* Tools */}
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
                <label htmlFor={tool.id} className="text-lg font-medium cursor-pointer">
                  {tool.name}
                </label>
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
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition"
          >
            Run My Audit →
          </button>

        </form>
      </div>
    </div>
  )
}

export default App