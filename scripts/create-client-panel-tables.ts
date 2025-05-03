import { sql } from "drizzle-orm";
import { db } from "../server/db";

async function createClientPanelTables() {
  console.log("Starting creation of client panel tables...");

  try {
    // Dodaj brakujące kolumny do tabeli orders
    console.log("Updating orders table...");
    await db.execute(sql`
      ALTER TABLE "orders" 
      ADD COLUMN IF NOT EXISTS "order_id" TEXT,
      ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'Nowe',
      ADD COLUMN IF NOT EXISTS "assigned_to_id" INTEGER REFERENCES "users"("id"),
      ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP DEFAULT now(),
      ADD COLUMN IF NOT EXISTS "deadline" TIMESTAMP
    `);
    
    // Aktualizuj istniejące rekordy bez order_id
    await db.execute(sql`
      UPDATE "orders" 
      SET "order_id" = CONCAT('ECM-', FLOOR(EXTRACT(EPOCH FROM created_at))::text, '-', id::text)
      WHERE "order_id" IS NULL
    `);
    
    // Teraz ustaw NOT NULL constraint
    await db.execute(sql`
      ALTER TABLE "orders" 
      ALTER COLUMN "order_id" SET NOT NULL
    `);

    console.log("Orders table updated");

    // Tworzenie tabeli project_files (jeśli nie istnieje)
    console.log("Creating project_files table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "project_files" (
        "id" SERIAL PRIMARY KEY,
        "order_id" INTEGER REFERENCES "orders"("id") NOT NULL,
        "file_name" TEXT NOT NULL,
        "file_url" TEXT NOT NULL,
        "file_type" TEXT,
        "file_size" INTEGER,
        "uploaded_by_id" INTEGER REFERENCES "users"("id"),
        "created_at" TIMESTAMP DEFAULT now()
      )
    `);
    console.log("project_files table created");

    // Tworzenie tabeli messages (jeśli nie istnieje)
    console.log("Creating messages table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "messages" (
        "id" SERIAL PRIMARY KEY,
        "order_id" INTEGER REFERENCES "orders"("id") NOT NULL,
        "sender_id" INTEGER REFERENCES "users"("id") NOT NULL,
        "receiver_id" INTEGER REFERENCES "users"("id"),
        "content" TEXT NOT NULL,
        "is_read" BOOLEAN DEFAULT false,
        "created_at" TIMESTAMP DEFAULT now()
      )
    `);
    console.log("messages table created");

    // Tworzenie tabeli project_notes (jeśli nie istnieje)
    console.log("Creating project_notes table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "project_notes" (
        "id" SERIAL PRIMARY KEY,
        "order_id" INTEGER REFERENCES "orders"("id") NOT NULL,
        "created_by_id" INTEGER REFERENCES "users"("id") NOT NULL,
        "content" TEXT NOT NULL,
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now()
      )
    `);
    console.log("project_notes table created");

    // Tworzenie tabeli project_milestones (jeśli nie istnieje)
    console.log("Creating project_milestones table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "project_milestones" (
        "id" SERIAL PRIMARY KEY,
        "order_id" INTEGER REFERENCES "orders"("id") NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "status" TEXT DEFAULT 'Oczekujące',
        "due_date" TIMESTAMP,
        "completed_at" TIMESTAMP,
        "created_at" TIMESTAMP DEFAULT now()
      )
    `);
    console.log("project_milestones table created");

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit(0);
  }
}

// Uruchomienie migracji
createClientPanelTables();