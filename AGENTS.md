## Learned User Preferences

- Use bun for package installs and scripts, not npm or yarn.
- Prefer brand blue (`bg-brand` / `#0189ff`) for active UI controls rather than red or undefined theme tokens like `destructive`/`muted`.
- Keep email/SMTP env vars optional so local `bun run dev` can start without SMTP credentials.
- When commissions are paused, overlay a large centered notice on the contact form (fields visible underneath, dimmed), not a separate banner stacked above the fields. Prefer a frosted-glass, Apple-like card over a chunky bordered blue box.
- In the admin Contact settings, status copy should reflect the saved pause state, not the unsaved toggle draft.
- Footer NVA wordmark should sit flush on the left edge (no leftover white gap, N must not hang off the page) and scale with viewport so it stays large on big displays.
- Footer “represented by” should stay pinned to the middle of the NVA “N” and follow the letter’s diagonal as the wordmark scales.
- Intro showreel card should start off-screen to the right and slide in (never begin fullscreen, even if reveal delay is 0). Keep the motion fast and only slow down near the end.
- Landing scroll should feel like a trackpad: accelerate quickly from rest (no jump), then coast to a stop. Use Lenis, not a custom scroller.
- Client marquees should run in opposite directions; scroll may speed them up only modestly (cap about 1.3x) on both rows.
- Unlocking scroll must not shift the page for the scrollbar; keep the intro/showreel visually centered and full-width.
- Pre-select the contact region (Local Germany vs International) from IP/country when possible; otherwise default to International.

## Learned Workspace Facts

- Next.js site; start the app with `bun run dev` (Turbopack). For visual checks while coding remotely, use `https://snupais-mac-mini.tail26dbaa.ts.net:3000/` rather than localhost.
- Supabase is the backend; schema changes live in `supabase/migrations/` and can be applied via the Supabase SQL Editor or CLI `supabase db push` after linking.
- Brand color tokens (`brand`, `brand-light`, `brand-dark`) are defined in Tailwind around `#0189ff`.
- Contact/commission pause state is stored in Supabase `contact_settings` and controlled from the admin Contact tab.
- `src/env.js` treats EMAIL_* vars as optional; contact form sending still requires them when testing email.
- Landing page is `src/app/MiizuLanding.tsx` composing `src/app/_landing/` (hero/work scene, contact, footer); styles live in `src/app/miizu-landing.module.css`.
- Intro timings, scroll-progress constants, and per-stop pause holds (`SCROLL_PAUSE_STOPS`) live in `src/app/_landing/scene/scroll-timeline.ts`. Scroll stays locked until the intro finishes (`useIntroSequence.ts`); `INTRO_SCROLL_UNLOCK_LEAD_MS` unlocks a bit before the intro ends.
- Looping showreel is `public/showreel_2026.mp4`.
- Smooth scroll uses Lenis (`src/app/_landing/scene/SmoothScroll.tsx`, `useSmoothScroll.ts`), RAF-synced with Framer Motion; intro lock is `document.documentElement.dataset.introLock`.
- Contact Local/International default comes from request geo headers (`x-vercel-ip-country`, `cf-ipcountry`, and fallbacks) on `src/app/page.tsx`; unknown country falls back to International.
- Book-a-call is coming soon; keep the previous live button markup commented in `ContactSection.tsx` instead of deleting it.
