import { db } from "../server/db";
import { users } from "../shared/schema";

async function createTestUser() {
  console.log("Creating test user...");

  try {
    // Sprawdź czy użytkownik już istnieje
    const existingUser = await db.select().from(users).where(users.username === 'testuser');
    
    if (existingUser.length > 0) {
      console.log("Test user already exists.");
      return;
    }

    // Dodaj testowego użytkownika
    const newUser = await db.insert(users).values({
      username: 'testuser',
      password: 'password123', // W rzeczywistej aplikacji hasło byłoby hashowane
      email: 'test@example.com',
      firstName: 'Jan',
      lastName: 'Kowalski',
      company: 'Test Company',
      role: 'client',
      profileImage: null
    }).returning();
    
    console.log("Test user created:", newUser);
  } catch (error) {
    console.error("Failed to create test user:", error);
  } finally {
    process.exit(0);
  }
}

// Uruchomienie skryptu
createTestUser();