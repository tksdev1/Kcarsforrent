# K Cars for Rent

A rebuild of [kcarsforrent.com](https://kcarsforrent.com) as a modern web app, with
online booking and automatic confirmation emails to both the customer and the owner.

- **Framework:** Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- **Hosting:** Netlify
- **Email:** [Resend](https://resend.com)
- **Storage:** Netlify Blobs — no database to provision or pay for

---

## What it does

**For customers**

- See the car with real rates, photos, seating and features
- Pick dates, with a live availability check and a running price estimate
- Submit a booking request and get an instant confirmation email

**For you**

- A password-protected dashboard at `/admin`
- Confirm or decline requests in one click — the customer is emailed automatically
- Add, edit, hide and delete cars without touching code — the site relayouts itself
- Block out dates for servicing, private use or holidays
- Preview every automated email before a customer ever sees one

**Booking model:** requests, not instant bookings. A submitted request holds the
dates and emails you both, but stays *pending* until you confirm it. No payment
is taken online, so there's no payment processor to set up or PCI surface to worry
about — the balance is collected at pick-up.

---

## Setup

### 1. Install and run locally

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev
```

Open <http://localhost:3000>. The dashboard is at <http://localhost:3000/admin>.

Locally, data is written to a gitignored `.data/` folder. In production it goes to
Netlify Blobs automatically — no configuration needed.

### 2. Environment variables

Set these in **Netlify → Site configuration → Environment variables** (and in
`.env.local` for local development).

| Variable | Required | What it's for |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes | Sends the emails. Get one at [resend.com/api-keys](https://resend.com/api-keys). |
| `BOOKING_FROM_EMAIL` | Yes | The "from" address, e.g. `K Cars for Rent <bookings@kcarsforrent.com>`. The domain must be verified in Resend. |
| `OWNER_NOTIFICATION_EMAIL` | Yes | Where new booking requests are sent (`yuval@thetks.com`). Comma-separate for several people. |
| `ADMIN_PASSWORD` | Yes | Your dashboard password. Make it long and random. |
| `ADMIN_SESSION_SECRET` | Yes | Signs the login cookie. Generate with `openssl rand -base64 32`. |
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://kcarsforrent.com` — used for links inside emails. |
| `BOOKING_REPLY_TO` | No | Where customer replies go, if different from the from address. Set to `yuval@thetks.com` so replies reach your inbox. |

> Without `RESEND_API_KEY` the site still works and still records bookings — it
> just logs the emails instead of sending them. Handy for local development.

### 3. Set up Resend

1. Create an account at [resend.com](https://resend.com).
2. Add `kcarsforrent.com` under **Domains** and add the DNS records it gives you
   (SPF, DKIM and DMARC) at your domain registrar. This is what stops your
   confirmations landing in spam — don't skip it. Verify the *site* domain, not
   `thetks.com`: customers should see mail from the brand they booked with.
   Replies still land in your `yuval@thetks.com` inbox via `BOOKING_REPLY_TO`.
3. Wait for the domain to show as **Verified**.
4. Create an API key and put it in `RESEND_API_KEY`.

Before the domain is verified you can test with
`BOOKING_FROM_EMAIL="K Cars for Rent <onboarding@resend.dev>"`, which only
delivers to your own Resend account address.

### 4. Deploy to Netlify

1. In Netlify, **Add new site → Import an existing project**, and pick this repo.
2. Netlify detects Next.js on its own. Build command `npm run build`, publish
   directory `.next` — both already set in `netlify.toml`.
3. Add the environment variables from the table above.
4. Deploy, then point `kcarsforrent.com` at the site under **Domain management**.

Netlify Blobs is enabled automatically, so bookings persist with no extra setup.

---

## Making it yours

Three things to do before launch:

### 1. Your business details

Edit **`src/lib/site.ts`**. Phone, email and location are set — based in
Visalia, CA. What's worth a look:

- **`serviceTowns`** — Visalia, Tulare, Exeter, Farmersville, Goshen, Woodlake,
  Lindsay, Dinuba, Hanford and Porterville. **Trim any you won't actually drive
  to.** Each one is listed on the contact page and emitted as a schema.org
  `City` in `areaServed`, which is what gets you found for "kei car rental
  Tulare" rather than only for your own town. Claiming a town you won't serve
  just buys you a wasted enquiry.
- **Opening hours** — currently Mon–Fri 9–6, Sat 9–8, Sun by appointment
- **Minimum rental age (21) and security deposit ($250)**

`serviceArea` ("Visalia & nearby towns — delivery available") is the short
label used in the hero and footer, where a full list wouldn't fit. Keep it
brief; `serviceTowns` is where the detail belongs.

These feed the header, footer, contact page, emails and the search-engine
structured data, so getting them right here updates everything at once.

There's no Instagram account yet, so `social.instagram` is `null` and those
links stay hidden. Fill in the handle and URL later and they reappear on their
own.

> Note: the phone number is a 480 (Arizona) area code while the business
> operates in Visalia. That's fine and common, but it means the area code isn't
> a reliable hint about location — `site.city` is the single source of truth.

### 2. Your real car

The fleet holds one car: **Kitty**, the Hello Kitty–wrapped Suzuki Every, with
a real photo at `public/fleet/hello-kitty-kei-van.jpg`. Edit it at
`/admin/fleet` — name, theme, description, rates, fees, seating, minimum days
and accent colour, no code needed.

Still unconfirmed on that record, so check them: the **model year**, whether
it's **right-hand drive** (it's a Japanese import, so almost certainly yes —
worth stating plainly since it changes how the car drives), the **seat count**
(set to 4) and the **transmission** (set to automatic).

The rate is **$179/day, every day** — no weekend premium. That's driven by
leaving `weekendRate` unset: when it's unset (or equal to the daily rate), the
car page shows a single "Daily rate" figure and the quote breakdown collapses to
one "Rental — N days × $179" line instead of splitting into weekday and weekend
rows. Set a weekend rate in `/admin/fleet` and both switch back automatically.

**The site adapts to how many cars are active.** With one, the home and fleet
pages give it a full-width feature, the copy reads in the singular, and the
booking form drops its "choose your car" step so customers go straight to dates.
Add a second car from the same screen and both switch to a grid automatically —
no code change.

**Photos:** drop files into `public/fleet/` and set the image field to
`/fleet/your-file.jpg`, or paste a full `https://` URL. A car with no photo
falls back to an illustrated Kei van in its accent colour, so a newly added car
never shows a broken image.

The home hero shows the car's photo when it has one, and the illustration only
as a fallback.

## Colour scheme

The palette in `src/app/globals.css` is taken from the car: bubblegum body pink,
the hot pink of the "Rent Me!" roof sign, Hello Kitty's red bow and yellow nose,
on a barely-pink white.

Every text pairing clears WCAG AA (4.5:1) — the brand pink `#d6206a` gives
4.91:1 against white for buttons and 4.66:1 on the page background for links,
and the muted grey `#7c6069` clears it on both background tints. **If you change
these, re-check the contrast.** Lighter, prettier pinks fail badly and leave
buttons that some people genuinely cannot read. `--color-bubblegum` is the car's
actual body colour and is decorative only: never put text on it.

The same hex values are duplicated as constants at the top of
`src/emails/layout.ts`, because email clients strip CSS custom properties.
Change one, change the other.

### 3. Read the policies page

**`src/app/policies/page.tsx`** contains rental terms covering eligibility,
deposits, damage and cancellations. They're written to be reasonable and readable,
but they form part of your contract with customers, and rental law varies by
state. Have someone qualified review them, and check they match your actual
insurance. The FAQ (`src/app/faq/page.tsx`) makes claims about insurance and
mileage too — adjust both to how you really operate.

---

## Using the dashboard

Sign in at `/admin`.

**Bookings** — filtered by status, defaulting to the ones waiting on you.
*Confirm & email* sends the customer a confirmation; *Decline* sends a polite no.
Both let you attach a personal note that appears in their email. Declining or
cancelling releases the dates back to the calendar immediately.

**Fleet** — add and edit cars. Unticking "Show on the website" hides a car
without deleting its history; prefer that over deleting. Adding a second car
switches the public pages from the single-car feature layout to a grid.

**Blocked dates** — block a car (or every car) for servicing, private use or
holidays. This page also lists dates already held by pending and confirmed
bookings, so you get one complete view of what's unavailable and why.

**Email previews** — every automated email rendered from a sample booking, so you
can check your details read correctly without making a test booking.

---

## How availability works

A car is unavailable for a date range if either:

- a **pending or confirmed** booking overlaps it, or
- a **blackout** covering that car (or all cars) overlaps it.

Overlap is inclusive at both ends: if a rental returns on the 3rd, the car isn't
offered to someone else on the 3rd. Themed cars need cleaning and prep between
bookings. To change that, adjust `rangesOverlap` in `src/lib/dates.ts`.

Availability is checked twice — in the browser as the customer picks dates, and
again on the server when they submit. Only the second one counts, so two people
filling in the form at once can't double-book.

---

## Project structure

```
src/
├─ app/
│  ├─ page.tsx                 Home
│  ├─ fleet/                   Fleet listing + car detail pages
│  ├─ book/                    Booking form + confirmation
│  ├─ faq/ policies/ contact/
│  ├─ admin/                   Owner dashboard (login + (dashboard) group)
│  └─ api/                     Booking, availability, contact, admin endpoints
├─ components/                 UI, including BookingForm and the admin screens
├─ emails/                     Email templates (table-based HTML + plain text)
└─ lib/
   ├─ site.ts                  ← your business details
   ├─ fleet.ts                 Car storage + the sample fleet
   ├─ bookings.ts              Bookings, blackouts, availability
   ├─ pricing.ts               Quote calculation
   ├─ dates.ts                 Timezone-safe date helpers
   ├─ auth.ts                  Admin session signing
   └─ store.ts                 Netlify Blobs, with a local file fallback
```

---

## Security notes

- The dashboard is protected by a password and a signed, HTTP-only session cookie
  that expires after 12 hours. Middleware redirects anyone without a cookie, and
  every admin page and API route independently verifies the signature.
- Login attempts are rate-limited per IP.
- Both public forms carry a honeypot field; submissions that fill it get a
  plausible-looking success and are silently discarded.
- All input is validated with Zod on the server, never trusting the browser.

Use a long random `ADMIN_PASSWORD` and a unique `ADMIN_SESSION_SECRET`, and never
commit either. `.env*.local` is gitignored.

---

## Scripts

```bash
npm run dev        # local dev server
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Possible next steps

Not built, but the groundwork is there:

- **Online deposits** — add Stripe Checkout to the booking flow to take payment up front
- **A real photo of the car** — the biggest single visual upgrade available
- **Real reviews** — the old site's testimonials were theme placeholders ("John Doe",
  "Sarah Jones"), so they were left out rather than carried over. Add genuine ones
  when you have them.
- **Instagram** — no account yet; when there is one, add it to `site.social` and
  the footer and contact links come back automatically
- **SMS alerts** — a Twilio call in the booking route would text you on each request
