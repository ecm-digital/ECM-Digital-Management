import { db } from "../server/db";
import { users } from "../shared/schema";
import { sql } from "drizzle-orm";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { nanoid } from "nanoid";

// Funkcja pomocnicza do haszowania hasła
const scryptAsync = promisify(scrypt);
async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

async function createTestUser() {
  try {
    console.log("Tworzenie testowego użytkownika...");
    
    // Dane testowego użytkownika
    const username = "test";
    const email = "test@example.com";
    const password = "testpass";
    const hashedPassword = await hashPassword(password);
    const userId = `local_${username}_${nanoid(8)}`;
    
    // Sprawdź czy użytkownik już istnieje
    const existingUser = await db.select().from(users).where(sql`${users.username} = ${username}`);
    
    if (existingUser.length > 0) {
      console.log("Użytkownik testowy już istnieje!");
      console.log("Nazwa użytkownika: test");
      console.log("Hasło: testpass");
      return;
    }
    
    // Utwórz użytkownika
    const [user] = await db.insert(users).values({
      id: userId,
      username,
      email,
      password: hashedPassword,
      role: 'client',
      bio: 'Testowe konto użytkownika',
      created_at: new Date()
    }).returning();
    
    console.log("Testowy użytkownik utworzony pomyślnie!");
    console.log("Nazwa użytkownika: test");
    console.log("Hasło: testpass");
    console.log("ID użytkownika:", user.id);
  } catch (error) {
    console.error("Błąd podczas tworzenia testowego użytkownika:", error);
  } finally {
    process.exit(0);
  }
}

// Uruchom skrypt
createTestUser();