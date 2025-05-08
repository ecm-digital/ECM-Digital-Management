import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { users } from '../shared/schema';
import { eq } from 'drizzle-orm';
import ws from 'ws';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

// Konfiguracja websocketów dla Neon
neonConfig.webSocketConstructor = ws;

// Asynchroniczna wersja scrypt
const scryptAsync = promisify(scrypt);

// Funkcja do haszowania hasła (ta sama co w server/storage.ts)
async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
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
    // Sprawdzamy, czy użytkownik testowy już istnieje
    const existingUser = await db.select().from(users).where(eq(users.username, 'testuser'));
    let newUser;
    
    if (existingUser.length > 0) {
      console.log(`Aktualizacja istniejącego użytkownika: ${existingUser[0].username}, ID: ${existingUser[0].id}`);
      
      // Aktualizujemy hasło istniejącego użytkownika
      const [updatedUser] = await db.update(users)
        .set({
          password: hashedPassword,
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          authMethod: 'local'
        })
        .where(eq(users.username, 'testuser'))
        .returning();
      
      newUser = updatedUser;
    } else {
      // Tworzymy nowego użytkownika testowego - tutaj id powinno być auto-inkrementowane
      const [createdUser] = await db.insert(users).values({
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
        role: 'client',
        firstName: 'Test',
        lastName: 'User',
        authMethod: 'local',
        createdAt: new Date(),
      }).returning();
      
      newUser = createdUser;
    }
    
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