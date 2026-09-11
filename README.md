# Comet Energy Website
Web application for Comet Energy student organization at UT Dallas.

## Setup

1. Clone the repo and install base dependencies:
   ```
   cd my-app
   npm install
   ```
2. Install the additional project dependencies listed in `requirements.txt`:
   ```
   npm install (Get-Content requirements.txt)
   ```
   (macOS/Linux shells: `npm install $(cat requirements.txt)`)
3. Ask about Turso database access and copy the database URL and token into `.env.local`.
4. Copy the env template:
   ```
   cp .env.example .env.local
   ```
5. Generate an Auth.js secret and paste it into `.env.local` as `AUTH_SECRET`:
   ```
   npx auth secret
   ```
6. Generate the Prisma client and create the migration locally:
   ```
   npx prisma generate
   npx prisma migrate dev --name <migration-name>
   ```
   Apply the generated SQL to Turso:
   ```
   node scripts/apply-migration.mjs prisma/migrations/<migration-folder>/migration.sql
   ```
7. Add the President and Vice President emails to `ADMIN_ALLOWED_EMAILS`, then create their password hashes. The script never stores plaintext passwords:
   ```
   node scripts/seed-admins.mjs
   ```
8. Start the dev server:
   ```
   npm run dev
   ```

## Tools

### Next.js
The React framework the app is built on, handling routing, server components, and Server Actions used by the admin panel to create/update/delete events and members.

### Auth.js (NextAuth v5)
Manages sessions for the admin panel using the Credentials provider. It compares the submitted email and password against the seeded `AdminUser` records; passwords are stored only as bcrypt hashes.

### Prisma
The ORM layer between the app and the database. Defines the `Event`, `Member`, and `AdminUser` schema, generates migrations, and provides type-safe queries so the app never writes raw SQL in application code.

### Turso (libSQL)
The hosted serverless SQLite database that stores events and member data. Turso runs the libSQL engine and gives the app a connection URL and auth token; well suited to the small amount of data this project needs.

### FullCalendar
Renders the month-view calendar UI on the public calendar page and displays the events fetched from the database. It only handles the visual calendar, not data storage.

### React Hook Form
Powers the admin panel's event and member forms. It has built-in validation rules (required fields, max length, pattern matching, custom `validate` functions) that we use directly instead of adding a separate schema library.

### Vercel
Hosting/deployment platform for the Next.js app, configured with the same environment variables as `.env.local`.
