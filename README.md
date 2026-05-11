# AI Spend Audit

A free web app that audits your AI tool subscriptions and tells you exactly where you're overspending — with actionable recommendations and potential savings.

**Built for:** Startup founders and developers who pay for multiple AI tools but have no way to benchmark if they're spending wisely.

**Live demo:** https://ai-spend-audit-swart.vercel.app

---

## Screenshots

> Add 3 screenshots here after taking them:
> 1. The input form
> 2. The results page showing savings
> 3. The AI summary section

---

## Quick Start

### Run locally

**1. Clone the repo:**
```bash
git clone https://github.com/ummehanishifa/ai-spend-audit.git
cd ai-spend-audit
```

**2. Start the backend:**
```bash
cd server
npm install
cp .env.example .env
# Fill in your keys in .env
node index.js
```

**3. Start the frontend:**
```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173

---

## Environment Variables

Create `server/.env` with:

SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_key
PORT=5000

## Decisions

Five key trade-offs I made during this build:

1. **React + Vite over Next.js** — I know React well and Vite is fast for development. Next.js would have combined frontend and backend but added learning overhead under a 7-day deadline.

2. **Separate Express backend over serverless functions** — Having a dedicated Express server made it easier to manage Supabase connections and Anthropic API calls in one place, even though it means managing two deployments.

3. **Rule-based audit engine over AI-generated recommendations** — Hardcoded logic is deterministic, auditable, and a finance person can verify it. AI-generated audit logic would be unpredictable and hard to trust.

4. **localStorage for form persistence over a database** — Storing form state locally keeps the app fast and requires no login. Users can return and see their last inputs without creating an account.

5. **Email gate after results, not before** — Showing value first builds trust. Asking for email before showing results would reduce completion rates significantly.

---

## Deploy

- Frontend: Vercel — connect GitHub repo, set root directory to `client`
- Backend: Render — connect GitHub repo, set root directory to `server`, add environment variables
![alt text](screencapture-localhost-5173-2026-05-11-12_41_21.png)
![alt text](screencapture-localhost-5173-2026-05-11-12_40_39.png)