import { db } from "../server/db";
import { orders, messages, projectMilestones } from "../shared/schema";
import { nanoid } from "nanoid";

async function createTestData() {
  console.log("Creating test data for client panel...");

  try {
    // 1. Utwórz testowe zamówienia
    console.log("Creating test orders...");
    
    // Sprawdź czy są już jakieś zamówienia
    const existingOrders = await db.select().from(orders);
    
    if (existingOrders.length === 0) {
      // Dodaj testowe zamówienie "W realizacji"
      const orderId1 = `ECM-${Date.now().toString(36)}-${nanoid(6)}`.toUpperCase();
      
      const order1 = await db.insert(orders).values({
        serviceId: "1",
        orderId: orderId1,
        configuration: {
          "Zakres audytu": "Pełny",
          "Dodatkowe strony": 5
        },
        contactInfo: {
          name: "Jan Kowalski",
          email: "test@example.com",
          phone: "+48123456789",
          company: "Test Company",
          message: "Proszę o analizę sklepu e-commerce."
        },
        totalPrice: 1500,
        deliveryTime: 14,
        status: "W realizacji",
        userId: 1,
        updatedAt: new Date()
      }).returning();
      
      console.log("Created order 1:", order1);
      
      // Dodaj testowe zamówienie "Zakończone"
      const orderId2 = `ECM-${Date.now().toString(36)}-${nanoid(6)}`.toUpperCase();
      
      const order2 = await db.insert(orders).values({
        serviceId: "9",
        orderId: orderId2,
        configuration: {
          "Typ analizy": "Z elementami AI",
          "Priorytet": "Wysoki"
        },
        contactInfo: {
          name: "Jan Kowalski",
          email: "test@example.com",
          phone: "+48123456789",
          company: "Test Company",
          message: "Potrzebuję szybkiej analizy UX dla mojej aplikacji."
        },
        totalPrice: 2500,
        deliveryTime: 7,
        status: "Zakończone",
        userId: 1,
        updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 14 dni temu
      }).returning();
      
      console.log("Created order 2:", order2);
      
      // 2. Dodaj testowe wiadomości dla pierwszego zamówienia
      console.log("Creating test messages...");
      
      const messages1 = await db.insert(messages).values([
        {
          orderId: order1[0].id,
          senderId: 1, // Klient
          receiverId: 2, // Pracownik (choć może nie istnieć)
          content: "Dzień dobry, kiedy mogę spodziewać się pierwszych wyników?",
          isRead: true,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 dni temu
        },
        {
          orderId: order1[0].id,
          senderId: 2, // Pracownik
          receiverId: 1, // Klient
          content: "Dzień dobry, pracujemy nad audytem, pierwsze wyniki będą gotowe w przyszłym tygodniu. Pozdrawiamy!",
          isRead: true,
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 dni temu
        },
        {
          orderId: order1[0].id,
          senderId: 2, // Pracownik
          receiverId: 1, // Klient
          content: "Właśnie skończyliśmy analizę głównej strony produktowej. Mamy kilka ważnych uwag, które chcielibyśmy omówić. Czy jest Pan dostępny na krótką rozmowę jutro?",
          isRead: false,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 dzień temu
        }
      ]).returning();
      
      console.log("Created messages:", messages1);
      
      // 3. Dodaj testowe kamienie milowe dla pierwszego zamówienia
      console.log("Creating test milestones...");
      
      const milestones1 = await db.insert(projectMilestones).values([
        {
          orderId: order1[0].id,
          title: "Analiza wstępna",
          description: "Wstępna analiza strony i identyfikacja kluczowych obszarów do poprawy",
          status: "Zakończone",
          dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dni temu
          completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 dni temu
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 dni temu
        },
        {
          orderId: order1[0].id,
          title: "Testy użyteczności",
          description: "Przeprowadzenie testów użyteczności i analiza wyników",
          status: "W trakcie",
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // za 3 dni
          completedAt: null,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 dni temu
        },
        {
          orderId: order1[0].id,
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
      console.log("Orders already exist, skipping test data creation");
    }

    console.log("Test data creation completed!");
  } catch (error) {
    console.error("Failed to create test data:", error);
  } finally {
    process.exit(0);
  }
}

// Uruchomienie skryptu
createTestData();