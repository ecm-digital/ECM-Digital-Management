import { db } from "../server/db";
import { sessions } from "../shared/schema";
import { sql } from "drizzle-orm";

async function createSessionsTable() {
  try {
    console.log("Creating sessions table...");
    
    // Sprawdź czy tabela już istnieje
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'sessions'
      );
    `);
    
    const exists = tableExists.rows[0].exists;
    
    if (exists) {
      console.log("Sessions table already exists");
      return;
    }
    
    // Utwórz tabelę sessions
    await db.execute(sql`
      CREATE TABLE "sessions" (
        "sid" VARCHAR NOT NULL PRIMARY KEY,
        "sess" JSONB NOT NULL,
        "expire" TIMESTAMP(6) NOT NULL
      );
      
      CREATE INDEX "IDX_session_expire" ON "sessions" ("expire");
    `);
    
    console.log("Sessions table created successfully!");
  } catch (error) {
    console.error("Error creating sessions table:", error);
  } finally {
    process.exit();
  }
}

createSessionsTable();