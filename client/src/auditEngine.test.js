import { describe, it, expect } from 'vitest'
import { runAudit } from './auditEngine'

describe('Audit Engine Tests', () => {

  it('should flag Cursor Business with 2 seats as overspending', () => {
    const tools = {
      cursor: { enabled: true, plan: 'Business', seats: 2, monthlySpend: 80 }
    }
    const result = runAudit(tools, 3, 'coding')
    expect(result.totalMonthlySavings).toBe(40)
  })

  it('should not flag Cursor Pro as overspending', () => {
    const tools = {
      cursor: { enabled: true, plan: 'Pro', seats: 2, monthlySpend: 40 }
    }
    const result = runAudit(tools, 3, 'coding')
    expect(result.totalMonthlySavings).toBe(0)
  })

  it('should flag Claude Team with less than 5 seats', () => {
    const tools = {
      claude: { enabled: true, plan: 'Team', seats: 3, monthlySpend: 90 }
    }
    const result = runAudit(tools, 3, 'coding')
    expect(result.totalMonthlySavings).toBe(30)
  })

  it('should flag Copilot Enterprise with 5 or fewer seats', () => {
    const tools = {
      copilot: { enabled: true, plan: 'Enterprise', seats: 5, monthlySpend: 195 }
    }
    const result = runAudit(tools, 5, 'coding')
    expect(result.totalMonthlySavings).toBe(100)
  })

  it('should flag Gemini Ultra for non research or data use case', () => {
    const tools = {
      gemini: { enabled: true, plan: 'Ultra', seats: 2, monthlySpend: 60 }
    }
    const result = runAudit(tools, 2, 'coding')
    expect(result.totalMonthlySavings).toBe(20)
  })

  it('should calculate correct annual savings', () => {
    const tools = {
      cursor: { enabled: true, plan: 'Business', seats: 2, monthlySpend: 80 }
    }
    const result = runAudit(tools, 3, 'coding')
    expect(result.totalAnnualSavings).toBe(480)
  })

  it('should return empty audits when no tools enabled', () => {
    const tools = {
      cursor: { enabled: false, plan: 'Business', seats: 2, monthlySpend: 80 }
    }
    const result = runAudit(tools, 3, 'coding')
    expect(result.audits).toHaveLength(0)
  })

})