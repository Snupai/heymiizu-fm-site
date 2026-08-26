## Learned User Preferences

- Use bun for package installs and scripts, not npm or yarn.
- Prefer brand blue (`bg-brand` / `#0189ff`) for active UI controls rather than red or undefined theme tokens like `destructive`/`muted`.
- Keep email/SMTP env vars optional so local `bun run dev` can start without SMTP credentials (`src/env.js`); contact form sending still requires them when testing email.
- Contact form pause and success states should overlay a large centered frosted-glass card on the form (fields visible underneath, dimmed), not a banner or small status line. All fields including selects must look disabled under the overlay; success can dismiss via a small X or after a few seconds.
- In the admin Contact settings, status copy should reflect the saved pause state, not the unsaved toggle draft.
- Footer NVA wordmark should sit flush on the left edge (no leftover white gap, N must not hang off the page), scale with viewport so it stays large on big displays, and have no white space above or below — the NVA blue should meet the contact section blue. On small screens do not stretch it to full width.
- Footer “represented by” should sit on top of the NVA “N” diagonal (not behind the letter), stay visible after reload, and move with resize. Pin it with CSS percentages of the NVA panel (not pixels or JS re-measure on resize) so it scales with the wordmark.
- Intro showreel card should start off-screen to the right and slide in (never begin fullscreen, even if reveal delay is 0). The preload video should play for about 3–4 seconds before the card and header move in; they must not start before the preload has actually begun. Keep the motion fast and only slow down near the end. Do not hand the card off to scroll-driven transforms until the slide has finished; early scroll unlock must not cut off or snap the remaining ease-out.
- Landing scroll should feel like a trackpad: accelerate quickly from rest (no jump), then coast to a stop. Use Lenis, not a custom scroller. Ignore pause stops while the user drags the scrollbar so it does not hitch.
- Client marquees should run in opposite directions; scroll may speed them up only modestly (cap about 1.3x) on both rows.
- Unlocking scroll must not shift the page. Show only a slim overlay scrollbar pill (no white track/line); keep the intro/showreel visually centered and full-width.
- Pre-select the contact region (Local Germany vs International) from IP/country when possible; otherwise default to International.

## Learned Workspace Facts

- Next.js site; start the app with `bun run dev` (Turbopack). For visual checks while coding remotely, use `https://snupais-mac-mini.tail26dbaa.ts.net:3000/` rather than localhost.
- Supabase is the backend; schema changes live in `supabase/migrations/` and can be applied via the Supabase SQL Editor or CLI `supabase db push` after linking.
- Brand color tokens (`brand`, `brand-light`, `brand-dark`) are defined in Tailwind around `#0189ff`.
- Contact/commission pause state is stored in Supabase `contact_settings` and controlled from the admin Contact tab.
- Document title in `src/app/layout.tsx` defaults to `miizumelon.com`; on each load there is a 25% chance to use one of `miiiiiiiiizu`, `Miizu - Motion Design`, or `Your new motion designer ;)` instead.
- Landing page is `src/app/MiizuLanding.tsx` composing `src/app/_landing/` (hero/work scene, contact, footer); styles live in `src/app/miizu-landing.module.css`. Small-width (`layout === "compact"`) uses `src/app/_landing/mobile/` (`MobileLanding.tsx`): no preload/showreel intro; “Hey I’m miizu” is on-page text; work lines use the desktop stagger but trigger when `#work` enters view; the clients marquee is a full-width sibling after `#work`, not inside it; stacked contact panes share page scroll (no nested scrollports).
- Intro timings, scroll-progress constants, and per-stop pause holds (`SCROLL_PAUSE_STOPS`) live in `src/app/_landing/scene/scroll-timeline.ts`. Work uses a separate up-stop (`SCROLL_WORK_UP_PAUSE`) from the down-stop, and the work overlay/text should reverse on scroll-up (lines out, then gradient). Card/header reveal waits until preload `currentTime` reaches `INTRO_REVEAL_DELAY_MS` (`hasIntroPlaybackReachedReveal`), not wall-clock from mount. `INTRO_SCROLL_UNLOCK_LEAD_MS` can unlock scroll before the intro ends (`useIntroSequence.ts`), but the showreel card stays on the intro slide until that motion actually finishes.
- Looping showreel is `public/showreel_2026.mp4`; intro preload clip is `public/preload_v2.mp4`.
- Smooth scroll uses Lenis (`src/app/_landing/scene/SmoothScroll.tsx`, `useSmoothScroll.ts`), RAF-synced with Framer Motion; intro lock is `document.documentElement.dataset.introLock`.
- Contact Local/International default comes from request geo headers (`x-vercel-ip-country`, `cf-ipcountry`, and fallbacks) on `src/app/page.tsx`; unknown country falls back to International.
- Book-a-call is coming soon; keep the previous live button markup commented in `ContactSection.tsx` instead of deleting it.
- Contact notification emails are built in `src/lib/contact-email.ts`; show Germany vs International near the top, label the selected service as the submission type, and do not include an Assets option.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

- Bun is the package manager (see `bun.lock`); Node 22 is already on the base image. The startup update script runs `bun install`. Standard scripts live in `package.json` (`bun run dev`, `bun run build`, `bun run check`, `bun run lint`, `bun run typecheck`).
- Run the dev server with `bun run dev` (Next.js 16 + Turbopack) on `http://localhost:3000`. Copy `.env.example` to `.env` if `.env` is missing; SMTP/Supabase vars are placeholders and are fine for the public landing page.
- The landing page and interactive commission/contact form render and accept input without any backend. `GET /api/contact` returns HTTP 500 (and submissions fail) until real `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set — this is expected locally, not a broken environment. The Supabase schema is not reproducible from this repo (see README "Supabase prerequisites").
- `next dev` (Next.js 16) re-appends a `<!-- BEGIN:nextjs-agent-rules -->` block to `AGENTS.md` on every run, showing up as an uncommitted change. This is harmless; either ignore it or commit it. Disable via `agentRules: false` in `next.config.js` if undesired.
- `bun run check` runs `eslint` then `tsc`. ESLint currently reports one pre-existing error in `src/app/_landing/scene/useSmoothScroll.ts` (`react-hooks/refs`), which stops the chained `tsc` step; `bun run typecheck` passes on its own.
