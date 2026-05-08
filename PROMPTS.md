# Prompts

## AI Summary Prompt

Used in `server/index.js` at the `/api/summary` endpoint.

### Final Prompt

```
You are an AI spend advisor. Write a 100-word personalized summary 
for a team of ${teamSize} people whose primary use case is ${useCase}.

Their audit results are:
${auditText}

Total potential savings: $${totalMonthlySavings}/month 
($${totalAnnualSavings}/year).

Write a friendly, specific, actionable summary. 
No bullet points. Just a paragraph.
```

### Why I Wrote It This Way

1. **Role assignment** — "You are an AI spend advisor" sets the tone.
   Without this, the model gave generic responses that felt like
   a chatbot, not a financial advisor.

2. **Injecting real data** — Passing actual audit results, team size,
   and use case makes the summary feel personalized rather than
   templated. Early versions without this context produced generic
   advice like "consider your options carefully."

3. **"No bullet points. Just a paragraph"** — The first version
   returned bullet points which looked bad in the UI. Adding this
   constraint fixed it immediately.

4. **100-word limit** — Without a word limit the model wrote 300+
   word essays. "100-word" keeps it concise and readable.

---

## What I Tried That Did Not Work

### Attempt 1 — Too vague
```
Summarize this AI audit for a startup.
```
Result: Generic 3-sentence response with no specific numbers
or tool names. Useless.

### Attempt 2 — Too much detail requested
```
Write a detailed 500-word analysis of this AI spend audit
including market context, competitor analysis, and ROI projections.
```
Result: The model hallucinated market statistics and made up
competitor pricing. Too long and untrustworthy.

### Attempt 3 — Missing role context
```
Write a 100-word summary of these audit results: ${auditText}
```
Result: Dry, robotic tone. No personality. Felt like a spreadsheet
summary not a human advisor.

---

## Fallback Behavior

If the Anthropic API fails for any reason (rate limit, timeout,
network error), the app falls back to this templated summary:

```
Based on your audit, your team of ${teamSize} could save 
$${totalMonthlySavings}/month by optimizing your AI tool 
subscriptions. Review the recommendations above to reduce 
your annual AI spend by $${totalAnnualSavings}.
```

This ensures the app never shows a blank or broken state
to the user even when the API is unavailable.

---

## Model Used

- Model: `claude-haiku-4-5-20251001`
- Max tokens: 200
- Temperature: default

### Why Haiku

Claude Haiku is fast and cheap for short summaries.
A 100-word paragraph does not need the full power of Sonnet or Opus.
Haiku responses come back in under 1 second which keeps
the UI feeling snappy.