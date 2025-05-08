import { db } from '../server/db';
import { users, InsertUser } from '../shared/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

// Asynchroniczne funkcje pomocnicze do hashy haseł
const scryptAsync = promisify(scrypt);

// Funkcja haszująca hasło
async function hashPassword(password: string): Promise<string> {
  console.log("Haszowanie hasła", password);
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  const hashed = `${buf.toString('hex')}.${salt}`;
  console.log("Wygenerowany hasz:", hashed);
  return hashed;
}

async function createNewTestUser() {
  try {
    console.log("Tworzenie nowego testowego użytkownika...");
    
    // Dane testowego użytkownika
    const username = "testuser";
    const email = "testuser@example.com";
    const password = "testpass";
    const hashedPassword = await hashPassword(password);
    
    // Sprawdź czy użytkownik już istnieje
    const existingUser = await db.select().from(users).where(eq(users.username, username));
    
    if (existingUser.length > 0) {
      console.log("Użytkownik testowy już istnieje!");
      console.log("Nazwa użytkownika:", username);
      console.log("Hasło:", password);
      return;
    }
    
    // Utwórz użytkownika z numerycznymm ID
    const [user] = await db.insert(users).values({
      username,
      email,
      password: hashedPassword,
      role: 'client',
      bio: 'Testowe konto użytkownika',
      createdAt: new Date()
    }).returning();
    
    console.log("Testowy użytkownik utworzony pomyślnie!");
    console.log("Nazwa użytkownika:", username);
    console.log("Hasło:", password);
    console.log("ID użytkownika:", user.id);
  } catch (error) {
    console.error("Błąd podczas tworzenia testowego użytkownika:", error);
  } finally {
    process.exit(0);
  }
}

// Uruchom skrypt
createNewTestUser();