const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const app = express()
const PORT = process.env.PORT || 5000

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'AI Spend Audit API is running!' })
})

app.post('/api/leads', async (req, res) => {
  const { email, tools, teamSize, useCase, monthlySavings, annualSavings } = req.body

  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  const { data, error } = await supabase
    .from('leads')
    .insert([{
      email,
      tools,
      team_size: teamSize,
      use_case: useCase,
      monthly_savings: monthlySavings,
      annual_savings: annualSavings,
    }])
    .select()

  if (error) {
    console.error('Supabase error:', error)
    return res.status(500).json({ error: 'Failed to save lead' })
  }

  res.json({ success: true, data })
})

const Anthropic = require('@anthropic-ai/sdk')

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

app.post('/api/summary', async (req, res) => {
  const { audits, totalMonthlySavings, totalAnnualSavings, useCase, teamSize } = req.body

  try {
    const auditText = audits.map(a => 
      `${a.toolName}: ${a.results.length === 0 ? 'optimal' : a.results.map(r => r.message).join('. ')}`
    ).join('\n')

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: `You are an AI spend advisor. Write a 100-word personalized summary for a team of ${teamSize} people whose primary use case is ${useCase}. 

Their audit results are:
${auditText}

Total potential savings: $${totalMonthlySavings}/month ($${totalAnnualSavings}/year).

Write a friendly, specific, actionable summary. No bullet points. Just a paragraph.`
      }]
    })

    res.json({ summary: message.content[0].text })
  } catch (err) {
    console.error('Anthropic error:', err)
    // Fallback summary if API fails
    res.json({ 
      summary: `Based on your audit, your team of ${teamSize} could save $${totalMonthlySavings}/month by optimizing your AI tool subscriptions. Review the recommendations above to reduce your annual AI spend by $${totalAnnualSavings}.` 
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})