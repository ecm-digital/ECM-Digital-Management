import { db } from "../server/db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";

async function createAdminUser() {
  console.log("Creating admin user...");

  try {
    // Sprawdź czy admin już istnieje
    const existingAdmin = await db.select().from(users).where(eq(users.username, 'admin'));
    
    if (existingAdmin.length > 0) {
      console.log("Admin user already exists.");
      return;
    }

    // Dodaj użytkownika administratora
    const adminUser = await db.insert(users).values({
      id: 2, // Ustawienie konkretnego ID
      username: 'admin',
      password: 'admin123', // W rzeczywistej aplikacji hasło byłoby hashowane
      email: 'admin@ecmdigital.com',
      firstName: 'Admin',
      lastName: 'ECM',
      company: 'ECM Digital',
      role: 'admin',
      profileImage: null
    }).returning();
    
    console.log("Admin user created:", adminUser);
  } catch (error) {
    console.error("Failed to create admin user:", error);
  } finally {
    process.exit(0);
  }
}

// Uruchomienie skryptu
createAdminUser();