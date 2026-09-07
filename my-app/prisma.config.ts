import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

loadEnv({ path: ".env.local" });

// `prisma migrate` doesn't support the libsql:// scheme directly, so migrations are
// generated against a local SQLite file here and applied to Turso separately
// (see scripts/apply-migration.mjs). The app itself connects to Turso via lib/prisma.ts.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: "file:./prisma/dev.db",
  },
});
