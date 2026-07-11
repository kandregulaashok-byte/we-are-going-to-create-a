# Stay@Maredumilli - Antigravity Handoff Guide

This file is written for a non-coder. Open this project in Antigravity and use this document as the starting point for any future work.

## 1. Current Project Status

Project name: Stay@Maredumilli

Website domain:
- Main live website: https://stayatmaredumilli.com
- Old Vercel URL may still work: https://we-are-going-to-create-a.vercel.app

GitHub repo:
- https://github.com/kandregulaashok-byte/we-are-going-to-create-a.git

Current pushed commit:
- `37e605c`

Local project folder on this computer:
- `C:\Users\Kandr\Documents\Codex\2026-07-07\we-are-going-to-create-a`

Important: the latest code has already been pushed to GitHub.

## 2. What This Project Is

Stay@Maredumilli is a hotel booking website for Maredumilli stays.

It has:
- Customer website
- Google login
- Hotel room listing
- Hotel-specific SEO pages like `/hotels/pushpa`
- Booking flow
- Mock payment mode and Razorpay-ready backend API files
- Customer profile and past bookings
- Hotel owner panel
- Super admin panel
- Influencer tracking basics
- Policies pages
- SEO sitemap and robots files
- Supabase database connection
- Vercel deployment

This is not a Next.js project. It is a static HTML, CSS, and JavaScript project with Vercel serverless API files inside `api/`.

## 3. Main Files And What They Do

Customer website:
- `index.html` - customer home page
- `app.js` - main customer website logic
- `styles.css` - main website styling
- `login.html` - login page

Super admin:
- `admin.html` - admin page UI
- `admin.js` - admin logic

Hotel owner:
- `owner.html` - owner page UI
- `owner.js` - owner logic

SEO hotel pages:
- `scripts/generate-seo-pages.js` - generates static hotel pages
- `public/hotels/...` - generated hotel pages
- `sitemap.xml` and `public/sitemap.xml` - sitemap
- `robots.txt` and `public/robots.txt` - search engine rules

Policies:
- `policy.html`
- `policy.js`
- `policies/all-policies-combined.md`
- `privacy.html`
- `faq.html`
- `about.html`

Backend API on Vercel:
- `api/create-payment-hold.js`
- `api/verify-payment.js`
- `api/razorpay-webhook.js`

Database/schema:
- `supabase-schema.sql`
- `upcoming-bookings-migration.sql`

Deployment/config:
- `package.json`
- `vercel.json`
- `supabase-config.js`
- `.env`

## 4. How To Open In Antigravity

1. Open Antigravity.
2. Open folder:
   `C:\Users\Kandr\Documents\Codex\2026-07-07\we-are-going-to-create-a`
3. First ask Antigravity:

```text
Read ANTIGRAVITY_HANDOFF.md fully first.
Do not make any code changes yet.
Explain the project structure to me in simple words.
```

4. Then ask for the exact change you want.

## 5. How To Run Locally

Open terminal inside the project folder and run:

```bash
npm install
npm run build
npx serve public -l 4179
```

Then open:

```text
http://127.0.0.1:4179
```

Hotel page example:

```text
http://127.0.0.1:4179/hotels/pushpa
```

Admin page:

```text
http://127.0.0.1:4179/admin.html
```

Owner page:

```text
http://127.0.0.1:4179/owner.html
```

## 6. How To Build

Always run this after code changes:

```bash
npm run build
```

What this does:
- Writes config into `public/`
- Generates static hotel SEO pages
- Generates sitemap and related public files

If you change hotel page generation, always run `npm run build`.

## 7. How To Deploy To Vercel

Use:

```bash
npx vercel --prod --yes
```

After deployment, test:

```text
https://stayatmaredumilli.com
https://stayatmaredumilli.com/hotels/pushpa
https://stayatmaredumilli.com/hotels
```

## 8. How To Push To GitHub

Check what changed:

```bash
git status
```

Build first:

```bash
npm run build
```

Commit:

```bash
git add -A
git commit -m "Describe the change here"
```

Push:

```bash
git push origin main
```

## 9. Supabase Notes

Supabase project:
- `nqowitrszhmvdusswnve`

Supabase URL used by the app:
- `https://nqowitrszhmvdusswnve.supabase.co`

Important:
- Do not paste service role keys into frontend files.
- Service role key must only be used in Vercel environment variables or backend API files.
- Do not run the full `supabase-schema.sql` blindly unless you know exactly what it will change.
- For new database changes, create a small migration file and run only that.

