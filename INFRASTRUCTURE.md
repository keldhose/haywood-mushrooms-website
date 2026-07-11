# Infrastructure & Operations

Reference doc for where this site lives and how its moving parts fit together. Written 2026-07-08, updated 2026-07-11 — see "Features added since the initial e-commerce build" for everything that's shipped since.

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
| `NEXT_PUBLIC_FIREBASE_*` (6 vars) | Firebase client config — public, safe to expose (see E-commerce section) |
| `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` | Firebase Admin SDK service account — **secret** |
| `STRIPE_SECRET_KEY` | Stripe API access (test-mode key currently — see E-commerce section) |
| `STRIPE_WEBHOOK_SECRET` | Verifies incoming Stripe webhook events are genuine |
| `SHIPPO_API_KEY` | Live shipping rate quotes |
| `CRON_SECRET` | Shared secret Vercel sends as a bearer token to `/api/cron/release-expired-orders` — the route rejects any request without it, so the cleanup job can't be triggered by an outsider hitting the URL |

`.env.example` in the repo root documents all of these for local development. Never commit `.env.local` (it's gitignored) — paste secrets directly into it, not into chat when working with an AI assistant.

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

## E-commerce (accounts, shop, checkout, admin)

Added 2026-07-08. Three new third-party services, all currently in **test/sandbox mode** — no real money moves and no real emails/SMS go to customers from these until deliberately switched to live/production credentials.

### Firebase — accounts + database

- **Project**: `haywood-mushrooms-45ab5` at console.firebase.google.com (same Google account, `keldhose@gmail.com`) — a *separate* project from the `kraftedlogic` business, deliberately, to keep data/billing isolated.
- **Authentication**: Email/Password and Google sign-in enabled. Session model: client signs in with the Firebase client SDK → gets an ID token → `POST /api/auth/session` exchanges it for an httpOnly session cookie (`lib/auth/session.ts`, `app/api/auth/session/route.ts`). Protected routes (`/account`, `/admin`, `/checkout`) check this cookie in a `layout.tsx`, not `middleware.ts` (Firebase Admin SDK needs the Node runtime).
- **Firestore**: Standard edition, `(default)` database. Collections: `products`, `orders`, `users/{uid}` (saved shipping address only, `lib/users.ts` — profile identity itself still lives in Firebase Auth, not Firestore), `stockNotifications` (back-in-stock waitlist, cleared once notified). No client-side Firestore reads/writes are used anywhere — everything goes through the Admin SDK on the server (`lib/firebase/admin.ts`), so Firestore's default production-mode security rules (deny-all) are fine as-is and have never been touched.
- **Admin access**: not a role stored anywhere visible — it's a Firebase Auth **custom claim** (`admin: true`) on specific accounts. Manage it with:
  - `npm run admin:grant -- someone@email.com` (they must have already signed up once)
  - `npm run admin:revoke -- someone@email.com`
  - `npm run admin:list` — see who currently has it
  - **Important**: granting/revoking doesn't affect an already-issued session cookie — the account must log out and back in for the change to take effect.
  - Current admins: `keldhose@gmail.com`, `info@haywoodmushrooms.com`.

### Stripe — payments

- **Account**: stripe.com, "Haywood Mushrooms sandbox" — currently using **test-mode** keys (`sk_test_...`). Switching to real payments later means creating live-mode keys in the same Stripe account (Stripe walks you through business verification at that point) and updating `STRIPE_SECRET_KEY`/`STRIPE_WEBHOOK_SECRET` in Vercel.
- **Flow**: `/checkout` offers "Ship to me" (collects an address + Shippo rate, see below) or **"Local pickup"** (no address, no shipping cost, skips Shippo entirely) → `POST /api/checkout` creates a pending order in Firestore (reserving stock in the same transaction — see Stock reservation below), then a Stripe Checkout Session (hosted payment page, `allow_promotion_codes: true` so a customer can enter a promo code there) → customer pays → Stripe's **webhook** (`POST /api/webhooks/stripe`, handling `checkout.session.completed`) is the actual source of truth that marks the order paid — not the success-page redirect, which can't be trusted alone. Stock is decremented at reservation time, not at payment time, so it's never oversold to two concurrent checkouts.
- **No account required** — a guest can check out with just an email. If that email matches an existing account, the order is silently linked to it (shows up in "My orders" if/when they log in). Logged-in customers get their saved address pre-filled and their address saved for next time.
- **Local webhook testing**: the Stripe CLI is installed (`stripe` command, via winget). `stripe listen --forward-to localhost:<port>/api/webhooks/stripe` forwards test events to your local dev server and prints a `whsec_...` secret to put in `.env.local` as `STRIPE_WEBHOOK_SECRET` — that secret is only valid while `stripe listen` is running, it's not the same as a real deployed webhook endpoint's secret.
- **Production webhook**: not yet configured. Before going live, add a webhook endpoint in the Stripe dashboard pointed at `https://www.haywoodmushrooms.com/api/webhooks/stripe` (event: `checkout.session.completed`), and put *that* endpoint's signing secret in Vercel's `STRIPE_WEBHOOK_SECRET`.
- Receipts are Stripe's own automatic emails — no custom invoice/PDF generation in this codebase.

### Shippo — live shipping rates

- **Account**: goshippo.com, API plan (free tier, 30 labels/month — we only fetch rate quotes, which are free regardless).
- **Ship-from address** is hardcoded in `lib/shippo.ts` (`SHIP_FROM_ADDRESS`): 3121 Sentinel Ferry Ln, Cary, NC 27519.
- Parcel dimensions are also a fixed estimate in `lib/shippo.ts` (`DEFAULT_PARCEL`, 10×8×6 in) — not per-product yet. Fine for grain spawn bags; revisit if very different product sizes get added.
- US shipping only for now (`/checkout` collects a US address only).

### Data model (Firestore)

- **`products/{slug}`** — `name`, `scientificName`, `description`, `priceCents`, `stockQty`, `weightOz`, `imageUrls[]` (photos in display order — first one is the cover/catalog image, reorderable in the admin form via "Set cover"), `active`. Doc ID is a URL slug (e.g. `pink-oyster-grain-spawn-1lb`). Two optional add-ons, both configured per product in `/admin/products`:
  - `variants[]` (`{id, label, priceCents, stockQty, weightOz}`) — purchasable size/form options (e.g. 1lb/5lb/10lb). When present, the product's own base `priceCents`/`stockQty`/`weightOz` are unused (zeroed) — every price/stock read goes through a variant.
  - `bulkTiers[]` (`{minQty, discountPercent}`) — quantity-break pricing (e.g. "3+, save 10%"), applied per cart line based on how many of that exact product+variant are in the cart. Same schedule applies regardless of which variant is bought.
  - Seeded initially via `npm run db:seed` (`scripts/seed-products.ts`); managed going forward via `/admin/products`. **Never rerun `db:seed` against real data** — it upserts every field including name/description/images and will silently overwrite real admin edits. Photo uploads go to Firebase Storage (`products/` path in the `haywood-mushrooms-45ab5.firebasestorage.app` bucket) via `POST /api/admin/products/upload` — requires the Firebase project to be on the **Blaze** (pay-as-you-go) plan; Storage isn't available on the free Spark plan.
- **`orders/{autoId}`** — `userId?`, `userEmail?`, `buyerName?`, `channel` (`"online"` = Stripe checkout, `"local"` = admin-recorded in-person sale), `paymentMethod?` (Cash/Venmo/PayPal/Zelle/Other, local sales only), `items[]` (name/price/qty *snapshot* at purchase time, not a live reference — reflects any bulk discount already applied), `subtotalCents`/`shippingCents`/`totalCents`, `discountCents?` (promo code), `shippingAddress`, `shippingRate` (`provider: "Local pickup"` is the sentinel for both local sales and self-service pickup orders — `shippingCents` is 0 and no real address is collected), `status` (`pending`→`paid`→`fulfilled`, or `cancelled`), `trackingNumber?`, `labelUrl?`/`shippingLabelCostCents?` (admin-purchased shipping label), `readyForPickupAt?`/`pickupInstructions?` (pickup-only — set when an admin notifies the customer it's ready), `expiresAt` (pending orders only — stock reservation deadline), `stripeCheckoutSessionId?`/`stripePaymentIntentId?`, `createdAt`.
- Prices/weights/stock are always re-derived server-side from Firestore at checkout time (`lib/products.ts` → `getProductsByIds`/`getVariant`, quantity-aware for bulk pricing) — cart contents from the browser are treated as an (id, variantId, qty) wishlist only, never trusted for the actual charge. Same for the shipping rate: the client sends back a Shippo rate ID, and the server re-fetches that rate's authoritative amount from Shippo (`shippo.rates.get`) rather than trusting a client-supplied amount.
- **Stock reservation**: creating a pending order decrements stock in the same Firestore transaction (`lib/orders.ts` → `createPendingOrder`/`applyStockDelta`), closing the window where two concurrent checkouts could both see "in stock" on the last unit. A pending order that never completes payment releases its stock automatically 30 minutes after creation — checked opportunistically on the next checkout attempt, and swept daily by a cron job (`/api/cron/release-expired-orders`, protected by `CRON_SECRET`; Vercel's Hobby plan only allows daily-granularity cron, not sub-daily).

### Site map of the e-commerce pages

- `/signup`, `/login` — Firebase email/password + Google auth
- `/account`, `/account/orders`, `/account/orders/[id]` — customer's own profile + order history (requires login)
- `/order/[id]` — public order confirmation/receipt page, reachable by anyone who knows the (unguessable) order id — this is what checkout redirects to on success, so it has to work for guest orders with no account to gate behind
- `/shop`, `/shop/[slug]` — product catalog (separate from the marketing-only `/strains` page)
- `/cart`, `/checkout` — client-side cart (React Context + localStorage) → fulfillment method (ship/pickup) → address/shipping/payment
- `/admin`, `/admin/products` (create/edit is a modal on this page, not separate routes), `/admin/orders`, `/admin/orders/[id]`, `/admin/orders/new` (record a local cash/Venmo/etc. sale), `/admin/orders/[id]/invoice` (printable/emailable invoice for a local sale) — admin-only (see Admin access above)

### Features added since the initial e-commerce build

- **Product variants** — optional size/form options per product (`variants[]`), each with its own price/stock/weight.
- **Bulk quantity pricing** — optional per-product discount tiers (`bulkTiers[]`), e.g. "3+, save 10%", applied per cart line.
- **Back-in-stock notifications** — a customer leaves their email on a sold-out product/variant (`stockNotifications` collection); restocking it (0 → positive stock in `/admin/products`) fires `lib/stock-notify.ts` to email everyone waiting, then clears the list.
- **One-tap reorder** — a button on any past order re-adds its items to the cart at current prices/stock (skipping anything no longer available), via `/api/products/by-ids`.
- **Promo codes** — real Stripe coupons/promotion codes, entered at Stripe's hosted checkout (`allow_promotion_codes: true`) or pre-validated in the cart via `/api/promo-code/validate`.
- **Order lifecycle emails** (`lib/email.ts`, sent via Resend) — order confirmation, admin new-order notification, shipped (with tracking), ready-for-pickup, low-stock alert, and a welcome discount (10% off, tied to newsletter signup via `/api/subscribe`).
- **Admin: record a local sale** (`/admin/orders/new`) — for growers who pay cash/Venmo/PayPal/Zelle in person. Creates a real `paid` order and decrements stock immediately, no Stripe involved; linked to the buyer's account if their email matches one. Comes with a printable/emailable invoice (`/admin/orders/[id]/invoice`).
- **Guest checkout** and **local pickup** — see the Stripe section above.
- **Admin shipping labels** — for shipped (non-pickup) orders, `/admin/orders/[id]` can quote a fresh Shippo rate and purchase a real label, defaulting to whatever service the customer originally paid for.
- **Installable (PWA)** — `app/manifest.ts` plus generated icon sizes make the site installable to a phone/desktop home screen (Chrome "Install app" / iOS "Add to Home Screen"). No service worker/offline caching — deliberately, since caching pages for a checkout-heavy store risks showing stale prices/stock.
- **Brand mark** — the site icon (nav, footer, favicon, PWA icons, email header) is `public/haywood-mark.png` and its derivatives, from the `design_handoff_haywood_logo` package — regenerate all sizes from that source if it's ever replaced again (see the git history for the generation script if needed).

### Deploying this e-commerce layer for the first time — two real gotchas hit on 2026-07-08

Both caused the production build/runtime to fail even though everything worked locally. Documented here so a future deploy (or a fresh environment) doesn't lose time rediscovering them.

1. **`FIREBASE_PRIVATE_KEY` pasted into Vercel with stray wrapping quotes.** In `.env.local` the value is wrapped in double quotes (`FIREBASE_PRIVATE_KEY="-----BEGIN...-----\n"`) because `dotenv` needs that to parse a value containing literal `\n` sequences. Vercel's environment variable field does **no such stripping** — it's a raw literal string. Copying the value including those outer `"..."` quotes corrupts the key and fails with `Error: Failed to parse private key` at build time (during "Collecting page data", since `lib/firebase/admin.ts` evaluates the Admin SDK eagerly at module import). Fix: the value in Vercel must start exactly with `-----BEGIN PRIVATE KEY-----` and end with `-----END PRIVATE KEY-----\n` — no leading/trailing `"` characters — while keeping the literal `\n` sequences in the middle as-is.
2. **`jose` (a transitive dependency via `firebase-admin` → `jwks-rsa`) resolved to v6, which dropped CommonJS support entirely.** `jwks-rsa` still does a plain `require("jose")`; jose v6 is pure ESM with no `require` export condition, so this throws `ERR_REQUIRE_ESM` — but only in Vercel's serverless runtime, not in local `next build`/`next start`, which is what made it confusing. It broke every route touching `lib/firebase/admin.ts` (`/admin`, `/account`, `/shop/[slug]`, etc.) with a generic 500. Fix: pinned via npm `overrides` in `package.json` to `"jose": "^5.10.0"` — v5 still ships a proper CJS build (v6 doesn't). Adding `serverExternalPackages: ["firebase-admin"]` in `next.config.ts` was tried first and is harmless to keep, but did **not** fix this on its own — the `jose` pin was the actual fix.

**If a production 500 shows up with no useful detail in the Vercel dashboard's Build Logs panel** (it silently truncates before the real error in some cases): the **Vercel CLI** is installed locally (`npx vercel`, already authenticated as of 2026-07-08 via `npx vercel login`). `npx vercel logs <url> --status-code 500 --expand` gets the full untruncated runtime error directly, which is far more reliable than scrolling the dashboard UI.

## Quick troubleshooting

- **Contact form says "Email delivery is not configured"**: `RESEND_API_KEY` is missing on Vercel — see Hosting section above.
- **Form succeeds but no email arrives**: check Resend → Logs for delivery status, then check spam.
- **Want to change site content/design**: edit code, push to `main`, Vercel deploys automatically. No manual build/upload step.
- **Want to change the contact/notification email address**: currently hardcoded as `TO_EMAIL` in `app/api/contact/route.ts` and `app/api/subscribe/route.ts`.
- **Logged in but `/admin` redirects to `/account`**: the admin custom claim was granted/changed after this session's cookie was issued — log out and back in.
- **Google sign-in works but logs noisy "Cross-Origin-Opener-Policy" console errors**: known cosmetic Firebase + Chrome popup interaction, not a bug — auth still completes correctly. Only a full fix would be switching from `signInWithPopup` to `signInWithRedirect` in `app/login/page.tsx` / `app/signup/page.tsx`, trading the popup UX for a full-page redirect.
- **Order stuck on "pending" after a real payment**: the Stripe webhook didn't reach us. In production, check Stripe dashboard → Developers → Webhooks → your endpoint → recent events for delivery failures. Locally, this means `stripe listen` wasn't running during the test.
- **Checkout fails at the shipping-rate step**: check the address is a real, deliverable US address — Shippo/USPS reject nonsense addresses. Check Shippo dashboard → Logs for the actual carrier error if unsure.
- **Need to bulk-edit product data**: do it through `/admin/products`, or a targeted `.update()` on specific fields. **Do not rerun `npm run db:seed`** against real data — it upserts every field on `scripts/seed-products.ts`'s hardcoded list (including name/description/images), which has silently overwritten real admin edits before. It's only safe against an empty/test database.
