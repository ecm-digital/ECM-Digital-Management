import { db } from "../server/db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";

async function updateClientProfile() {
  try {
    console.log("Updating client profile with sample data...");
    
    // Get the test user record
    const [testUser] = await db.select().from(users).where(eq(users.username, "testuser"));
    
    if (!testUser) {
      console.log("Test user not found!");
      return;
    }
    
    // Update the test user with sample data
    await db.update(users)
      .set({
        firstName: "Jan",
        lastName: "Kowalski",
        email: "jan.kowalski@example.com",
        company: "Kowalski Design Studio"
      })
      .where(eq(users.id, testUser.id));
      
    console.log(`Updated profile for user: ${testUser.username} (ID: ${testUser.id})`);
    console.log("Client profile updated successfully!");
    
  } catch (error) {
    console.error("Error updating client profile:", error);
  }
}

// Run the function
updateClientProfile();