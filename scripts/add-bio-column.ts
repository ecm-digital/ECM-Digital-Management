import { db } from "../server/db";
import { sql } from "drizzle-orm";

async function addBioColumn() {
  try {
    console.log("Sprawdzanie czy kolumna 'bio' istnieje...");
    
    // Sprawdź czy kolumna istnieje
    const columnExists = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='users' AND column_name='bio'
    `);
    
    if (columnExists.rows.length === 0) {
      console.log("Kolumna 'bio' nie istnieje. Dodawanie...");
      
      // Dodaj kolumnę bio
      await db.execute(sql`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT
      `);
      
      console.log("Kolumna 'bio' została dodana!");
    } else {
      console.log("Kolumna 'bio' już istnieje!");
    }
    
    console.log("Migracja zakończona pomyślnie!");
  } catch (error) {
    console.error("Błąd podczas dodawania kolumny 'bio':", error);
  } finally {
    process.exit(0);
  }
}

// Uruchom migrację
addBioColumn();