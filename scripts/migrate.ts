import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function migrate() {
  try {
    console.log('Dodawanie nowych kolumn do tabeli services...');
    
    // Sprawdź, czy kolumna short_description istnieje
    const checkShortDescription = await db.execute(sql`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'services' AND column_name = 'short_description'
    `);
    
    if (checkShortDescription.rows.length === 0) {
      console.log('Dodawanie kolumny short_description...');
      await db.execute(sql`ALTER TABLE services ADD COLUMN IF NOT EXISTS short_description TEXT`);
    } else {
      console.log('Kolumna short_description już istnieje');
    }
    
    // Sprawdź, czy kolumna long_description istnieje
    const checkLongDescription = await db.execute(sql`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'services' AND column_name = 'long_description'
    `);
    
    if (checkLongDescription.rows.length === 0) {
      console.log('Dodawanie kolumny long_description...');
      await db.execute(sql`ALTER TABLE services ADD COLUMN IF NOT EXISTS long_description TEXT`);
    } else {
      console.log('Kolumna long_description już istnieje');
    }
    
    // Sprawdź, czy kolumna benefits istnieje
    const checkBenefits = await db.execute(sql`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'services' AND column_name = 'benefits'
    `);
    
    if (checkBenefits.rows.length === 0) {
      console.log('Dodawanie kolumny benefits...');
      await db.execute(sql`ALTER TABLE services ADD COLUMN IF NOT EXISTS benefits TEXT[]`);
    } else {
      console.log('Kolumna benefits już istnieje');
    }
    
    // Sprawdź, czy kolumna scope istnieje
    const checkScope = await db.execute(sql`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'services' AND column_name = 'scope'
    `);
    
    if (checkScope.rows.length === 0) {
      console.log('Dodawanie kolumny scope...');
      await db.execute(sql`ALTER TABLE services ADD COLUMN IF NOT EXISTS scope TEXT[]`);
    } else {
      console.log('Kolumna scope już istnieje');
    }
    
    console.log('Migracja zakończona pomyślnie!');
  } catch (error) {
    console.error('Błąd podczas migracji:', error);
  } finally {
    process.exit(0);
  }
}

migrate();