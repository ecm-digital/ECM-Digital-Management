import { newServices } from "./new-services";
import { db } from "../server/db";
import { services, insertServiceSchema } from "../shared/schema";
import { sql } from "drizzle-orm";

async function updateServices() {
  console.log("Starting service update...");
  
  try {
    // Truncate the services table to remove existing services
    console.log("Truncating services table...");
    await db.execute(sql`TRUNCATE TABLE services RESTART IDENTITY`);
    console.log("Services table truncated successfully.");
    
    // Import each new service
    for (const service of newServices) {
      const insertData = {
        serviceId: service.id,
        name: service.name,
        description: service.description,
        basePrice: service.basePrice,
        deliveryTime: service.deliveryTime,
        features: service.features || [],
        steps: service.steps || [],
        categories: service.categories || [],
      };
      
      // Validate service data
      const validatedServiceData = insertServiceSchema.parse(insertData);
      
      // Insert into database
      const [insertedService] = await db
        .insert(services)
        .values(validatedServiceData)
        .returning();
      
      console.log(`Imported service: ${insertedService.name} (ID: ${insertedService.id})`);
    }
    
    console.log(`Successfully imported ${newServices.length} services.`);
  } catch (error) {
    console.error("Error updating services:", error);
  }
}

// Run the update
updateServices()
  .then(() => {
    console.log("Update script completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Update script failed:", error);
    process.exit(1);
  });