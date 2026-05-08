# Tests

## How to Run

```bash
cd client
npm test
```

## Test Results
7 tests, all passing.

---

## Test File: `client/src/auditEngine.test.js`

### Test 1 — Cursor Business overspend detection
**What it covers:** Flags Cursor Business plan with 2 seats
as overspending. Should recommend downgrading to Pro
saving $40/month.
**Expected:** totalMonthlySavings = 40

### Test 2 — Cursor Pro optimal detection
**What it covers:** Cursor Pro with 2 seats should NOT
be flagged. Already on the right plan.
**Expected:** totalMonthlySavings = 0

### Test 3 — Claude Team minimum seats
**What it covers:** Claude Team with only 3 seats flags
as overspending since Team plan requires minimum 5 seats.
Should recommend Pro at $20/seat saving $30/month.
**Expected:** totalMonthlySavings = 30

### Test 4 — Copilot Enterprise small team
**What it covers:** GitHub Copilot Enterprise with 5 seats
should be flagged. Business plan at $19/seat covers
same features for small teams.
**Expected:** totalMonthlySavings = 100

### Test 5 — Gemini Ultra wrong use case
**What it covers:** Gemini Ultra for coding use case
should be flagged. Ultra is only justified for research
or data use cases.
**Expected:** totalMonthlySavings = 20

### Test 6 — Annual savings calculation
**What it covers:** Annual savings is exactly 12x
monthly savings.
**Expected:** totalAnnualSavings = 480

### Test 7 — No tools enabled
**What it covers:** If no tools are checked, audit
returns empty results and zero savings.
**Expected:** audits.length = 0