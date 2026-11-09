# بیار & لەنیا — Wedding invitation website

An animated, mobile-first Kurdish (Sorani, RTL) wedding invitation built from the original card design.

**Stack:** Vite + React + TypeScript, Framer Motion, Supabase (visitor counter), hosted on Vercel.

## What guests see

1. A welcome screen: blooming corner bouquets, gold dust, the couple's names drawn inside a gold ring, the welcome message and a **بەخێربێیت** button.
2. The doors part, and the invitation card comes to life: the gold frame draws itself, flowers bloom and sway, the Basmala and names are written in right-to-left, petals fall.
3. A live countdown and a public counter: **"N کەس ئەم بانگهێشتنامەیەیان بینیوە"** (unique visitors, each browser counted once).
4. Venue section with a Google Map and a **شوێن لەسەر نەخشە** button that opens directions.

## Edit the wedding details

Everything lives in [`src/config/wedding.ts`](src/config/wedding.ts):

- names, date text, time text, the countdown start time (`startsAt`)
- venue location: `lat` / `lng` (embedded map) and `mapsLink` (the map button)

All other Kurdish text is in [`src/config/text.ts`](src/config/text.ts).

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in the two Supabase values
npm run dev                  # http://localhost:5173
```

Without the Supabase values the site still works; only the visitor counter is hidden.

## Supabase setup (once)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.
3. In **Project Settings → API**, copy the **Project URL** and the **anon / publishable** key.
   (Never use the `service_role` / secret key in this project.)

Security: Row Level Security is on and the table has no public policies. Guests can only call two
functions: count their visit, and read the visitor total. No personal data is stored — just a random
id per browser.

## Deploy to Vercel

1. Push this folder to a GitHub repository and import it in [vercel.com/new](https://vercel.com/new)
   (Vercel detects Vite automatically; `vercel.json` is already set up).
2. In **Project → Settings → Environment Variables** add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy. Link previews (WhatsApp, Telegram, Viber) use the original card image and pick up the
   Vercel domain automatically. For a custom domain, also set `VITE_SITE_URL=https://your-domain`.

## Project structure

```
public/            images cut from the original card, self-hosted fonts, link-preview image
supabase/schema.sql
src/
  config/          wedding details + all Kurdish text   ← edit these
  components/      loader, card, frame, ornaments, countdown, visitor counter, map, petals, particles
  lib/             Supabase client, visitor counter, intro timing, countdown, motion presets
  styles/          fonts + global styles
```

Animations respect the phone's "reduce motion" setting, and the petals and gold dust pause when the tab is hidden.
