# Metrics

## North Star Metric

**Audits Completed Per Week**

This is the single number that drives everything else.
An audit completed means:
- A user got real value from the tool
- A lead was potentially captured
- A shareable URL was generated
- A Credex consultation may follow

Why not "visitors" — visitors who bounce add no value.
Why not "emails captured" — email is a downstream metric.
Why not "DAU" — this tool is used once per quarter, not daily.
A completed audit is the moment value is delivered.

---

## 3 Input Metrics That Drive the North Star

### 1. Audit Start Rate
**Definition:** % of visitors who click "Run My Audit"
**Target:** 40%+
**Why it matters:** If people land on the page but do not
start the audit, the form is confusing or the value
proposition is not clear enough.
**What to do if low:** Simplify the form, improve the
hero headline, reduce the number of required fields.

### 2. Form Completion Rate
**Definition:** % of users who start the audit and
complete all fields before submitting
**Target:** 70%+
**Why it matters:** Drop-offs in the form mean friction.
A user who starts but does not finish is a lost lead.
**What to do if low:** Add progress indicators,
reduce required fields, add placeholder examples.

### 3. Email Capture Rate
**Definition:** % of completed audits that result in
an email submission
**Target:** 25%+
**Why it matters:** Email is the lead. Without it,
Credex cannot follow up on high-savings cases.
**What to do if low:** The results are not compelling
enough. Improve the savings display or add more
urgency to the email capture CTA.

---

## What to Instrument First

In order of priority:

1. **Audit completions** — fire an event every time
   a user clicks Run My Audit successfully

2. **Email submissions** — fire an event every time
   a user submits their email

3. **Page visits** — track unique visitors vs
   returning visitors

4. **Shareable URL clicks** — track how many people
   open a shared audit link

5. **Credex CTA clicks** — track clicks on
   "Book a Credex Consultation" button

Use a simple tool like Plausible or even just
Supabase event logging to start.
Do not over-engineer analytics at this stage.

---

## What Number Triggers a Pivot Decision

**If audit completion rate drops below 20% for 2 weeks:**
The form is too complex or the value proposition
is not resonating. Pivot to a simpler input flow —
maybe just "how much do you spend on AI per month"
as a starting point.

**If email capture rate stays below 10% for 2 weeks:**
The results page is not showing enough value.
Either the savings are too small for most users,
or the recommendations are not trusted.
Consider adding benchmarks —
"Teams your size spend on average $X/month."

**If 0 Credex consultations booked after 200 audits:**
The Credex CTA is not compelling enough, or the
users completing audits are not the right target
(students and individuals rather than startup teams).
Pivot distribution to focus on startup communities
rather than developer communities.

---

## Metrics That Do NOT Matter at This Stage

- **DAU/MAU** — this is a quarterly-use tool, not a daily app
- **Session duration** — longer is not better here
- **Bounce rate** — not meaningful for a single-page tool
- **Social media followers** — vanity metric at this stage