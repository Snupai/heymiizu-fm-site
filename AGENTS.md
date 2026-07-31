## Learned User Preferences

- Use bun for package installs and scripts, not npm or yarn.
- Prefer brand blue (`bg-brand` / `#0189ff`) for active UI controls rather than red or undefined theme tokens like `destructive`/`muted`.
- Keep email/SMTP env vars optional so local `bun run dev` can start without SMTP credentials.
- When commissions are paused, overlay a large centered notice on the contact form (fields visible underneath, dimmed), not a separate banner stacked above the fields.

## Learned Workspace Facts

- Next.js site; start the app with `bun run dev` (Turbopack) at http://localhost:3000.
- Supabase is the backend; schema changes live in `supabase/migrations/` and can be applied via the Supabase SQL Editor or CLI `supabase db push` after linking.
- Brand color tokens (`brand`, `brand-light`, `brand-dark`) are defined in Tailwind around `#0189ff`.
- Contact/commission pause state is stored in Supabase `contact_settings` and controlled from the admin Contact tab.
- `src/env.js` treats EMAIL_* vars as optional; contact form sending still requires them when testing email.
