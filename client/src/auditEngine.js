// PRICING DATA — sourced from official pages (see PRICING_DATA.md)
const PRICING = {
  cursor: {
    Hobby: { pricePerSeat: 0, limit: 1 },
    Pro: { pricePerSeat: 20 },
    Business: { pricePerSeat: 40 },
    Enterprise: { pricePerSeat: 100 },
  },
  copilot: {
    Individual: { pricePerSeat: 10 },
    Business: { pricePerSeat: 19 },
    Enterprise: { pricePerSeat: 39 },
  },
  claude: {
    Free: { pricePerSeat: 0 },
    Pro: { pricePerSeat: 20 },
    Max: { pricePerSeat: 100 },
    Team: { pricePerSeat: 30, minSeats: 5 },
    Enterprise: { pricePerSeat: 60 },
    API: { pricePerSeat: 0 }, // usage based
  },
  chatgpt: {
    Plus: { pricePerSeat: 20 },
    Team: { pricePerSeat: 30, minSeats: 2 },
    Enterprise: { pricePerSeat: 60 },
    API: { pricePerSeat: 0 }, // usage based
  },
  gemini: {
    Pro: { pricePerSeat: 20 },
    Ultra: { pricePerSeat: 30 },
    API: { pricePerSeat: 0 },
  },
  windsurf: {
    Free: { pricePerSeat: 0 },
    Pro: { pricePerSeat: 15 },
    Teams: { pricePerSeat: 35 },
  },
}

function auditCursor(tool, teamSize) {
  const { plan, seats, monthlySpend } = tool
  const results = []
  let savings = 0

  if (plan === 'Business' && seats <= 3) {
    const saving = (40 - 20) * seats
    savings += saving
    results.push({
      type: 'downgrade',
      message: `With only ${seats} seats, Cursor Pro ($20/seat) fits your team just as well as Business ($40/seat).`,
      saving,
    })
  }

  if (plan === 'Pro' && teamSize >= 10 && useCase === 'coding') {
    results.push({
      type: 'info',
      message: 'At 10+ developers, consider Claude Code or Windsurf as alternatives — similar capability, different pricing.',
      saving: 0,
    })
  }

  return { toolName: 'Cursor', results, savings }
}

function auditCopilot(tool, teamSize, useCase) {
  const { plan, seats } = tool
  const results = []
  let savings = 0

  if (plan === 'Enterprise' && seats <= 5) {
    const saving = (39 - 19) * seats
    savings += saving
    results.push({
      type: 'downgrade',
      message: `GitHub Copilot Business ($19/seat) has the same core features for teams under 10. Enterprise adds SSO and audit logs you likely don't need yet.`,
      saving,
    })
  }

  if (plan === 'Individual' && seats > 1) {
    results.push({
      type: 'warning',
      message: `You have ${seats} seats on Individual plan — Individual is per-person only. You may be violating ToS. Switch to Business.`,
      saving: 0,
    })
  }

  return { toolName: 'GitHub Copilot', results, savings }
}

function auditClaude(tool, teamSize) {
  const { plan, seats } = tool
  const results = []
  let savings = 0

  if (plan === 'Team' && seats < 5) {
    const saving = (30 - 20) * seats
    savings += saving
    results.push({
      type: 'downgrade',
      message: `Claude Team requires a minimum of 5 seats but you have ${seats}. You're paying $30/seat when Pro at $20/seat covers your actual usage.`,
      saving,
    })
  }

  if (plan === 'Max' && seats > 3) {
    const saving = (100 - 30) * seats
    savings += saving
    results.push({
      type: 'downgrade',
      message: `Claude Max ($100/seat) is for very heavy individual users. For a team of ${seats}, Claude Team ($30/seat) provides shared value at much lower cost.`,
      saving,
    })
  }

  return { toolName: 'Claude', results, savings }
}

function auditChatGPT(tool, teamSize) {
  const { plan, seats } = tool
  const results = []
  let savings = 0

  if (plan === 'Team' && seats < 5) {
    results.push({
      type: 'info',
      message: `ChatGPT Team at $30/seat is reasonable for small teams. If your use case is mostly coding, Cursor Pro ($20/seat) may replace this entirely.`,
      saving: 0,
    })
  }

  if (plan === 'Plus' && seats > 3) {
    const saving = (20 - 0) * seats
    results.push({
      type: 'warning',
      message: `Multiple ChatGPT Plus subscriptions — consider consolidating into Team plan for better admin control.`,
      saving: 0,
    })
  }

  return { toolName: 'ChatGPT', results, savings }
}

function auditGemini(tool, teamSize, useCase) {
  const { plan, seats } = tool
  const results = []
  let savings = 0

  if (plan === 'Ultra' && useCase !== 'research' && useCase !== 'data') {
    const saving = (30 - 20) * seats
    savings += saving
    results.push({
      type: 'downgrade',
      message: `Gemini Ultra ($30/seat) is overkill unless you're doing heavy research or data work. Gemini Pro ($20/seat) covers coding and writing tasks well.`,
      saving,
    })
  }

  return { toolName: 'Gemini', results, savings }
}

function auditWindsurf(tool, teamSize) {
  const { plan, seats } = tool
  const results = []
  let savings = 0

  if (plan === 'Teams' && seats <= 3) {
    const saving = (35 - 15) * seats
    savings += saving
    results.push({
      type: 'downgrade',
      message: `Windsurf Teams ($35/seat) is designed for larger teams. With ${seats} seats, Pro ($15/seat) gives you the same AI features.`,
      saving,
    })
  }

  return { toolName: 'Windsurf', results, savings }
}

export function runAudit(tools, teamSize, useCase) {
  const audits = []
  let totalMonthlySavings = 0

  if (tools.cursor?.enabled) {
    const result = auditCursor(tools.cursor, teamSize, useCase)
    audits.push(result)
    totalMonthlySavings += result.savings
  }
  if (tools.copilot?.enabled) {
    const result = auditCopilot(tools.copilot, teamSize, useCase)
    audits.push(result)
    totalMonthlySavings += result.savings
  }
  if (tools.claude?.enabled) {
    const result = auditClaude(tools.claude, teamSize, useCase)
    audits.push(result)
    totalMonthlySavings += result.savings
  }
  if (tools.chatgpt?.enabled) {
    const result = auditChatGPT(tools.chatgpt, teamSize, useCase)
    audits.push(result)
    totalMonthlySavings += result.savings
  }
  if (tools.gemini?.enabled) {
    const result = auditGemini(tools.gemini, teamSize, useCase)
    audits.push(result)
    totalMonthlySavings += result.savings
  }
  if (tools.windsurf?.enabled) {
    const result = auditWindsurf(tools.windsurf, teamSize, useCase)
    audits.push(result)
    totalMonthlySavings += result.savings
  }

  return {
    audits,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
  }
}