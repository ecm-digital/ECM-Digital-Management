import { db } from "../server/db";
import { orders, messages, projectMilestones, users } from "../shared/schema";
import { eq } from "drizzle-orm";

async function createTestMessages() {
  console.log("Creating test messages and milestones...");

  try {
    // Sprawdź czy użytkownicy istnieją
    console.log("Checking users...");
    const adminUser = await db.select().from(users).where(eq(users.id, 2));
    const clientUser = await db.select().from(users).where(eq(users.id, 1));
    
    if (adminUser.length === 0 || clientUser.length === 0) {
      console.log("Admin or client user doesn't exist. Run create-admin-user.ts first.");
      process.exit(1);
    }
    
    // Pobierz wszystkie zamówienia
    const allOrders = await db.select().from(orders);
    
    if (allOrders.length === 0) {
      console.log("No orders found. Run create-test-data.ts first.");
      process.exit(1);
    }
    
    // Pobierz pierwsze zamówienie
    const firstOrder = allOrders[0];
    
    // Sprawdź czy są już wiadomości dla tego zamówienia
    const existingMessages = await db.select().from(messages).where(eq(messages.orderId, firstOrder.id));
    
    if (existingMessages.length === 0) {
      console.log("Creating test messages for order:", firstOrder.orderId);
      
      const messages1 = await db.insert(messages).values([
        {
          orderId: firstOrder.id,
          senderId: 1, // Klient
          receiverId: 2, // Pracownik
          content: "Dzień dobry, kiedy mogę spodziewać się pierwszych wyników?",
          isRead: true,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 dni temu
        },
        {
          orderId: firstOrder.id,
          senderId: 2, // Pracownik
          receiverId: 1, // Klient
          content: "Dzień dobry, pracujemy nad audytem, pierwsze wyniki będą gotowe w przyszłym tygodniu. Pozdrawiamy!",
          isRead: true,
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 dni temu
        },
        {
          orderId: firstOrder.id,
          senderId: 2, // Pracownik
          receiverId: 1, // Klient
          content: "Właśnie skończyliśmy analizę głównej strony produktowej. Mamy kilka ważnych uwag, które chcielibyśmy omówić. Czy jest Pan dostępny na krótką rozmowę jutro?",
          isRead: false,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 dzień temu
        }
      ]).returning();
      
      console.log("Created messages:", messages1);
    } else {
      console.log("Messages already exist for order:", firstOrder.orderId);
    }
    
    // Sprawdź czy są już kamienie milowe dla tego zamówienia
    const existingMilestones = await db.select().from(projectMilestones).where(eq(projectMilestones.orderId, firstOrder.id));
    
    if (existingMilestones.length === 0) {
      console.log("Creating test milestones for order:", firstOrder.orderId);
      
      const milestones1 = await db.insert(projectMilestones).values([
        {
          orderId: firstOrder.id,
          title: "Analiza wstępna",
          description: "Wstępna analiza strony i identyfikacja kluczowych obszarów do poprawy",
          status: "Zakończone",
          dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dni temu
          completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 dni temu
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 dni temu
        },
        {
          orderId: firstOrder.id,
          title: "Testy użyteczności",
          description: "Przeprowadzenie testów użyteczności i analiza wyników",
          status: "W trakcie",
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // za 3 dni
          completedAt: null,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 dni temu
        },
        {
          orderId: firstOrder.id,
          title: "Raport końcowy",
          description: "Przygotowanie i dostarczenie raportu końcowego z rekomendacjami",
          status: "Oczekujące",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // za 7 dni
          completedAt: null,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 dni temu
        }
      ]).returning();
      
      console.log("Created milestones:", milestones1);
    } else {
      console.log("Milestones already exist for order:", firstOrder.orderId);
    }

    console.log("Test messages and milestones creation completed!");
  } catch (error) {
    console.error("Failed to create test messages and milestones:", error);
  } finally {
    process.exit(0);
  }
}

// Uruchomienie skryptu
createTestMessages();