Tables/functions have been added over time for:
- bookings
- booking holds
- room availability
- admin room blocking
- upcoming bookings
- user analytics/profile storage
- influencer tracking basics

Before changing database logic, ask Antigravity to inspect:
- `supabase-schema.sql`
- `app.js`
- `admin.js`
- `owner.js`
- `api/create-payment-hold.js`
- `api/verify-payment.js`

## 10. Google Login Notes

Google login is through Supabase Auth.

Important places that must include the custom domain:
- Supabase Auth Site URL
- Supabase Auth Redirect URLs
- Google Cloud OAuth Authorized JavaScript origins
- Google Cloud OAuth Authorized redirect URIs

Main domain:

```text
https://stayatmaredumilli.com
```

Supabase callback URL:

```text
https://nqowitrszhmvdusswnve.supabase.co/auth/v1/callback
```

If Google login breaks, check these first before editing code.

## 11. Payment Notes

Current payment approach:
- Mock payment is available for testing.
- Razorpay files are prepared but real Razorpay production setup must be completed before going live.

Backend files:
- `api/create-payment-hold.js`
- `api/verify-payment.js`
- `api/razorpay-webhook.js`

Expected future Vercel environment variables:
- `SUPABASE_SERVICE_ROLE_KEY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`

Booking logic goal:
- When customer clicks pay, rooms are held for a short time.
- If payment succeeds, booking is confirmed.
- If payment fails or times out, rooms are released.

This is like movie ticket booking.

## 12. Important Product Rules

Cancellation/refund:
- No cancellation.
- No refund.
- Policies must clearly say this before payment.

Booking:
- User should login with Google before booking.
- User can choose check-in and check-out dates.
- Changing check-in should default check-out to next day.
- User can still manually change check-out.
- Adults, children, and rooms must be whole numbers.
- System must not allow booking more rooms than available.
- Available room counts must stay in sync across customer site, owner panel, and super admin.

Firecamp:
- 1 or 2 rooms: Rs.600
- 3 to 5 rooms: Rs.1,000

Travel package interest:
- After booking, customer should see an option/checkbox asking whether they are interested in travel packages around Maredumilli.
- Customer must consent before being contacted.

Admin:
- Super admin can block rooms by hotel, date range, and room count.
- Super admin should not accidentally block all rooms for all dates.
- Owner and admin views should show synced booking/availability data.

## 13. Current Important Features Already Added

Already implemented or prepared:
- Custom domain support
- SEO pages for hotels
- Sitemap and robots files
- Policy pages
- Google login
- Static hotel-specific pages
- Booking bridge from hotel SEO page into main booking flow
- Admin upcoming bookings
- Admin room block/release support
- Mock payment mode
- Razorpay-ready API files
- Confetti/confirmation work was discussed and partially handled in booking flow
- Logout option was added
- Basic responsive fixes have been done many times

## 14. Known High-Priority Pending Work

These are the things to check or finish before going live:

1. Hotel-specific page design
   - Improve `/hotels/pushpa` and other hotel pages.
   - Make them visually match the home page.
   - Avoid duplicate amenity text.
   - Show amenity chips/buttons like home page.
   - Make “View all hotels” button look professional.
   - Keep layout responsive on mobile and desktop.

2. Mobile layout stability
   - Home page, profile page, admin page, and hotel pages must never require zooming out.
   - Bottom navigation must stay fixed and not overlap content.
   - Inputs and cards must never overflow screen width.

3. Super admin room blocking
   - Confirm block by hotel + check-in + check-out + number of rooms works.
   - Confirm it does not block the entire hotel for all dates.
   - Confirm customer, owner, and admin pages show same availability.

4. Booking holds/payment
   - Fully test mock payment end to end.
   - Later connect Razorpay real mode.
   - Confirm failed/expired payments release held rooms.

5. User analytics
   - Confirm logged-in users are stored with name, email, phone if available.
   - Confirm booked customers are visible to admin.

6. Influencer tracking
   - Referral code is currently intended to be hidden/removed from customer flow for now.
   - Later, admin should see visits and bookings per influencer link.

7. SEO
   - Submit sitemap to Google Search Console:
     `https://stayatmaredumilli.com/sitemap.xml`
   - Add/verify Google Search Console property.
   - Add Google Business Profile.
   - Add GA4 analytics if not already done.

