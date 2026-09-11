import { stdin, stdout } from "node:process";
import { randomUUID } from "node:crypto";
import { config as loadEnv } from "dotenv";
import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

loadEnv({ path: ".env.local" });

const emails = (process.env.ADMIN_ALLOWED_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

if (emails.length === 0) {
  console.error("Set ADMIN_ALLOWED_EMAILS in .env.local before running this script.");
  process.exit(1);
}

function readSecret(prompt) {
  return new Promise((resolve, reject) => {
    stdout.write(prompt);
    stdin.setRawMode?.(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    let value = "";

    const onData = (chunk) => {
      for (const character of chunk) {
        if (character === "\u0003") {
          cleanup();
          reject(new Error("Cancelled."));
          return;
        }
        if (character === "\r" || character === "\n") {
          cleanup();
          stdout.write("\n");
          resolve(value);
          return;
        }
        if (character === "\u0008" || character === "\u007f") {
          value = value.slice(0, -1);
          continue;
        }
        value += character;
      }
    };

    const cleanup = () => {
      stdin.off("data", onData);
      stdin.pause();
      stdin.setRawMode?.(false);
    };

    stdin.on("data", onData);
  });
}

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

try {
  for (const email of emails) {
    const password = await readSecret(`Password for ${email}: `);
    if (password.length < 12) {
      throw new Error("Passwords must be at least 12 characters long.");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await client.execute({
      sql: `
        INSERT INTO "AdminUser" ("id", "email", "passwordHash", "createdAt", "updatedAt")
        VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT("email") DO UPDATE SET
          "passwordHash" = excluded."passwordHash",
          "updatedAt" = CURRENT_TIMESTAMP
      `,
      args: [randomUUID(), email, passwordHash],
    });
    console.log(`Saved hashed credentials for ${email}.`);
  }
} finally {
  client.close();
}
