import { db } from "../server/db";
import { orders } from "../shared/schema";
import { nanoid } from "nanoid";

async function createTestOrder() {
  console.log("Creating test order...");

  try {
    // Generuj unikalny ID zamówienia
    const orderId = `ECM-${new Date().getTime().toString(36)}-${nanoid(6)}`.toUpperCase();
    
    // Dodaj testowe zamówienie
    const newOrder = await db.insert(orders).values({
      orderId: orderId,
      serviceId: "1", // ID usługi Audyt UX
      configuration: {
        "Zakres audytu": "Kompletny",
        "Dodatkowe strony": 5,
        "Testy A/B": true
      },
      contactInfo: {
        name: "Jan Kowalski",
        email: "test@example.com",
        phone: "+48123456789",
        company: "Test Company",
        website: "https://example.com"
      },
      totalPrice: 1500,
      deliveryTime: 14,
      status: "W realizacji",
      userId: 1, // ID testowego użytkownika
      assignedToId: null,
      updatedAt: new Date()
    }).returning();
    
    console.log("Test order created:", newOrder);

    // Dodajmy jeszcze jedno zamówienie ze statusem "Zakończone"
    const completedOrderId = `ECM-${new Date().getTime().toString(36)}-${nanoid(6)}`.toUpperCase();
    
    const completedOrder = await db.insert(orders).values({
      orderId: completedOrderId,
      serviceId: "9", // ID usługi Audyt UX z elementami AI
      configuration: {
        "Typ analizy": "Zaawansowana",
        "Dodatkowe rekomendacje": true
      },
      contactInfo: {
        name: "Jan Kowalski",
        email: "test@example.com",
        phone: "+48123456789",
        company: "Test Company",
        website: "https://example.com"
      },
      totalPrice: 2500,
      deliveryTime: 21,
      status: "Zakończone",
      userId: 1, // ID testowego użytkownika
      assignedToId: null,
      updatedAt: new Date()
    }).returning();
    
    console.log("Completed test order created:", completedOrder);
  } catch (error) {
    console.error("Failed to create test order:", error);
  } finally {
    process.exit(0);
  }
}

// Uruchomienie skryptu
createTestOrder();