8. Security
   - Keep checking RLS policies in Supabase.
   - Make sure customers cannot see other customers' bookings.
   - Make sure owners cannot see other owners' private data.
   - Never expose service role keys in frontend code.

## 15. Good Prompt To Paste Into Antigravity

Use this exact prompt for future work:

```text
I am a non-coder. This is the Stay@Maredumilli hotel booking project.

Before changing anything:
1. Read ANTIGRAVITY_HANDOFF.md.
2. Check git status.
3. Inspect the exact files related to my request.
4. Explain the plan in simple words.
5. Make the smallest safe code change.
6. Run npm run build.
7. Test locally in a real browser/mobile viewport.
8. Tell me exactly what changed.

Do not expose secrets.
Do not run the full Supabase schema unless I explicitly approve.
Do not overwrite unrelated changes.
Keep the customer site, owner panel, and super admin data in sync.
```

## 16. Prompt For Hotel Page Layout Fix

```text
Fix the hotel-specific pages like /hotels/pushpa.

Requirements:
1. Make the page look like Stay@Maredumilli, not a separate random page.
2. Improve the “View all hotels” button.
3. Remove duplicate amenity text under the hotel name.
4. Show amenities as chips/buttons similar to the home page.
5. Show hotel name, room type, price, max adults, available rooms, location, and images clearly at a glance.
6. The page must fit perfectly on mobile and desktop with no horizontal scrolling and no need to zoom.
7. The Book button should ask for Google login if needed and then continue booking that hotel.

Files likely involved:
- scripts/generate-seo-pages.js
- styles.css
- public/styles.css

After changes:
- Run npm run build.
- Test /hotels/pushpa locally on mobile and desktop viewport.
- Confirm no horizontal overflow.
```

## 17. Prompt For Super Admin Room Blocking Fix

```text
Fix super admin room blocking.

Requirement:
Super admin must select:
- hotel
- check-in date
- check-out date
- number of rooms

Then only that number of rooms should be blocked for that date range.
It must not block the whole hotel for all days.

Also verify availability is synced in:
- customer website
- owner panel
- super admin panel

Files likely involved:
- admin.js
- admin.html
- app.js
- owner.js
- supabase-schema.sql

Do not run full schema blindly. If DB changes are needed, create a small migration file.
```

## 18. Prompt For End-To-End Testing

```text
Test the Stay@Maredumilli website end to end.

Test:
1. Open home page on mobile viewport.
2. Login with Google if needed.
3. Change check-in/check-out/adults/kids.
4. Search/filter/sort.
5. Open hotel images carousel.
6. Scroll page and confirm layout is stable.
7. Like a hotel.
8. Book a hotel with mock payment.
9. Confirm booking appears in past/upcoming bookings.
10. Open profile and logout.
11. Open /hotels/pushpa and test Like + Book.
12. Check admin room blocking.
13. Check owner dashboard.

Give me a clear bug list with severity:
- Critical
- High
- Medium
- Low
```

## 19. What Not To Do

Do not:
- Put secrets in frontend JavaScript.
- Push `.env` secrets to GitHub.
- Run full schema SQL unless needed and reviewed.
- Add unnecessary frameworks.
- Rebuild the project as Next.js unless there is a strong reason.
- Add service worker caching again unless carefully tested.
- Add lazy-loading Instagram script again if it causes slow modal loading.
- Change Supabase auth settings randomly when Google login breaks.

## 20. Simple Mental Model

Think of the project like this:

- `app.js` controls the customer experience.
- `admin.js` controls super admin.
- `owner.js` controls hotel owner.
- `styles.css` controls how everything looks.
- Supabase stores rooms, bookings, users, blocks, and settings.
- Vercel hosts the site.
- GitHub stores the code backup.
- `npm run build` prepares the final public website.
- `npx vercel --prod --yes` sends it live.

## 21. Before Every Live Deployment

Checklist:

```text
[ ] git status checked
[ ] npm run build passed
[ ] home page tested
[ ] /hotels/pushpa tested
[ ] booking flow tested
[ ] admin page tested
[ ] mobile layout tested
[ ] no secrets added
[ ] committed to GitHub
[ ] deployed to Vercel
[ ] live domain tested
```

## 22. Emergency Rollback

If a deployment breaks the live website:

1. Go to Vercel dashboard.
2. Open this project.
3. Go to Deployments.
4. Pick the last working deployment.
5. Click Promote to Production.

Then ask Antigravity/Codex to inspect what changed between the broken deployment and the working one.

