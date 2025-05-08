import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { users } from '../shared/schema';
import ws from 'ws';
import { createHash, randomBytes } from 'crypto';

// Konfiguracja websocketów dla Neon
neonConfig.webSocketConstructor = ws;

// Funkcja do haszowania hasła
async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const hash = createHash('sha256');
  hash.update(password + salt);
  return `${hash.digest('hex')}.${salt}`;
}

async function createTestUser() {
  console.log("Inicjalizacja połączenia z bazą danych...");
  
  // Połączenie z bazą danych
  if (!process.env.DATABASE_URL) {
    throw new Error("Zmienna środowiskowa DATABASE_URL nie jest ustawiona!");
  }
  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);
  
  console.log("Połączenie nawiązane, tworzenie użytkownika testowego...");
  
  // Hashujemy hasło
  const hashedPassword = await hashPassword("testpass");
  
  try {
    // Usuwamy użytkownika testowego jeśli istnieje (po nazwie użytkownika)
    const existingUser = await db.select().from(users).where(users.username === 'testuser');
    if (existingUser.length > 0) {
      console.log(`Usuwanie istniejącego użytkownika: ${existingUser[0].username}, ID: ${existingUser[0].id}`);
      await db.delete(users).where(users.username === 'testuser');
    }
    
    // Tworzymy nowego użytkownika testowego - tutaj id powinno być auto-inkrementowane
    const [newUser] = await db.insert(users).values({
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'client',
      firstName: 'Test',
      lastName: 'User',
      authMethod: 'local',
      createdAt: new Date(),
    }).returning();
    
    console.log(`Użytkownik testowy utworzony: ID=${newUser.id}, typ ID=${typeof newUser.id}`);
    console.log("Dane użytkownika:", newUser);
    
  } catch (error) {
    console.error("Błąd podczas tworzenia użytkownika testowego:", error);
  } finally {
    console.log("Zamykanie połączenia z bazą danych...");
    await pool.end();
    console.log("Gotowe!");
  }
}

createTestUser().catch(console.error);