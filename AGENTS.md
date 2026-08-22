## Learned User Preferences

- Use bun for package installs and scripts, not npm or yarn.
- Prefer brand blue (`bg-brand` / `#0189ff`) for active UI controls rather than red or undefined theme tokens like `destructive`/`muted`.
- Keep email/SMTP env vars optional so local `bun run dev` can start without SMTP credentials.
- When commissions are paused, overlay a large centered notice on the contact form (fields visible underneath, dimmed), not a separate banner stacked above the fields. Prefer a frosted-glass, Apple-like card over a chunky bordered blue box.
- In the admin Contact settings, status copy should reflect the saved pause state, not the unsaved toggle draft.
- Footer NVA wordmark should sit flush on the left edge: no leftover white gap, and the N must not hang off the page.
- Footer “represented by” should stay pinned to the middle of the NVA “N” and follow the letter’s diagonal as the wordmark scales.
- Intro showreel card should start off-screen to the right and slide in (never begin fullscreen, even if reveal delay is 0). Keep the motion fast and only slow down near the end.

## Learned Workspace Facts

- Next.js site; start the app with `bun run dev` (Turbopack). For visual checks while coding remotely, use `https://snupais-mac-mini.tail26dbaa.ts.net:3000/` rather than localhost.
- Supabase is the backend; schema changes live in `supabase/migrations/` and can be applied via the Supabase SQL Editor or CLI `supabase db push` after linking.
- Brand color tokens (`brand`, `brand-light`, `brand-dark`) are defined in Tailwind around `#0189ff`.
- Contact/commission pause state is stored in Supabase `contact_settings` and controlled from the admin Contact tab.
- `src/env.js` treats EMAIL_* vars as optional; contact form sending still requires them when testing email.
- Landing page is `src/app/MiizuLanding.tsx` composing `src/app/_landing/` (hero/work scene, contact, footer); styles live in `src/app/miizu-landing.module.css`.
- Intro timings and scroll-progress constants live in `src/app/_landing/scene/scroll-timeline.ts`. Scroll stays locked until the intro finishes (`useIntroSequence.ts`), not via a separate lock-duration constant.
- Looping showreel is `public/showreel_2026.mp4`.
