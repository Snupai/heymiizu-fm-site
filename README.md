<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/Sentimental_Icon_white.png">
    <source media="(prefers-color-scheme: light)" srcset="public/Sentimental_Icon.png">
    <img src="public/Sentimental_Icon.png" alt="Miizu logo" width="96">
  </picture>
</p>

<h1 align="center">Miizu — Motion Direction</h1>

<p align="center">
  A motion-led portfolio for launches, trailers, keynotes, and brand placements—composed as one continuous, scroll-directed scene.
  <br><br>
  <a href="https://miizumelon.de"><strong>View the live experience ↗</strong></a>
</p>

## About

Miizu is a motion director’s portfolio and commission interface. Instead of presenting work in a conventional project grid, the homepage unfolds as a single choreographed sequence: intro film, expanding showreel, motion-direction statement, selected-client marquees, commission form, and typographic footer.

> **Content model:** The public landing page is source-controlled. Its showreel, work copy, and client names come from `public/showreel_2026.mp4` and `src/app/_landing/scene/content.ts`. Supabase powers authentication, administration, uploads, and commission availability, but admin-managed projects and categories do not currently feed the public homepage.

## Highlights

- **Scroll-directed storytelling** — a framed showreel expands into a full-viewport work scene as the visitor moves through the page.
- **Motion-first presentation** — staggered work statements, velocity-responsive client marquees, an animated contact reveal, and a custom-measured NVA footer wordmark.
- **Commission workflow** — Local (Germany) and International paths, service and budget selection, future-only date ranges, international phone validation, and SMTP delivery.
- **Availability controls** — administrators can pause commissions indefinitely or through a selected date, with the public form and API responding consistently.
- **Portfolio administration** — Supabase-backed tools for projects, categories, user roles, media uploads, and contact settings.
- **Responsive and accessible behavior** — narrow and short-height layouts, reduced-motion handling, semantic field feedback, visible focus states, and keyboard-operable controls.

## Tech stack

| Area             | Implementation                                              |
| ---------------- | ----------------------------------------------------------- |
| Application      | Next.js 16 App Router, React 19                             |
| Language         | Strict TypeScript with `noUncheckedIndexedAccess`           |
| Tooling          | Node.js 22.x, Bun                                           |
| Motion           | Framer Motion and custom scroll timelines                   |
| Styling          | Tailwind CSS 3, CSS Modules, global styles                  |
| UI               | Local shadcn-style components built on Radix UI and Base UI |
| Forms            | React Day Picker, `@intl-tel-input/react`, Zod              |
| Backend          | Supabase Auth, PostgreSQL, RPC, and Storage                 |
| Contact delivery | Next.js route handler and Nodemailer over SMTP              |
| Analytics        | Simple Analytics and Vercel Analytics                       |

## Getting started

### Prerequisites

