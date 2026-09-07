// Applies a Prisma migration.sql file to the remote Turso database (Prisma Migrate can't target libsql:// directly).
// Usage: node scripts/apply-migration.mjs prisma/migrations/<timestamp>_<name>/migration.sql
import { readFileSync } from "node:fs";
import { config as loadEnv } from "dotenv";
import { createClient } from "@libsql/client";

loadEnv({ path: ".env.local" });

const migrationPath = process.argv[2];
if (!migrationPath) {
  console.error("Usage: node scripts/apply-migration.mjs <path-to-migration.sql>");
  process.exit(1);
}

const sql = readFileSync(migrationPath, "utf8");
const statements = sql
  .split(";")
  .map((s) =>
    s
      .split("\n")
      .filter((line) => !line.trim().startsWith("--"))
      .join("\n")
      .trim()
  )
  .filter((s) => s.length > 0);

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

for (const statement of statements) {
  console.log(`Running: ${statement.slice(0, 60)}...`);
  await client.execute(statement);
}

console.log("Migration applied to Turso.");
client.close();
