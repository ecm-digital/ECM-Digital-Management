import { services as localServices } from "../client/src/data/services";
import { db } from "../server/db";
import { services, insertServiceSchema } from "../shared/schema";

async function importServices() {
  console.log("Starting service import...");
  
  try {
    // Check if services table is empty
    const existingServices = await db.select().from(services);
    
    if (existingServices.length > 0) {
      console.log(`Found ${existingServices.length} existing services. Skipping import.`);
      console.log("If you want to reimport services, please truncate the services table first.");
      return;
    }
    
    // Import each service
    for (const service of localServices) {
      const insertData = {
        serviceId: service.id,
        name: service.name,
        description: service.description,
        basePrice: service.basePrice,
        deliveryTime: service.deliveryTime,
        features: service.features || [],
        steps: service.steps || [],
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
    
    console.log(`Successfully imported ${localServices.length} services.`);
  } catch (error) {
    console.error("Error importing services:", error);
  }
}

// Run the import
importServices()
  .then(() => {
    console.log("Import script completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Import script failed:", error);
    process.exit(1);
  });