- Node.js `22.x`
- [Bun](https://bun.sh/)

This repository is Bun-first. Use Bun for dependency installation and scripts, and keep `bun.lock` in sync.

Install dependencies:

```bash
bun install
```

Create a local environment file:

```bash
cp .env.example .env
```

Start the development server:

```bash
bun run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

The visual landing page can run before external services are configured. Supabase and SMTP are required to exercise contact availability, inquiry delivery, authentication, uploads, and admin features.

## Configuration

Start with `.env.example` and replace its placeholder values. The resulting `.env` file is ignored by Git.

Variables prefixed with `NEXT_PUBLIC_` are included in browser code and must never contain privileged credentials. This application uses a Supabase anonymous key—not a service-role key—so authorization must be enforced with Row Level Security, storage policies, and RPC permissions.

### Supabase

| Variable                        | Used by                                                                              |
| ------------------------------- | ------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`      | Contact availability, authentication, database access, admin operations, and uploads |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser and server Supabase clients; use the project’s public anonymous key          |

The browser client has local placeholders so the visual site can render without Supabase. The contact API has no equivalent fallback and requires real values for availability checks and submissions.

These variables are currently read directly by application code rather than validated in `src/env.js`.

### Email delivery

| Variable       | Used by                                                 |
| -------------- | ------------------------------------------------------- |
| `EMAIL_HOST`   | SMTP hostname                                           |
| `EMAIL_PORT`   | Numeric SMTP port                                       |
| `EMAIL_SECURE` | Enables secure SMTP when set to exactly `true`          |
| `EMAIL_USER`   | SMTP authentication user and fallback sender/recipient  |
| `EMAIL_PASS`   | SMTP password or provider-issued credential             |
| `EMAIL_FROM`   | Optional sender override; falls back to `EMAIL_USER`    |
| `EMAIL_TO`     | Optional recipient override; falls back to `EMAIL_USER` |

The `EMAIL_*` variables are optional during development startup and builds. Successful inquiry delivery requires a working SMTP configuration.

### Optional booking link

| Variable                  | Used by                            |
| ------------------------- | ---------------------------------- |
| `NEXT_PUBLIC_BOOKING_URL` | External “Book a call” destination |

When configured, the booking link opens in a new tab. Without it, the action falls back to a pre-addressed email to `hey@miizumelon.com`.

`NEXT_PUBLIC_BOOKING_URL` is used by the application but is not currently included in `.env.example`.

### Build controls

- `NODE_ENV` is supplied by Next.js and validated as `development`, `test`, or `production`.
- Any non-empty `SKIP_ENV_VALIDATION` value bypasses environment validation; reserve it for exceptional build workflows.
- `VERCEL` is supplied by Vercel and disables standalone output in `next.config.js`.

## Supabase prerequisites

> **Important:** The Supabase backend cannot currently be reproduced from this repository alone. There are no committed SQL migrations, seeds, Supabase configuration files, RLS policies, storage policies, or bootstrap automation. `src/lib/supabase/types.ts` describes the generated database shape, but it is not an executable schema.

The application expects the following resources:

| Type               | Resources                                                                      |
| ------------------ | ------------------------------------------------------------------------------ |
| Tables             | `contact_settings`, `categories`, `projects`, `user_roles`                     |
| Enum               | `app_role` with `admin`, `pending`, and `denied`                               |
| RPCs               | `is_admin(_user_id)`, `has_role(_role, _user_id)`, `get_user_email(user_uuid)` |
| Relationship       | `projects.category_id` → `categories.id`                                       |
| Storage buckets    | `project-videos`, `project-thumbnails`                                         |
| Settings singleton | `contact_settings.id = 'contact_form'`                                         |

Before enabling the backend:

1. Obtain the authoritative schema and policies from the existing Supabase project or its maintainer.
2. Enable email/password authentication.
3. Create an authenticated user and assign that user an `admin` role in `user_roles`.
4. Allow anonymous reads of the `contact_form` settings row so public availability checks and submissions can inspect it.
5. Protect all privileged table, RPC, and storage operations with appropriate policies.
6. Create the media buckets and configure uploaded objects for the public URLs returned by `getPublicUrl`.

> **Security:** The `/admin` redirect is a user-interface guard, not an authorization boundary. Most admin data and upload operations run through the browser Supabase client, so database and storage policies must enforce access. `PUT /api/contact` separately verifies the access token and calls `is_admin` before updating availability.

## Contact form and API

The form collects a name, email, service, budget, complete project date range, and project description. Phone number and referral source are optional. Past project dates are disabled, and the calendar displays two months on desktop or one on compact layouts.

| Method              | Purpose                                                   |
| ------------------- | --------------------------------------------------------- |
| `GET /api/contact`  | Read public commission availability                       |
| `POST /api/contact` | Validate and send an inquiry                              |
| `PUT /api/contact`  | Update availability after verifying an admin access token |

Key behavior:

- The server rechecks commission availability before sending an inquiry.
- Email and optional phone values are validated server-side; complete/non-past date-range rules are enforced in the browser.
- Inquiries are delivered by email only and are not stored in Supabase.
- The submitter is assigned as `replyTo`; no confirmation email is sent.
- Paused submissions return HTTP `423`.
- Availability failures return HTTP `503` before SMTP is attempted.
- Pause-through dates use the `Europe/Berlin` calendar and reopen the form on the following day.

Rate limiting allows one submission attempt per reported client IP per minute on each running process. It resets with the process and is not shared across instances, so it is a basic safeguard rather than distributed abuse protection.

## Routes

| Route          | Purpose                                                                |
| -------------- | ---------------------------------------------------------------------- |
| `/`            | Animated portfolio and commission experience                           |
| `/imprint`     | Bilingual English/German legal notice                                  |
| `/login`       | Supabase email/password sign-in                                        |
| `/auth`        | Alternate sign-in and account-creation interface                       |
| `/admin`       | Role-gated project, category, user, upload, and contact administration |
| `/api/contact` | Availability, inquiry delivery, and authenticated availability updates |
| `/sitemap.xml` | Dynamic sitemap                                                        |
| `/robots.txt`  | Generated crawler rules                                                |

Permanent redirects preserve older or convenience paths:

| From           | To          |
| -------------- | ----------- |
| `/contact`     | `/#contact` |
| `/projects`    | `/#work`    |
| `/projects/*`  | `/#work`    |
| `/style-guide` | `/`         |

The app also includes custom video-backed not-found and animated global error states.

## Project structure

```text
src/
├── app/
│   ├── _landing/
│   │   ├── scene/          # Intro, showreel, work timeline, and client marquees
│   │   ├── contact/        # Commission form, validation, state, and copy
│   │   └── footer/         # Landing footer and NVA wordmark measurement
│   ├── admin/              # Supabase-backed administration
│   ├── api/contact/        # Availability, inquiry, and admin settings API
│   ├── auth/               # Sign-in and account creation
│   ├── imprint/            # Bilingual legal page
│   ├── login/              # Sign-in interface
│   ├── MiizuLanding.tsx    # Public landing-page composition
│   └── layout.tsx          # Metadata, shell, analytics, and fonts
├── components/
│   ├── admin/              # Project, category, user, and contact controls
│   └── ui/                 # Shared UI primitives
├── hooks/useAuth.tsx       # Supabase session and admin-role state
├── lib/
│   ├── contact-settings.ts # Commission pause rules and Berlin date handling
│   └── supabase/           # Browser client and generated database types
├── styles/globals.css      # Tailwind layers and global styles
└── env.js                  # Server environment validation

public/                     # Showreel, intro, 404 media, icons, fonts, and artwork
next.config.js              # Redirects, media headers, image hosts, and output mode
```

## Scripts

| Command                | Purpose                                                        |
| ---------------------- | -------------------------------------------------------------- |
| `bun run dev`          | Start the development server                                   |
| `bun run build`        | Create a production build                                      |
| `bun run start`        | Start an existing production build                             |
| `bun run preview`      | Build and start the production server                          |
| `bun run check`        | Run ESLint and TypeScript checking                             |
| `bun run lint`         | Run ESLint                                                     |
| `bun run lint:fix`     | Run ESLint with automatic fixes                                |
| `bun run typecheck`    | Run `tsc --noEmit`                                             |
| `bun run format:check` | Check configured TS, TSX, JS, JSX, and MDX files with Prettier |
| `bun run format:write` | Format those files with Prettier                               |

## Quality checks

Run the canonical checks before review or deployment:

```bash
bun run check
```

```bash
bun run format:check
```

```bash
bun run build
```

There is no automated test suite or committed CI workflow. Pair the checks above with manual verification of:

- Wide desktop, short-height desktop, and narrow mobile layouts
- The complete intro, showreel, work, client, contact, and footer sequence
- Keyboard navigation and visible focus states
- Reduced-motion mode
- Available, indefinitely paused, and pause-through commission states
- Supabase and SMTP success and failure paths

## Deployment

The application requires a Next.js server or serverless runtime; it is not a static export. `/api/contact` reads Supabase, performs availability and authorization checks, and sends email through SMTP.

The current production target is Vercel. Outside Vercel, `next.config.js` enables standalone Next.js output. Before deploying:

1. Run the quality checks.
2. Configure Supabase, SMTP, and the optional booking URL.
3. Confirm the expected database resources, policies, storage buckets, and initial admin role exist.
4. If deploying under a different domain, update `metadataBase`, the robots sitemap URL, and any canonical host configuration.
5. If using a different Supabase project, add its media hostname to the `next/image` allowlist in `next.config.js`.
6. Review the globally enabled Simple Analytics and Vercel Analytics integrations against the deployed privacy disclosure.

Static videos, imagery, fonts, and icons under `public/` are part of the deployed site and must be included in the output.

## Development expectations

- Discuss changes to motion direction, client names, public copy, showreel footage, and portfolio media before implementation.
- Use Bun and preserve strict TypeScript.
- Run the documented quality checks and manually verify motion, responsive behavior, accessibility, and commission states.
- Do not commit credentials, local environment files, or private service configuration.
- Treat portfolio media and brand assets according to the rights below.

## License and asset rights

No license is included in this repository.

Public access to the source does not grant permission to reuse or redistribute the code, branding, client work, showreel footage, videos, imagery, fonts, marks, or other creative assets. Obtain explicit permission before using repository material outside contributions to this project.
