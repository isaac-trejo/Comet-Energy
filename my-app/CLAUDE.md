@AGENTS.md

# Comet Energy project context

This is a Next.js 16 App Router application for the Comet Energy student organization at UT Dallas. Use TypeScript, React 19, and the existing Tailwind CSS setup. Keep changes focused on the current project and preserve the conventions in `AGENTS.md`.

## Agreed stack

### Next.js
Use Next.js for routing, server components, server actions, metadata, and deployment integration. Public pages will describe the organization, display the calendar, and list current members. The protected `/admin` area will manage events and members.

### Auth.js (NextAuth v5) with Credentials provider
Use Auth.js for sessions and authentication in the admin panel, using the **Credentials provider** with email + password (not Google OAuth or any third-party identity provider). This avoids depending on whether university `.edu` accounts are backed by Google Workspace or Microsoft 365. Access is restricted implicitly: only the President and Vice President have rows in the `AdminUser` table, so only they can authenticate at all.

Password handling rules:
- Hash passwords with `bcrypt` (or `bcryptjs`) at account creation: `bcrypt.hash(password, 12)`. Store only the resulting hash in `AdminUser.passwordHash`, never the plaintext password.
- There is no "dehashing" — verify a login attempt with `bcrypt.compare(submittedPassword, storedHash)`, which re-hashes the submission and compares, never reverses the stored hash.
- Return the same generic "invalid email or password" error whether the email doesn't exist or the password is wrong, so failed attempts don't reveal which admin emails are valid.
- `AdminUser` seeding (the initial two accounts) happens via a one-time setup script, not self-registration.

**TODO (not yet implemented): add rate limiting / lockout on the login route** — track `failedAttempts`/`lockedUntil` on `AdminUser` (or a separate attempts table) to lock an account out after repeated failures. Deferred for now; revisit before this goes live for real use.

### Turso and libSQL
Use Turso as the hosted serverless SQLite-compatible database and libSQL as its database engine/client protocol. Store `Event` and `Member` records there. Keep `DATABASE_URL` and `TURSO_AUTH_TOKEN` server-only; never expose the token through a `NEXT_PUBLIC_` variable or client component.

### Prisma
Use Prisma for the `Event` and `Member` data models and typed database queries. Runtime queries use `@prisma/adapter-libsql` through `lib/prisma.ts`. SQLite does not support native Prisma enums in this setup, so role values are stored as strings and validated at the application boundary.

Prisma 7 does not allow `datasource.url` in `schema.prisma`, so the CLI configuration belongs in `prisma.config.ts`. Prisma Migrate does not accept Turso's `libsql://` URL directly. Generate migrations against the ignored local `prisma/dev.db`, then apply the generated SQL to Turso with:

```powershell
npx prisma migrate dev --name <migration-name>
node scripts/apply-migration.mjs prisma/migrations/<migration-folder>/migration.sql
```

Do not point Prisma Migrate directly at `libsql://` unless the project is deliberately migrated to a supported workflow.

### FullCalendar
Use FullCalendar with its React and day-grid packages to render the public current-month calendar. FullCalendar is a presentation component: fetch event data on the server through Prisma and pass calendar-compatible event objects to it. It does not store or authorize events.

### React Hook Form
Use React Hook Form for event and member admin forms. Use its built-in rules and custom `validate` functions for required fields, lengths, patterns, and date relationships. Zod is intentionally not part of this project. Every server action must still validate and authorize submitted data again before calling Prisma because client-side validation is not a security boundary.

### Vercel
Use Vercel for production Next.js hosting. Configure the same required environment variables in the Vercel project settings, including the Turso URL/token and Auth.js credentials. Do not commit `.env.local` or any secret token.

## Environment variables

The example template is `my-app/.env.example`; local secrets belong in `.env.local`:

- `DATABASE_URL`: Turso `libsql://` database URL.
- `TURSO_AUTH_TOKEN`: server-only token for the current developer/environment.
- `AUTH_SECRET`: Auth.js session secret.
- `AUTH_URL`: local or deployed application URL.
- `NEXT_PUBLIC_APP_URL`: public URL only when a client-visible URL is required.

## Important project files

- `prisma/schema.prisma`: `Event`, `Member`, and `AdminUser` (email, `passwordHash`) models.
- `prisma.config.ts`: Prisma 7 schema and local migration datasource configuration.
- `lib/prisma.ts`: cached Prisma client using the Turso libSQL adapter.
- `scripts/apply-migration.mjs`: applies generated migration SQL to Turso when the CLI is unavailable.
- `app/calendar/**`: public calendar UI.
- `app/members/**`: public member list.
- `app/admin/**`: protected event/member CRUD UI.
- `auth.ts` or `lib/auth.ts`: Auth.js Credentials provider configuration (bcrypt compare against `AdminUser`).
- `middleware.ts`: protects `/admin/**` routes.
- `requirements.txt`: additional package list for project setup; keep it consistent with `package.json`.

## Implementation rules

- Keep database credentials and Auth.js secrets server-side.
- Enforce admin authorization in server-side code, not only in UI or middleware.
- Reuse the existing Prisma singleton instead of constructing a client per request.
- Keep event/member CRUD in server actions or other server-only boundaries.
- Use ASCII in new files unless the content requires otherwise.
- Do not add Zod, another ORM, another database provider, or a second authentication provider without revisiting this decision record.
- Rate limiting/lockout on the login route is intentionally not implemented yet; do not assume it exists until it's added (see TODO above).
