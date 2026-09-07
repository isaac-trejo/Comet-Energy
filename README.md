# Comet Energy Website
Web application for Comet Energy student organization at UT Dallas.

## Setup

1. Clone the repo and install base dependencies:
   ```
   cd my-app
   npm install
   ```
2. Install the additional project dependencies:
   ```
   npm install prisma @prisma/client @prisma/adapter-libsql @libsql/client next-auth@beta react-hook-form
   npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/core
   ```
3. Ask about Turso database access.
4. Create a Google OAuth client (Google Cloud Console → APIs & Services → Credentials) and note the client ID/secret.
5. Copy the env template and fill in the values from steps 3-4:
   ```
   cp .env.example .env.local
   ```
6. Generate an Auth.js secret and paste it into `.env.local` as `AUTH_SECRET`:
   ```
   npx auth secret
   ```
7. Generate the Prisma client and run migrations against the Turso database:
   ```
   npx prisma generate
   npx prisma migrate dev
   ```
8. Start the dev server:
   ```
   npm run dev
   ```

## Tools

### Next.js
The React framework the app is built on, handling routing, server components, and Server Actions used by the admin panel to create/update/delete events and members.

### Auth.js (NextAuth v5)
Manages sign-in for the admin panel. Verifies the user's identity via Google OAuth, then a custom `signIn` callback checks the email against an allowlist so only the President and Vice President can reach `/admin`.

### Google OAuth
The identity provider used for admin sign-in. It only confirms who a user is, then Auth.js's allowlist check is what actually restricts access.

### Prisma
The ORM layer between the app and the database. Defines the `Event` and `Member` schema, runs migrations, and provides type-safe queries so the app never writes raw SQL.

### Turso (libSQL)
The hosted serverless SQLite database that stores events and member data. Turso runs the libSQL engine and gives the app a connection URL and auth token; well suited to the small amount of data this project needs.

### FullCalendar
Renders the month-view calendar UI on the public calendar page and displays the events fetched from the database. It only handles the visual calendar, not data storage.

### React Hook Form
Powers the admin panel's event and member forms. It has built-in validation rules (required fields, max length, pattern matching, custom `validate` functions) that we use directly instead of adding a separate schema library.

### Vercel
Hosting/deployment platform for the Next.js app, configured with the same environment variables as `.env.local`.
