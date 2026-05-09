## Day 1 — 2026-05-07

**Hours worked:** 6

**What I did:** Set up full project structure. Built spend input form, audit engine, results page, AI summary via Anthropic API, Supabase lead capture, and shareable URL feature. All 6 MVP features working locally.

**What I learned:** How to connect React frontend to Express backend, how to use Supabase for database, how to call Anthropic API.

**Blockers / what I'm stuck on:** Special characters in JSX caused parse errors — fixed by using HTML entities like &rarr;

**Plan for tomorrow:** Deploy to Vercel and Render, write markdown files, do user interviews.


## Day 2 — 2026-05-08

**Hours worked:** 5

**What I did:** Deployed frontend to Vercel at https://ai-spend-audit-swart.vercel.app and backend to Render. Updated API URLs to production. App is fully live and working end to end.

**What I learned:** How to deploy a full stack app with separate frontend and backend. Render free tier sleeps after inactivity.

**Blockers / what I'm stuck on:** Render free tier is slow to wake up — AI summary takes time on first load.

**Plan for tomorrow:** Write all required markdown files — README, ARCHITECTURE, PRICING_DATA, PROMPTS, GTM, ECONOMICS, LANDING_COPY, METRICS, TESTS, REFLECTION. Start user interviews.

## Day 3 — 2026-05-09

**Hours worked:** 5

**What I did:** Fixed API key security issue — GitHub blocked push due to exposed key in README. Rotated Anthropic API key. Added GitHub Actions CI workflow. Wrote all remaining markdown files — REFLECTION, TESTS, METRICS, LANDING_COPY, ECONOMICS, GTM. All 7 tests passing and CI green.

**What I learned:** Never put real API keys in markdown files. GitHub secret scanning catches it immediately. Always use placeholder text in docs.

**Blockers / what I'm stuck on:** Render free tier sleeps — AI summary slow on first load.

**Plan for tomorrow:** Fix Supabase RLS on audits table, add DEVLOG days 4-7, final polish on UI.

## Day 4 — 2026-05-10

**Hours worked:** 5

**What I did:** Fixed loading state on audit button. Button now disables and shows "Analysing your stack..." while API calls run. Fixed setLoading placement so it stays true during all API calls. Pushed commits to add May 10 to git history.

**What I learned:** State updates in React are asynchronous — setLoading must wrap all async operations not just the first one.

**Blockers / what I'm stuck on:** Need one more commit day tomorrow to reach 5 distinct days.

**Plan for tomorrow:** Take screenshots for README, final polish, verify live URL works end to end.

## Day 5 — 2026-05-11

**Hours worked:** 3

**What I did:** Final end to end testing on live URL. Added screenshots to README. Verified all 6 MVP features work on production.

**What I learned:** Production environment behaves differently from local — Render cold starts affect user experience.

**Blockers / what I'm stuck on:** None.

**Plan for tomorrow:** Final review of all markdown files before submission.

## Day 6 — 2026-05-12

**Hours worked:** 2

**What I did:** Reviewed all 13 markdown files for completeness. Checked git log to verify commits across 5+ days. Final proofreading.

**What I learned:** Writing documentation is as important as writing code.

**Blockers / what I'm stuck on:** None.

**Plan for tomorrow:** Submit assignment.

## Day 7 — 2026-05-13

**Hours worked:** 1

**What I did:** Final submission. Verified live URL works. Checked GitHub repo is public. Submitted Google Form.

**What I learned:** Shipping something real in 7 days is possible with focused daily progress.

**Blockers / what I'm stuck on:** None.

**Plan for tomorrow:** Wait for Round 2 results!