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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})