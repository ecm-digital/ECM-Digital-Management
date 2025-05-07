import { db } from "../server/db";
import { users, welcomeMessages } from "../shared/schema";
import { eq } from "drizzle-orm";

// Script to create welcome messages for a user
async function createWelcomeMessages() {
  try {
    console.log("Creating welcome messages...");

    // Get the first user with client role (for demo purposes)
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.role, "client"))
      .limit(1);

    if (!user) {
      console.log("No client users found. Please create a client user first.");
      return;
    }

    console.log(`Creating welcome messages for user: ${user.username} (ID: ${user.id})`);

    // Delete existing welcome messages for this user
    await db
      .delete(welcomeMessages)
      .where(eq(welcomeMessages.userId, user.id));

    // Create welcome messages
    const messages = [
      {
        userId: user.id,
        step: 1,
        title: "Witaj w ECM Digital!",
        content: "Cieszymy się, że jesteś z nami! Jesteśmy zespołem ekspertów UX/UI, web developmentu i marketingu. Naszym celem jest pomoc w rozwijaniu Twojego biznesu poprzez skuteczne rozwiązania cyfrowe.",
        actionLabel: "Dowiedz się więcej",
        actionType: "url",
        isCompleted: false,
      },
      {
        userId: user.id,
        step: 2,
        title: "Poznaj swój panel klienta",
        content: "Panel klienta to miejsce, gdzie możesz śledzić postępy swoich projektów, komunikować się z naszym zespołem i przeglądać najważniejsze informacje dotyczące naszej współpracy.",
        actionLabel: "Uzupełnij profil",
        actionType: "profile",
        isCompleted: false,
      },
      {
        userId: user.id,
        step: 3,
        title: "Twój dedykowany zespół",
        content: "Przydzieliliśmy Ci dedykowany zespół, który będzie pracował nad Twoimi projektami. Możesz się z nimi skontaktować w każdej chwili przez zakładkę Wiadomości.",
        isCompleted: false,
      }
    ];

    // Insert messages
    for (const message of messages) {
      await db.insert(welcomeMessages).values(message);
    }

    console.log(`Created ${messages.length} welcome messages for user ID: ${user.id}`);
    console.log("Done!");
  } catch (error) {
    console.error("Error creating welcome messages:", error);
  } finally {
    process.exit(0);
  }
}

createWelcomeMessages();