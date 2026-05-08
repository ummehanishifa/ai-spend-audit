# Reflection

## 1. The Hardest Bug I Hit This Week

The hardest bug was the Anthropic API authentication error.
The server kept throwing:
"Could not resolve authentication method. Expected apiKey to be set."

My first hypothesis was that the .env file was not loading correctly.
I checked the file existed and had the right variable name.
Then I thought maybe dotenv was not being required before
the Anthropic client was initialized.

I moved `require('dotenv').config()` to the very top of index.js
before any other imports. Still failed.

Then I checked the actual .env file character by character and
found that there was an extra space after the equals sign:
`ANTHROPIC_API_KEY= sk-ant-...` instead of `ANTHROPIC_API_KEY=sk-ant-...`

Removing that space fixed it immediately.
The lesson: environment variable bugs are almost always
a formatting issue, not a code issue.

---

## 2. A Decision I Reversed Mid-Week

I originally planned to run the audit engine on the backend
(Express server) so I could log every audit for analytics.

I reversed this after realizing it added a network round trip
to every audit — the results page would take 1-2 seconds
to appear instead of being instant.

The audit engine is just math — there is no reason it needs
a server. Moving it to the client side made results appear
instantly on click which felt much better.

The trade-off is that I lose server-side logging of audit logic,
but I can still log the final results when they are saved
to Supabase, which gives me enough analytics anyway.

---

## 3. What I Would Build in Week 2

1. **CI/CD pipeline with GitHub Actions** — auto deploy to
   Vercel and Render on every push to main.

2. **Transactional email via Resend** — actually send the
   audit report to the user's email instead of just
   showing a confirmation message.

3. **Open Graph preview for shared URLs** — when someone
   shares their audit link on Twitter or Slack, it should
   show a rich preview with their savings number.

4. **Usage tracking** — add Plausible analytics to track
   which tools users select most, where they drop off,
   and which recommendations they act on.

5. **Benchmark mode** — "your AI spend per developer is $X,
   companies your size average $Y" to add social context
   to the audit results.

---

## 4. How I Used AI Tools

**Tools used:** Claude (primary), ChatGPT (secondary)

**What I used them for:**
- Scaffolding boilerplate code (Express routes, React components)
- Debugging error messages by pasting the stack trace
- Writing first drafts of markdown documentation
- Explaining unfamiliar concepts (Supabase RLS policies)

**What I did NOT trust them with:**
- The audit engine logic — I wrote every pricing rule myself
  and verified each number against official pricing pages
- The user interview content — these had to be real conversations
- Final decisions about architecture trade-offs

**One specific time the AI was wrong:**
Claude suggested using `process.env.ANTHROPIC_API_KEY` directly
in the Anthropic client constructor like this:
`new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })`

But the actual error showed the key was not being picked up
because dotenv had not loaded yet at that point in the file.
The AI did not flag the initialization order issue —
I had to debug that myself by reading the error carefully.

---

## 5. Self Rating

**Discipline: 7/10**
I committed code every day and kept the DEVLOG updated.
I could have started the user interviews earlier instead
of leaving them until day 2.

**Code Quality: 6/10**
The code works and is readable but lacks TypeScript types,
proper error boundaries in React, and more thorough
input validation on the backend.

**Design Sense: 7/10**
The dark theme with green accents looks clean and professional.
The results page is screenshot-worthy. Could improve mobile
responsiveness and add loading states.

**Problem Solving: 8/10**
Debugged multiple issues independently — the dotenv ordering
bug, the JSX special character errors, the Supabase RLS policy.
Each time I formed a hypothesis, tested it, and fixed it.

**Entrepreneurial Thinking: 7/10**
I understand the user and the business model. The GTM plan
is specific and realistic. I could have gone deeper on
the economics — the LTV estimates are rough approximations.