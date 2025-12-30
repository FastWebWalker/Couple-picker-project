# Couple Picker / Date Roulette

A Next.js 14 (App Router) web app for couples to browse and spin curated roulettes, create their own roulettes, and manage options with Supabase Auth + Postgres. The UI is Tailwind-based with shadcn/ui components and lightweight animations.

## Features

- Browse prebuilt roulettes and spin them in the UI.
- Create custom roulettes with options (authenticated users only).
- Add options to a roulette; for prebuilt roulettes non-admin users submit proposals for approval.
- Admin review flow for proposed options.
- Supabase Auth (email/password and OAuth).
- Server-side session handling via Next middleware.

## Tech Stack

- Next.js 14 (App Router) + React 18 + TypeScript
- Tailwind CSS + shadcn/ui (Radix UI)
- Supabase: Auth + Postgres + SSR helpers
- zod validation
- framer-motion, react-custom-roulette, canvas-confetti

## Project Structure

- `src/app` - App Router pages and API routes
- `src/components` - UI and feature components
- `src/lib` - Auth helpers, validators, supabase clients, types
- `src/hooks` - Custom hooks
- `supabase/migrations` - SQL schema + seed data
- `public` - Static assets

## App Routes

- `/` - Home page with featured roulettes grid
- `/roulettes` - List of roulettes
- `/roulette/[id]` - Single roulette page + spin UI
- `/create` - Create roulette form
- `/admin` - Admin panel (protected)
- `/sign-in` - Sign-in page
- `/sign-up` - Sign-up page
- `/auth/callback` - Supabase OAuth callback

## API Routes

All routes are under `src/app/api` and use Supabase Admin for database access.

- `POST /api/roulettes`
  - Create a new roulette (auth required)
  - Validates payload with `rouletteCreateSchema`
  - Creates roulette + options

- `PATCH /api/roulettes/[id]`
  - Update roulette (auth required)
  - Only owner can update, and only non-prebuilt roulettes

- `DELETE /api/roulettes/[id]`
  - Delete roulette (auth required)
  - Only owner can delete, and only non-prebuilt roulettes

- `POST /api/roulettes/[id]/options`
  - Add option to a roulette (auth required)
  - If roulette is prebuilt:
    - Admins add directly
    - Users create a proposal (pending)
  - If roulette is user-owned, only owner can add

- `PATCH /api/options/[id]`
  - Update option label (auth required)
  - Only owner can edit, and only for non-prebuilt roulette

- `DELETE /api/options/[id]`
  - Delete option (auth required)
  - Only owner can delete, and only for non-prebuilt roulette

- `GET /api/admin/proposals`
  - List pending proposals (admin only)

- `PATCH /api/admin/proposals`
  - Approve or reject a proposal (admin only)
  - On approve, proposal becomes an option

- `GET /api/me`
  - Returns current user role; ensures user record exists

## Data Model (Supabase)

Defined in `supabase/migrations/20251224_create_tables.sql`.

- `users`
  - `id` (uuid, PK)
  - `supabase_id` (uuid, unique)
  - `role` (user | admin)
  - `created_at`

- `roulettes`
  - `id` (uuid, PK)
  - `owner_id` (uuid, FK -> users.id, nullable)
  - `is_prebuilt` (boolean)
  - `title`, `description`, `icon`
  - `created_at`

- `options`
  - `id` (uuid, PK)
  - `roulette_id` (uuid, FK -> roulettes.id)
  - `label` (text)
  - `weight` (int, nullable)
  - `created_at`

- `proposals`
  - `id` (uuid, PK)
  - `roulette_id` (uuid, FK -> roulettes.id)
  - `label` (text)
  - `status` (pending | approved | rejected)
  - `created_at`

The migration also seeds a set of prebuilt roulettes and options.

## Auth and Roles

- Auth is handled by Supabase.
- `ensureDbUser()` creates a row in `users` when a new Supabase user signs in.
- Role-based checks:
  - Middleware protects `/admin` by requiring a session cookie.
  - API routes enforce owner/admin checks where required.

## Environment Variables

Create a `.env` file based on `.env.example`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Setup

1) Install dependencies:

```bash
npm i
```

2) Create `.env` from `.env.example` and add your Supabase keys.

3) Apply migrations (requires Supabase CLI and a linked project):

```bash
supabase link --project-ref <PROJECT_REF>
supabase db push
```

4) Run the dev server:

```bash
npm run dev
```

Open http://localhost:3000

## Scripts

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run start` - start production server
- `npm run lint` - run ESLint

## Notes

- Server-side Supabase access uses the service role key (`src/lib/supabase/admin.ts`).
- Session refresh is handled in `middleware.ts` + `src/lib/supabase/middleware.ts`.
- The seed data in the migration file is used for prebuilt roulettes.
