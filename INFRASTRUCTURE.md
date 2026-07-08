# Infrastructure & Operations

Reference doc for where this site lives and how its moving parts fit together. Written 2026-07-08.

## Domain & DNS

- **Domain**: `haywoodmushrooms.com`
- **Registrar / DNS**: Cloudflare (dash.cloudflare.com) — account `keldhose@gmail.com`, zone `haywoodmushrooms.com`
- Cloudflare only holds DNS records here. It is **not** what builds or serves the site (there is no Cloudflare Pages/Workers project for this domain).
- DNS records on this zone include:
  - Records pointing the domain at **Vercel** (site hosting — see below)
  - **MX records** for receiving mail at `info@haywoodmushrooms.com` (pre-existing, unrelated to this project — don't touch)
  - **SPF/DKIM TXT records** added by Resend's "Auto configure" (see Email below) — these enable *sending* mail from the domain and coexist safely with the receiving MX records above

## Hosting — Vercel

- **Project**: `haywood-mushrooms-website` at vercel.com (account `keldhoses-projects`, same login as GitHub)
- **Source**: connected to the GitHub repo `keldhose/haywood-mushrooms-website`, branch `main`
- **Deploys automatically** on every push to `main` — no manual deploy step needed for code changes
- Preview deployments are created automatically for other branches/PRs
- **Environment variables**: Project → Settings → Environment Variables. Changes here require a manual **Redeploy** (Deployments → latest → ⋯ → Redeploy) — they do not apply retroactively to an already-running deployment.

Current environment variables:
| Name | Purpose |
|---|---|
| `RESEND_API_KEY` | Auth for sending email via Resend (used by `/api/contact` and `/api/subscribe`) |
| `CONTACT_FROM_EMAIL` | The "from" address for outgoing mail — set to a `@haywoodmushrooms.com` address now that the domain is verified in Resend |

`.env.example` in the repo root documents these for local development.

## Email — Resend

- **Account**: resend.com, workspace `haywoodmushrooms`
- **Verified sending domain**: `haywoodmushrooms.com` (verified 2026-07-08 via Cloudflare auto-configure — adds DKIM/SPF records, does not touch existing mail routing)
- Resend is used only for **sending** transactional email (contact form + newsletter signup notifications). It does not receive or host the `info@haywoodmushrooms.com` inbox — that's handled separately (see below).
- Dashboard → **Logs** shows delivery status for every send (Delivered/Bounced/etc.) — check here first if an email seems to go missing.

## Where `info@haywoodmushrooms.com` mail actually lands

- It's a working inbox that forwards to / is accessible via Gmail. (Exact forwarding setup predates this project and isn't documented here — check Cloudflare Email Routing or whatever mail provider issued the existing MX records if it ever needs to be changed.)
- New mail from an unverified sender can land in **spam** the first few times — mark as "Not spam" in Gmail if that happens; this should stop once senders are recognized.

## How the inquiry system works

Two forms exist, both hitting the same backend:

1. **Homepage lead capture** — `app/components/LeadCapture.tsx`, the `#request` section on `/`
2. **Dedicated contact page** — `app/components/ContactForm.tsx`, on `/contact` (adds an "Operation size" field)

Both `POST` JSON to **`/api/contact`** (`app/api/contact/route.ts`), which:
1. Validates name/email/message are present and the email looks valid
2. Sends an email via Resend to `info@haywoodmushrooms.com`, with the visitor's address set as `reply-to` (so replying goes straight to them)
3. Returns success/error JSON, which the form uses to show a success message or an inline error — no page reload

The **newsletter signup** (`app/components/NewsletterSignup.tsx`, on `/blog`) works the same way against **`/api/subscribe`** (`app/api/subscribe/route.ts`) — it just notifies `info@haywoodmushrooms.com` of the new email address; there's no separate mailing list tool wired up yet, so signups need to be added to a list manually for now.

## Quick troubleshooting

- **Contact form says "Email delivery is not configured"**: `RESEND_API_KEY` is missing on Vercel — see Hosting section above.
- **Form succeeds but no email arrives**: check Resend → Logs for delivery status, then check spam.
- **Want to change site content/design**: edit code, push to `main`, Vercel deploys automatically. No manual build/upload step.
- **Want to change the contact/notification email address**: currently hardcoded as `TO_EMAIL` in `app/api/contact/route.ts` and `app/api/subscribe/route.ts`.
