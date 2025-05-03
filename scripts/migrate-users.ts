import { sql } from "drizzle-orm";
import { db } from "../server/db";

async function migrateUsersTable() {
  console.log("Starting migration of users table...");

  try {
    // Dodanie kolumny email (jeśli nie istnieje)
    await db.execute(sql`
      ALTER TABLE "users" 
      ADD COLUMN IF NOT EXISTS "email" TEXT
    `);
    console.log("Added email column");

    // Dodanie kolumny first_name (jeśli nie istnieje)
    await db.execute(sql`
      ALTER TABLE "users" 
      ADD COLUMN IF NOT EXISTS "first_name" TEXT
    `);
    console.log("Added first_name column");

    // Dodanie kolumny last_name (jeśli nie istnieje)
    await db.execute(sql`
      ALTER TABLE "users" 
      ADD COLUMN IF NOT EXISTS "last_name" TEXT
    `);
    console.log("Added last_name column");

    // Dodanie kolumny company (jeśli nie istnieje)
    await db.execute(sql`
      ALTER TABLE "users" 
      ADD COLUMN IF NOT EXISTS "company" TEXT
    `);
    console.log("Added company column");

    // Dodanie kolumny role (jeśli nie istnieje)
    await db.execute(sql`
      ALTER TABLE "users" 
      ADD COLUMN IF NOT EXISTS "role" TEXT DEFAULT 'client'
    `);
    console.log("Added role column");

    // Dodanie kolumny profile_image (jeśli nie istnieje)
    await db.execute(sql`
      ALTER TABLE "users" 
      ADD COLUMN IF NOT EXISTS "profile_image" TEXT
    `);
    console.log("Added profile_image column");

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit(0);
  }
}

// Uruchomienie migracji
migrateUsersTable();