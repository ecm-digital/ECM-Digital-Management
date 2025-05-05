import express, { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as schema from "@shared/schema";
import { insertOrderSchema, insertServiceSchema } from "@shared/schema";
import multer from "multer";
import { z } from "zod";
import { nanoid } from "nanoid";
import path from "path";
import fs from "fs";
import { ParsedQs } from "qs";
import axios from "axios";
import { db } from "./db";
import { eq } from "drizzle-orm";
// Tłumaczenia nazw usług
const serviceTranslations: Record<string, string> = {
  "Audyt UX": "UX-Audit",
  "Audyt UX z elementami AI": "UX-Audit mit KI",
  "Projektowanie lejków konwersji": "Conversion-Funnel-Design",
  "Miesięczna opieka AI/UX": "Monatliche KI/UX-Betreuung",
  "Strona internetowa": "Webseite",
  "Sklep internetowy": "Online-Shop",
  "Aplikacja webowa": "Web-Anwendung",
  "Kampania Social Media": "Social-Media-Kampagne",
  "Newsletter z insightami": "Insights-Newsletter",
  "AI Chatbot": "KI-Chatbot",
  "Integracja AI": "KI-Integration",
  "Strategia marketingowa": "Marketingstrategie",
  "Automatyzacja Procesów Biznesowych": "Automatisierung von Geschäftsprozessen",
  "Mentoring & Konsultacje": "Mentoring & Beratung"
};

// Tłumaczenia kategorii
const categoryTranslations: Record<string, string> = {
  "UX/UI": "UX/UI",
  "Web Development": "Web-Entwicklung",
  "Marketing": "Marketing",
  "SEO": "SEO",
  "AI": "KI",
  "Automatyzacja": "Automatisierung",
  "Consulting": "Beratung",
  "Development": "Entwicklung",
  "Inne": "Andere"
};

import { 
  generateServiceData, 
  generateBenefits, 
  generateScope, 
  enhanceServiceDescription,
  generatePricingRecommendation,
  generateServiceEstimation
} from "./openai";

// Configure multer for file uploads - store files locally
const uploadDir = path.join(process.cwd(), 'uploads');

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req: Express.Request, file: Express.Multer.File, cb: Function) {
      cb(null, uploadDir);
    },
    filename: function (req: Express.Request, file: Express.Multer.File, cb: Function) {
      const fileId = nanoid();
      const fileExtension = path.extname(file.originalname);
      cb(null, `${fileId}${fileExtension}`);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Enhanced request schema for order submission
const orderSubmissionSchema = z.object({
  service: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    basePrice: z.number(),
    deliveryTime: z.number(),
    features: z.array(z.string()).optional(),
    steps: z.any().optional(),
  }).nullable(),
  configuration: z.record(z.any()),
  contactInfo: z.record(z.any()),
  totalPrice: z.number(),
  deliveryTime: z.number().optional(),
  uploadedFile: z.any().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {

  // Get services from database
  app.get("/api/services", async (req, res) => {
    try {
      const servicesFromDb = await storage.getAllServices();
      const lang = req.query.lang as string || 'pl';
      
      console.log("Requested language:", lang);
      
      // Transform database model to client model
      const services = servicesFromDb.map(service => {
        // Przetłumacz nazwę i kategorię jeśli język to niemiecki
        const serviceName = lang === 'de' && serviceTranslations[service.name] 
          ? serviceTranslations[service.name] 
          : service.name;
          
        const serviceCategory = lang === 'de' && service.category && categoryTranslations[service.category]
          ? categoryTranslations[service.category]
          : service.category || 'Inne';
          
        return {
          id: service.serviceId,
          name: serviceName,
          shortDescription: service.shortDescription || '',
          description: service.description,
          longDescription: service.longDescription || '',
          basePrice: service.basePrice,
          deliveryTime: service.deliveryTime,
          features: service.features,
          benefits: service.benefits || [],
          scope: service.scope || [],
          steps: service.steps,
          category: serviceCategory,
          status: service.status || 'Aktywna',
          original: { // Zachowaj oryginalne wartości dla referencji
            name: service.name,
            category: service.category
          }
        };
      });
      
      console.log("Services being returned to client (language: " + lang + "):", services);
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Error fetching services" });
    }
  });

  // Create a new service
  app.post("/api/services", async (req, res) => {
    try {
      const serviceData = req.body;
      
      // Generowanie unikatowego ID
      const existingServices = await storage.getAllServices();
      const newId = (existingServices.length ? 
        Math.max(...existingServices.map(s => parseInt(s.serviceId) || 0)) + 1 : 1).toString();
      
      // Przygotowanie danych do zapisania
      const serviceToInsert = {
        serviceId: newId,
        name: serviceData.name,
        shortDescription: serviceData.shortDescription || '',
        description: serviceData.description,
        longDescription: serviceData.longDescription || '',
        basePrice: serviceData.basePrice,
        deliveryTime: serviceData.deliveryTime,
        features: serviceData.features || [],
        benefits: serviceData.benefits || [],
        scope: serviceData.scope || [],
        steps: serviceData.steps || [],
        category: serviceData.category || 'Inne',
        status: serviceData.status || 'Aktywna'
      };
      
      // Waliduj dane
      const validatedServiceData = insertServiceSchema.parse(serviceToInsert);
      
      // Zapisz usługę w bazie danych
      const newService = await storage.createService(validatedServiceData);
      
      // Zwróć nową usługę
      res.status(201).json({
        success: true,
        message: "Usługa utworzona pomyślnie",
        service: {
          id: newService.serviceId,
          name: newService.name,
          shortDescription: newService.shortDescription || '',
          description: newService.description,
          longDescription: newService.longDescription || '',
          basePrice: newService.basePrice,
          deliveryTime: newService.deliveryTime,
          features: newService.features || [],
          benefits: newService.benefits || [],
          scope: newService.scope || [],
          steps: newService.steps || [],
          category: newService.category || 'Inne',
          status: newService.status || 'Aktywna'
        }
      });
    } catch (error) {
      console.error("Błąd podczas tworzenia usługi:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Nieprawidłowe dane usługi", errors: error.errors });
      } else {
        res.status(500).json({ 
          success: false,
          message: "Błąd podczas tworzenia usługi",
          error: error instanceof Error ? error.message : 'Nieznany błąd'
        });
      }
    }
  });
  
  // Get a single service by ID
  app.get("/api/services/:id", async (req, res) => {
    try {
      const serviceId = req.params.id;
      const lang = req.query.lang as string || 'pl';
      
      console.log("Requested language for service ID:", serviceId, "lang:", lang);
      
      const serviceFromDb = await storage.getServiceByServiceId(serviceId);
      
      if (!serviceFromDb) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      // Przetłumacz nazwę i kategorię jeśli język to niemiecki
      const serviceName = lang === 'de' && serviceTranslations[serviceFromDb.name] 
        ? serviceTranslations[serviceFromDb.name] 
        : serviceFromDb.name;
        
      const serviceCategory = lang === 'de' && serviceFromDb.category && categoryTranslations[serviceFromDb.category]
        ? categoryTranslations[serviceFromDb.category]
        : serviceFromDb.category || 'Inne';
      
      // Transform database model to client model
      const service = {
        id: serviceFromDb.serviceId,
        name: serviceName,
        shortDescription: serviceFromDb.shortDescription || '',
        description: serviceFromDb.description,
        longDescription: serviceFromDb.longDescription || '',
        basePrice: serviceFromDb.basePrice,
        deliveryTime: serviceFromDb.deliveryTime,
        features: serviceFromDb.features || [],
        benefits: serviceFromDb.benefits || [],
        scope: serviceFromDb.scope || [],
        steps: serviceFromDb.steps || [],
        category: serviceCategory,
        status: serviceFromDb.status || 'Aktywna',
        original: { // Zachowaj oryginalne wartości dla referencji
          name: serviceFromDb.name,
          category: serviceFromDb.category
        }
      };
      
      console.log("Service being returned to client (language: " + lang + "):", service.name);
      res.json(service);
    } catch (error) {
      console.error("Error fetching service:", error);
      res.status(500).json({ message: "Error fetching service" });
    }
  });

  // Handle file upload
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      // Generate the URL for the uploaded file
      const fileUrl = `/uploads/${req.file.filename}`;
      
      res.json({ url: fileUrl });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Error uploading file" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static(uploadDir));
  
  // Test endpoint for development - do not use in production
  app.get('/api/test/client-panel-data', async (req, res) => {
    try {
      const testData = {
        orders: await storage.getOrdersByUserId(1),
        messages: await storage.getMessagesByReceiverId(1),
        milestones: await db.select().from(schema.projectMilestones).where(eq(schema.projectMilestones.orderId, 1))
      };
      
      res.json(testData);
    } catch (error) {
      console.error("Error fetching test data:", error);
      res.status(500).json({ message: "Error fetching test data", error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Submit order
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = orderSubmissionSchema.parse(req.body);
      
      // Convert to database format
      const insertData = {
        serviceId: orderData.service?.id || '',
        configuration: orderData.configuration,
        contactInfo: orderData.contactInfo,
        totalPrice: orderData.totalPrice,
        deliveryTime: orderData.deliveryTime || 0,
        fileUrl: orderData.uploadedFile?.url,
        // Optionally link to a userId if authenticated
        userId: req.body.userId || null
      };
      
      // Validate against our insertOrderSchema
      const validatedOrderData = insertOrderSchema.parse(insertData);
      
      // Add order to database
      const order = await storage.createOrder(validatedOrderData);
      
      // Transform to client format for response
      const createdAt = new Date().toISOString();
      const clientOrder = {
        id: order.id.toString(),
        serviceId: order.serviceId,
        configuration: order.configuration,
        contactInfo: order.contactInfo,
        totalPrice: order.totalPrice,
        deliveryTime: order.deliveryTime,
        fileUrl: order.fileUrl,
        createdAt
      };
      
      res.json({ 
        ...clientOrder,
        message: "Order submitted successfully" 
      });
    } catch (error) {
      console.error("Error submitting order:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid order data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error submitting order" });
      }
    }
  });

  // Import services from JSON (for initial setup or manual updates)
  app.post("/api/admin/import-services", async (req, res) => {
    try {
      const { services: servicesData } = req.body;
      
      if (!Array.isArray(servicesData)) {
        return res.status(400).json({ message: "Expected an array of services" });
      }
      
      let addedCount = 0;
      let updatedCount = 0;
      let errorCount = 0;
      
      for (const serviceData of servicesData) {
        try {
          const serviceId = serviceData.id.toString();
          
          // Sprawdź czy usługa już istnieje
          const existingService = await storage.getServiceByServiceId(serviceId);
          
          const insertData = {
            serviceId: serviceId,
            name: serviceData.name,
            shortDescription: serviceData.shortDescription || '',
            description: serviceData.description || '',
            longDescription: serviceData.longDescription || '',
            basePrice: serviceData.basePrice || 0,
            deliveryTime: serviceData.deliveryTime || 14,
            features: serviceData.features || [],
            benefits: serviceData.benefits || [],
            scope: serviceData.scope || [],
            steps: serviceData.steps || [],
            category: serviceData.category || 'Inne',
            status: serviceData.status || 'Aktywna'
          };
          
          if (existingService) {
            // Aktualizacja istniejącej usługi
            await db
              .update(schema.services)
              .set(insertData)
              .where(eq(schema.services.serviceId, serviceId.toString()));
            
            updatedCount++;
            console.log(`Updated existing service: ${serviceData.name} (ID: ${serviceId})`);
          } else {
            // Dodawanie nowej usługi
            const validatedServiceData = insertServiceSchema.parse(insertData);
            await storage.createService(validatedServiceData);
            
            addedCount++;
            console.log(`Added new service: ${serviceData.name} (ID: ${serviceId})`);
          }
        } catch (error) {
          errorCount++;
          console.error(`Error processing service ${serviceData.id}:`, error);
        }
      }
      
      res.json({ 
        message: `Import completed. Added: ${addedCount}, Updated: ${updatedCount}, Failed: ${errorCount}`,
        count: addedCount + updatedCount,
        added: addedCount,
        updated: updatedCount,
        failed: errorCount
      });
    } catch (error) {
      console.error("Error importing services:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid service data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error importing services" });
      }
    }
  });
  
  // CRUD API dla ServiceCatalog (panel administracyjny)
  
  // Pobieranie pojedynczej usługi przez ID - dostępne dla obu aplikacji
  app.get("/api/admin/services/:id", async (req, res) => {
    try {
      const apiKey = req.query.key as string;
      
      // Weryfikacja klucza API
      if (!apiKey || apiKey !== "ecm-database-sharing-key") {
        return res.status(401).json({ message: "Unauthorized: Invalid API key" });
      }
      
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ message: "Service ID is required" });
      }
      
      const service = await storage.getServiceByServiceId(id);
      
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      res.json(service);
    } catch (error) {
      console.error("Error fetching service:", error);
      res.status(500).json({ message: "Error fetching service" });
    }
  });
  
  // Aktualizacja usługi (tylko dla ServiceCatalog)
  app.put("/api/admin/services/:id", async (req, res) => {
    try {
      const apiKey = req.query.key as string;
      const appName = req.query.app as string;
      
      // Weryfikacja klucza API
      if (!apiKey || apiKey !== "ecm-database-sharing-key") {
        return res.status(401).json({ message: "Unauthorized: Invalid API key" });
      }
      
      // Sprawdź czy to jest ServiceCatalog
      if (appName !== "ServiceCatalog") {
        return res.status(403).json({ 
          message: "Forbidden: Only ServiceCatalog has permission to update services" 
        });
      }
      
      const { id } = req.params;
      const serviceData = req.body;
      
      if (!id) {
        return res.status(400).json({ message: "Service ID is required" });
      }
      
      // Sprawdź czy usługa istnieje
      const existingService = await db.select().from(schema.services).where(eq(schema.services.serviceId, id)).limit(1);
      
      if (existingService.length === 0) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      // Aktualizacja usługi w bazie danych
      const updateData = {
        serviceId: serviceData.id || id,
        name: serviceData.name,
        shortDescription: serviceData.shortDescription || '',
        description: serviceData.description,
        longDescription: serviceData.longDescription || '',
        basePrice: serviceData.basePrice,
        deliveryTime: serviceData.deliveryTime,
        features: serviceData.features || [],
        benefits: serviceData.benefits || [],
        scope: serviceData.scope || [],
        steps: serviceData.steps || [],
        category: serviceData.category || 'Inne',
        status: serviceData.status || 'Aktywna'
      };
      
      // Aktualizuj usługę w bazie danych
      const result = await db
        .update(schema.services)
        .set(updateData)
        .where(eq(schema.services.serviceId, id))
        .returning();
      
      res.json({ 
        success: true,
        message: "Service updated successfully",
        service: result[0]
      });
    } catch (error) {
      console.error("Error updating service:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid service data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error updating service" });
      }
    }
  });
  
  // Usuwanie usługi (dla ServiceCatalog i ECM Digital)
  app.delete("/api/admin/services/:id", async (req, res) => {
    try {
      const apiKey = req.query.key as string;
      const appName = req.query.app as string;
      
      // Weryfikacja klucza API
      if (!apiKey || apiKey !== "ecm-database-sharing-key") {
        return res.status(401).json({ message: "Unauthorized: Invalid API key" });
      }
      
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ message: "Service ID is required" });
      }
      
      // Sprawdź czy usługa istnieje i usuń ją
      if (appName === "ServiceCatalog") {
        // ServiceCatalog używa serviceId (string) do identyfikacji usług
        const existingServices = await db.select().from(schema.services).where(eq(schema.services.serviceId, id)).limit(1);
        
        if (existingServices.length === 0) {
          return res.status(404).json({ message: "Service not found" });
        }
        
        // Usuń usługę z bazy danych używając serviceId
        await db.delete(schema.services).where(eq(schema.services.serviceId, id));
      } else {
        // ECM Digital używa id (number) do identyfikacji usług
        const existingService = await storage.getService(parseInt(id));
        
        if (!existingService) {
          return res.status(404).json({ message: "Usługa nie znaleziona" });
        }
        
        // Usuń usługę z bazy używając id
        await db.delete(schema.services).where(eq(schema.services.id, parseInt(id)));
      }
      
      res.json({ 
        success: true,
        message: "Service deleted successfully" 
      });
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error deleting service", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Create a test user (for development)
  app.post("/api/admin/create-test-user", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.createUser({ username, password });
      
      res.json({
        id: user.id,
        username: user.username,
        message: "Test user created successfully"
      });
    } catch (error) {
      console.error("Error creating test user:", error);
      res.status(500).json({ message: "Error creating test user" });
    }
  });

  // Proxy dla ServiceCatalog - obejście problemu CORS
  app.get("/api/proxy/servicecatalog/services", async (req, res) => {
    try {
      const targetUrl = req.query.url as string;
      
      if (!targetUrl) {
        return res.status(400).json({ message: "URL is required" });
      }
      
      console.log(`Proxying request to ${targetUrl}/api/services`);
      
      const response = await axios.get(`${targetUrl}/api/services`, {
        timeout: 5000
      });
      
      res.json(response.data);
    } catch (error) {
      console.error("Error proxying to ServiceCatalog:", error);
      res.status(500).json({ 
        message: "Error connecting to ServiceCatalog", 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  // Proxy dla pojedynczej usługi ServiceCatalog
  app.get("/api/proxy/servicecatalog/services/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const targetUrl = req.query.url as string;
      
      if (!targetUrl) {
        return res.status(400).json({ message: "URL is required" });
      }
      
      console.log(`Proxying request to ${targetUrl}/api/services/${id}`);
      
      const response = await axios.get(`${targetUrl}/api/services/${id}`, {
        timeout: 5000
      });
      
      res.json(response.data);
    } catch (error) {
      console.error(`Error proxying to ServiceCatalog for service ${req.params.id}:`, error);
      
      // Jeśli jest to błąd 404, zwróć null zamiast błędu
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return res.json(null);
      }
      
      res.status(500).json({ 
        message: "Error connecting to ServiceCatalog", 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  // Proxy dla zamówień ServiceCatalog
  app.post("/api/proxy/servicecatalog/orders", async (req, res) => {
    try {
      const targetUrl = req.query.url as string;
      
      if (!targetUrl) {
        return res.status(400).json({ message: "URL is required" });
      }
      
      console.log(`Proxying order to ${targetUrl}/api/orders`);
      
      const response = await axios.post(`${targetUrl}/api/orders`, req.body, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });
      
      res.json(response.data);
    } catch (error) {
      console.error("Error proxying order to ServiceCatalog:", error);
      res.status(500).json({ 
        message: "Error connecting to ServiceCatalog", 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });
  
  // Udostępnianie informacji o bazie danych dla ServiceCatalog
  // UWAGA: W produkcji powinieneś dodać uwierzytelnianie i autoryzację
  app.get("/api/admin/database-config", async (req, res) => {
    try {
      // Opcjonalny klucz API do podstawowego zabezpieczenia
      const apiKey = req.query.key;
      
      // Proste zabezpieczenie - wymagaj klucza API
      // W produkcji powinieneś użyć bardziej zaawansowanego uwierzytelniania
      if (!apiKey || apiKey !== "ecm-database-sharing-key") {
        return res.status(401).json({ message: "Unauthorized: Invalid API key" });
      }
      
      // Dane połączenia z bazą danych
      const dbConfig = {
        connectionUrl: process.env.DATABASE_URL,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT,
        schema: "public",
        tables: {
          services: {
            name: "services",
            fields: {
              id: "id", 
              serviceId: "service_id",
              name: "name",
              shortDescription: "short_description",
              description: "description",
              longDescription: "long_description",
              basePrice: "base_price",
              deliveryTime: "delivery_time",
              features: "features",
              benefits: "benefits",
              scope: "scope",
              steps: "steps",
              category: "category",
              status: "status",
              createdAt: "created_at"
            }
          },
          orders: {
            name: "orders",
            fields: {
              id: "id",
              serviceId: "service_id",
              configuration: "configuration",
              contactInfo: "contact_info",
              totalPrice: "total_price",
              deliveryTime: "delivery_time",
              fileUrl: "file_url",
              userId: "user_id",
              createdAt: "created_at"
            }
          },
          users: {
            name: "users",
            fields: {
              id: "id",
              username: "username",
              password: "password",
              createdAt: "created_at"
            }
          }
        }
      };
      
      res.json(dbConfig);
    } catch (error) {
      console.error("Error sharing database config:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Endpoint do inicjalizacji bazy danych ServiceCatalog
  app.post("/api/admin/initialize-servicecatalog-db", async (req, res) => {
    try {
      // Opcjonalny klucz API do podstawowego zabezpieczenia
      const apiKey = req.query.key;
      
      // Proste zabezpieczenie - wymagaj klucza API
      if (!apiKey || apiKey !== "ecm-database-sharing-key") {
        return res.status(401).json({ message: "Unauthorized: Invalid API key" });
      }
      
      // Eksport danych dla ServiceCatalog
      const servicesData = await storage.getAllServices();
      
      res.json({
        success: true,
        message: "Database information for ServiceCatalog retrieved successfully",
        services: servicesData,
        serviceCount: servicesData.length
      });
    } catch (error) {
      console.error("Error preparing data for ServiceCatalog:", error);
      res.status(500).json({ message: "Error preparing data for ServiceCatalog" });
    }
  });
  
  // Endpoint do testu połączenia z bazą danych - używany przez ServiceCatalog
  app.get("/api/admin/test-db-connection", async (req, res) => {
    try {
      // Opcjonalny klucz API do podstawowego zabezpieczenia
      const apiKey = req.query.key;
      
      // Proste zabezpieczenie - wymagaj klucza API
      if (!apiKey || apiKey !== "ecm-database-sharing-key") {
        return res.status(401).json({ message: "Unauthorized: Invalid API key" });
      }
      
      // Prosty zapytanie do bazy danych, aby sprawdzić połączenie
      const result = await db.select().from(schema.services).limit(1);
      
      res.json({ 
        success: true, 
        message: "Database connection successful",
        data: { servicesCount: result.length } 
      });
    } catch (error) {
      console.error("Error testing database connection:", error);
      res.status(500).json({ 
        success: false,
        message: "Database connection failed", 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Endpoint do synchronizacji danych pomiędzy aplikacjami (get info)
  app.post("/api/admin/sync-services", async (req, res) => {
    try {
      const apiKey = req.query.key as string;
      const { sourceApp } = req.body;
      
      // Weryfikacja klucza API
      if (!apiKey || apiKey !== "ecm-database-sharing-key") {
        return res.status(401).json({ message: "Unauthorized: Invalid API key" });
      }
      
      // Pobierz wszystkie usługi z bazy danych
      const allServices = await db.select().from(schema.services);
      
      console.log(`Synchronizacja danych ze źródła: ${sourceApp || 'unknown'}, znaleziono ${allServices.length} usług`);
      
      // Dostarcz dane do widoku podsumowania
      res.json({
        success: true,
        message: "Data synchronized successfully",
        source: sourceApp || 'unknown',
        data: {
          servicesCount: allServices.length,
          services: allServices.map(service => ({
            id: service.id,
            serviceId: service.serviceId,
            name: service.name
          }))
        }
      });
    } catch (error) {
      console.error("Error synchronizing data:", error);
      res.status(500).json({
        success: false,
        message: "Failed to synchronize data",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Endpoint do aktywnej synchronizacji usług z ServiceCatalog do ECM Digital
  app.post("/api/admin/sync-from-servicecatalog", async (req, res) => {
    try {
      const apiKey = req.query.key as string;
      const { serviceUrl, services: servicesToSync } = req.body;
      
      // Weryfikacja klucza API
      if (!apiKey || apiKey !== "ecm-database-sharing-key") {
        return res.status(401).json({ message: "Unauthorized: Invalid API key" });
      }
      
      if (!Array.isArray(servicesToSync)) {
        return res.status(400).json({ message: "Expected an array of services" });
      }
      
      console.log(`Otrzymano żądanie synchronizacji ${servicesToSync.length} usług z ServiceCatalog (${serviceUrl})`);
      
      type ServiceResult = {
        serviceId: string;
        name: string;
        status: string;
        error?: string;
      };
        
      const results = {
        added: 0,
        updated: 0,
        errors: 0,
        services: [] as ServiceResult[]
      };
      
      // Dla każdej usługi, spróbuj ją dodać lub zaktualizować
      for (const serviceData of servicesToSync) {
        try {
          // Sprawdź czy usługa już istnieje (po serviceId)
          const existingServices = await db
            .select()
            .from(schema.services)
            .where(eq(schema.services.serviceId, serviceData.id))
            .limit(1);
            
          const existingService = existingServices.length > 0 ? existingServices[0] : null;
          
          const serviceToUpsert = {
            serviceId: serviceData.id,
            name: serviceData.name,
            shortDescription: serviceData.shortDescription || '',
            description: serviceData.description,
            longDescription: serviceData.longDescription || '',
            basePrice: serviceData.basePrice,
            deliveryTime: serviceData.deliveryTime,
            features: serviceData.features || [],
            benefits: serviceData.benefits || [],
            scope: serviceData.scope || [],
            steps: serviceData.steps || [],
            category: serviceData.category || 'Inne',
            status: serviceData.status || 'Aktywna'
          };
          
          if (existingService) {
            // Aktualizuj istniejącą usługę
            const [updatedService] = await db
              .update(schema.services)
              .set(serviceToUpsert)
              .where(eq(schema.services.serviceId, serviceData.id))
              .returning();
              
            results.updated++;
            results.services.push({
              serviceId: updatedService.serviceId,
              name: updatedService.name,
              status: 'updated'
            });
            console.log(`Zaktualizowano usługę: ${serviceData.name} (${serviceData.id})`);
          } else {
            // Dodaj nową usługę
            const validatedData = insertServiceSchema.parse(serviceToUpsert);
            const [newService] = await db
              .insert(schema.services)
              .values(validatedData)
              .returning();
              
            results.added++;
            results.services.push({
              serviceId: newService.serviceId,
              name: newService.name,
              status: 'added'
            });
            console.log(`Dodano nową usługę: ${serviceData.name} (${serviceData.id})`);
          }
        } catch (error) {
          console.error(`Błąd podczas synchronizacji usługi ${serviceData.id}:`, error);
          results.errors++;
          results.services.push({
            serviceId: serviceData.id,
            name: serviceData.name || 'Unknown',
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
      
      res.json({
        success: true,
        message: `Synchronizacja zakończona: dodano ${results.added}, zaktualizowano ${results.updated}, błędów: ${results.errors}`,
        results
      });
    } catch (error) {
      console.error("Error in service synchronization:", error);
      res.status(500).json({
        success: false,
        message: "Failed to synchronize services",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Endpoint do zarządzania uprawnieniami - określa role aplikacji
  app.get("/api/admin/roles", async (req, res) => {
    try {
      const apiKey = req.query.key as string;
      const appName = req.query.app as string;
      
      // Weryfikacja klucza API
      if (!apiKey || apiKey !== "ecm-database-sharing-key") {
        return res.status(401).json({ message: "Unauthorized: Invalid API key" });
      }
      
      if (!appName) {
        return res.status(400).json({ message: "Bad request: Missing application name" });
      }
      
      // Określenie ról i uprawnień dla aplikacji
      const roles = {
        "ECM Digital": {
          name: "ECM Digital",
          description: "Aplikacja kliencka do prezentacji i zamawiania usług",
          role: "client",
          permissions: [
            { resource: "services", action: "read" },
            { resource: "orders", action: "create" },
            { resource: "orders", action: "read" }
          ]
        },
        "ServiceCatalog": {
          name: "ServiceCatalog",
          description: "Panel administracyjny do zarządzania usługami",
          role: "admin",
          permissions: [
            { resource: "services", action: "read" },
            { resource: "services", action: "create" },
            { resource: "services", action: "update" },
            { resource: "services", action: "delete" },
            { resource: "orders", action: "read" },
            { resource: "orders", action: "update" },
            { resource: "orders", action: "delete" },
            { resource: "users", action: "read" }
          ]
        }
      };
      
      // Zwróć informacje o rolach dla danej aplikacji lub 404, jeśli aplikacja nie istnieje
      const appRoles = roles[appName as keyof typeof roles];
      
      if (!appRoles) {
        return res.status(404).json({ 
          message: "Application not found",
          availableApps: Object.keys(roles)
        });
      }
      
      res.json(appRoles);
    } catch (error) {
      console.error("Error retrieving application roles:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve application roles",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Endpoint do aktualizacji usługi
  app.put("/api/admin/services/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const serviceData = req.body;
      
      // Znajdź usługę po ID
      const existingService = await storage.getService(parseInt(id));
      
      if (!existingService) {
        return res.status(404).json({ message: "Usługa nie znaleziona" });
      }
      
      // Aktualizuj usługę
      const serviceToUpdate = {
        ...existingService,
        name: serviceData.name,
        shortDescription: serviceData.shortDescription || existingService.shortDescription || '',
        description: serviceData.description,
        longDescription: serviceData.longDescription || existingService.longDescription || '',
        basePrice: serviceData.basePrice,
        deliveryTime: serviceData.deliveryTime,
        features: serviceData.features || existingService.features || [],
        benefits: serviceData.benefits || existingService.benefits || [],
        scope: serviceData.scope || existingService.scope || [],
        steps: serviceData.steps || existingService.steps || [],
        category: serviceData.category || existingService.category || 'Inne',
        status: serviceData.status || existingService.status || 'Aktywna'
      };
      
      // Zaktualizuj usługę w bazie
      const [updatedService] = await db
        .update(schema.services)
        .set(serviceToUpdate)
        .where(eq(schema.services.id, parseInt(id)))
        .returning();
      
      res.json({
        success: true,
        message: "Usługa zaktualizowana",
        service: updatedService
      });
    } catch (error) {
      console.error("Błąd podczas aktualizacji usługi:", error);
      res.status(500).json({
        success: false,
        message: "Błąd podczas aktualizacji usługi",
        error: error instanceof Error ? error.message : 'Nieznany błąd'
      });
    }
  });
  
  // ===== AI Service Generation Endpoints =====
  
  // Generate a complete service using AI
  app.post("/api/admin/ai/generate-service", async (req, res) => {
    try {
      const { name, category, basePrice, keywords, isDetailed } = req.body;
      
      // Ograniczenia dostępu - opcjonalnie możesz dodać klucz API do uwierzytelnienia
      // jeśli ta funkcja powinna być dostępna tylko dla administratorów
      
      // Generowanie danych usługi przy użyciu AI
      const generatedService = await generateServiceData({
        name, 
        category, 
        basePrice: basePrice ? Number(basePrice) : undefined,
        keywords: Array.isArray(keywords) ? keywords : (keywords ? [keywords] : []),
        isDetailed: Boolean(isDetailed)
      });
      
      // Generowanie unikatowego ID
      const existingServices = await storage.getAllServices();
      const newId = (existingServices.length ? 
        Math.max(...existingServices.map(s => parseInt(s.serviceId) || 0)) + 1 : 1).toString();
      
      // Przygotowanie danych do zapisania
      const serviceToInsert = {
        serviceId: newId,
        name: generatedService.name,
        shortDescription: generatedService.shortDescription,
        description: generatedService.description,
        longDescription: generatedService.longDescription,
        basePrice: generatedService.basePrice,
        deliveryTime: generatedService.deliveryTime,
        features: generatedService.features,
        benefits: generatedService.benefits,
        scope: generatedService.scope,
        category: generatedService.category,
        status: generatedService.status,
        steps: [] // Domyślnie puste kroki konfiguracji
      };
      
      res.json({
        success: true,
        message: "Service generated successfully",
        service: serviceToInsert
      });
    } catch (error) {
      console.error("Error generating service with AI:", error);
      res.status(500).json({
        success: false,
        message: "Error generating service",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Alias dla klienta/UI (bez prefixu /admin/)
  app.post("/api/ai/generate-service", async (req, res) => {
    try {
      const { name, category, basePrice, keywords, isDetailed } = req.body;
      
      // Generowanie danych usługi przy użyciu AI
      const generatedService = await generateServiceData({
        name, 
        category, 
        basePrice: basePrice ? Number(basePrice) : undefined,
        keywords: Array.isArray(keywords) ? keywords : (keywords ? [keywords] : []),
        isDetailed: Boolean(isDetailed)
      });
      
      // Generowanie unikatowego ID
      const existingServices = await storage.getAllServices();
      const newId = (existingServices.length ? 
        Math.max(...existingServices.map(s => parseInt(s.serviceId) || 0)) + 1 : 1).toString();
      
      // Przygotowanie danych do zapisania
      const serviceToInsert = {
        serviceId: newId,
        name: generatedService.name,
        shortDescription: generatedService.shortDescription,
        description: generatedService.description,
        longDescription: generatedService.longDescription,
        basePrice: generatedService.basePrice,
        deliveryTime: generatedService.deliveryTime,
        features: generatedService.features,
        benefits: generatedService.benefits,
        scope: generatedService.scope,
        category: generatedService.category,
        status: generatedService.status,
        steps: [] // Domyślnie puste kroki konfiguracji
      };
      
      res.json({
        success: true,
        message: "Service generated successfully",
        service: serviceToInsert
      });
    } catch (error) {
      console.error("Error generating service with AI:", error);
      res.status(500).json({
        success: false,
        message: "Error generating service",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Generate benefits for a service
  app.post("/api/admin/ai/generate-benefits", async (req, res) => {
    try {
      const { serviceName, description } = req.body;
      
      if (!serviceName || !description) {
        return res.status(400).json({
          success: false,
          message: "Service name and description are required"
        });
      }
      
      const benefits = await generateBenefits(serviceName, description);
      
      res.json({
        success: true,
        benefits
      });
    } catch (error) {
      console.error("Error generating benefits with AI:", error);
      res.status(500).json({
        success: false,
        message: "Error generating benefits",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Alias dla klienta/UI (bez prefixu /admin/)
  app.post("/api/ai/generate-benefits", async (req, res) => {
    try {
      const { serviceName, description } = req.body;
      
      if (!serviceName || !description) {
        return res.status(400).json({
          success: false,
          message: "Service name and description are required"
        });
      }
      
      const benefits = await generateBenefits(serviceName, description);
      
      res.json({
        success: true,
        benefits
      });
    } catch (error) {
      console.error("Error generating benefits with AI:", error);
      res.status(500).json({
        success: false,
        message: "Error generating benefits",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Generate scope for a service
  app.post("/api/admin/ai/generate-scope", async (req, res) => {
    try {
      const { serviceName, description } = req.body;
      
      if (!serviceName || !description) {
        return res.status(400).json({
          success: false,
          message: "Service name and description are required"
        });
      }
      
      const scope = await generateScope(serviceName, description);
      
      res.json({
        success: true,
        scope
      });
    } catch (error) {
      console.error("Error generating scope with AI:", error);
      res.status(500).json({
        success: false,
        message: "Error generating scope",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Alias dla klienta/UI (bez prefixu /admin/)
  app.post("/api/ai/generate-scope", async (req, res) => {
    try {
      const { serviceName, description } = req.body;
      
      if (!serviceName || !description) {
        return res.status(400).json({
          success: false,
          message: "Service name and description are required"
        });
      }
      
      const scope = await generateScope(serviceName, description);
      
      res.json({
        success: true,
        scope
      });
    } catch (error) {
      console.error("Error generating scope with AI:", error);
      res.status(500).json({
        success: false,
        message: "Error generating scope",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Enhance a service description
  app.post("/api/admin/ai/enhance-description", async (req, res) => {
    try {
      const { serviceName, description } = req.body;
      
      if (!serviceName || !description) {
        return res.status(400).json({
          success: false,
          message: "Service name and description are required"
        });
      }
      
      const enhancedDescription = await enhanceServiceDescription(serviceName, description);
      
      res.json({
        success: true,
        description: enhancedDescription
      });
    } catch (error) {
      console.error("Error enhancing description with AI:", error);
      res.status(500).json({
        success: false,
        message: "Error enhancing description",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Alias dla klienta/UI (bez prefixu /admin/)
  app.post("/api/ai/enhance-description", async (req, res) => {
    try {
      const { serviceName, description } = req.body;
      
      if (!serviceName || !description) {
        return res.status(400).json({
          success: false,
          message: "Service name and description are required"
        });
      }
      
      const enhancedDescription = await enhanceServiceDescription(serviceName, description);
      
      res.json({
        success: true,
        description: enhancedDescription
      });
    } catch (error) {
      console.error("Error enhancing description with AI:", error);
      res.status(500).json({
        success: false,
        message: "Error enhancing description",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // AI Pricing Assistant
  app.post("/api/ai/pricing-recommendation", async (req, res) => {
    try {
      const { serviceName, description, features, scope, currentPrice } = req.body;
      
      if (!serviceName || !description || !features || !scope) {
        return res.status(400).json({
          success: false,
          message: "Service name, description, features and scope are required"
        });
      }
      
      if (!Array.isArray(features) || !Array.isArray(scope)) {
        return res.status(400).json({
          success: false,
          message: "Features and scope must be arrays"
        });
      }
      
      const pricingRecommendation = await generatePricingRecommendation(
        serviceName, 
        description, 
        features, 
        scope, 
        currentPrice
      );
      
      res.json({
        success: true,
        recommendation: pricingRecommendation
      });
    } catch (error) {
      console.error("Error generating pricing recommendation with AI:", error);
      res.status(500).json({
        success: false,
        message: "Error generating pricing recommendation",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Generate service estimation (scope, time, cost)
  app.post("/api/ai/service-estimation", async (req, res) => {
    try {
      const {
        serviceName,
        serviceDescription,
        clientRequirements,
        targetBudget,
        targetDeadline,
        complexity
      } = req.body;
      
      if (!serviceName || !serviceDescription) {
        return res.status(400).json({
          success: false,
          message: "Service name and description are required"
        });
      }
      
      const estimation = await generateServiceEstimation({
        serviceName,
        serviceDescription,
        clientRequirements,
        targetBudget,
        targetDeadline,
        complexity
      });
      
      res.json({
        success: true,
        estimation
      });
    } catch (error) {
      console.error("Error generating service estimation with AI:", error);
      res.status(500).json({
        success: false,
        message: "Error generating service estimation",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // ========== CLIENT PANEL APIs ==========

  // Authentication middleware for client panel
  const authenticateClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Tutaj później będzie prawdziwa autentykacja (OAuth, JWT, itp.)
      // Na razie prostym token-em w nagłówku lub użytkownikiem demo
      const authToken = req.headers.authorization?.split(' ')[1];
      
      // Dla celów developerskich używamy tokenu testowego lub id użytkownika
      if (authToken === 'test-token' || req.query.userId) {
        const userId = req.query.userId ? parseInt(req.query.userId as string) : 1;
        const user = await storage.getUser(userId);
        
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        
        // Dodaj użytkownika do obiektu żądania
        (req as any).user = user;
        return next();
      }
      
      return res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
      console.error("Auth error:", error);
      return res.status(500).json({ message: "Authentication error" });
    }
  };

  // === USER ROUTES ===
  
  // Get current user profile
  app.get('/api/client/profile', authenticateClient, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      // Nie zwracaj hasła
      const { password, ...userProfile } = user;
      
      res.json(userProfile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Error fetching profile" });
    }
  });
  
  // Update user profile
  app.patch('/api/client/profile', authenticateClient, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const userData = req.body;
      
      // Walidacja danych - można dodać zod schema
      
      // Nie pozwalaj na zmianę roli
      delete userData.role;
      
      // Aktualizuj profil
      const updatedUser = await storage.updateUser(user.id, userData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Nie zwracaj hasła
      const { password, ...userProfile } = updatedUser;
      
      res.json(userProfile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Error updating profile" });
    }
  });

  // === ORDER ROUTES ===
  
  // Get client's orders
  app.get('/api/client/orders', authenticateClient, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const orders = await storage.getOrdersByUserId(user.id);
      
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Error fetching orders" });
    }
  });
  
  // Get a single order details
  app.get('/api/client/orders/:orderId', authenticateClient, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const orderId = req.params.orderId;
      
      // Find order by orderId (not database id)
      const order = await storage.getOrderByOrderId(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Check if order belongs to user
      if (order.userId !== user.id) {
        return res.status(403).json({ message: "Not authorized to view this order" });
      }
      
      // Get related data
      const files = await storage.getProjectFilesByOrderId(order.id);
      const milestones = await storage.getProjectMilestonesByOrderId(order.id);
      const messages = await storage.getMessagesByOrderId(order.id);
      
      // Get service details
      const service = await storage.getServiceByServiceId(order.serviceId);
      
      res.json({
        order,
        files,
        milestones,
        messages,
        service
      });
    } catch (error) {
      console.error("Error fetching order details:", error);
      res.status(500).json({ message: "Error fetching order details" });
    }
  });

  // === MESSAGE ROUTES ===
  
  // Get all messages for an order
  app.get('/api/client/orders/:orderId/messages', authenticateClient, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const orderId = parseInt(req.params.orderId);
      
      // Find order
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Check if order belongs to user
      if (order.userId !== user.id) {
        return res.status(403).json({ message: "Not authorized to view these messages" });
      }
      
      // Get messages
      const messages = await storage.getMessagesByOrderId(orderId);
      
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Error fetching messages" });
    }
  });
  
  // Send a new message
  app.post('/api/client/orders/:orderId/messages', authenticateClient, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const orderId = parseInt(req.params.orderId);
      const { content, receiverId } = req.body;
      
      // Find order
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Check if order belongs to user
      if (order.userId !== user.id) {
        return res.status(403).json({ message: "Not authorized to send messages for this order" });
      }
      
      // Create message
      const message = await storage.createMessage({
        orderId,
        senderId: user.id,
        receiverId, // ID odbiorcy (pracownika agencji)
        content,
        isRead: false
      });
      
      res.status(201).json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Error sending message" });
    }
  });

  // === FILE ROUTES ===
  
  // Get all files for an order
  app.get('/api/client/orders/:orderId/files', authenticateClient, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const orderId = parseInt(req.params.orderId);
      
      // Find order
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Check if order belongs to user
      if (order.userId !== user.id) {
        return res.status(403).json({ message: "Not authorized to view files for this order" });
      }
      
      // Get files
      const files = await storage.getProjectFilesByOrderId(orderId);
      
      res.json(files);
    } catch (error) {
      console.error("Error fetching files:", error);
      res.status(500).json({ message: "Error fetching files" });
    }
  });
  
  // Upload a file for an order
  app.post('/api/client/orders/:orderId/files', authenticateClient, upload.single('file'), async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const orderId = parseInt(req.params.orderId);
      const file = req.file;
      const { fileType } = req.body;
      
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      // Find order
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Check if order belongs to user
      if (order.userId !== user.id) {
        return res.status(403).json({ message: "Not authorized to upload files for this order" });
      }
      
      // Create file record
      const fileRecord = await storage.createProjectFile({
        orderId,
        fileName: file.originalname,
        fileUrl: `/uploads/${file.filename}`,
        fileType: fileType || 'other',
        fileSize: file.size,
        uploadedById: user.id
      });
      
      res.status(201).json(fileRecord);
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Error uploading file" });
    }
  });

  // === MILESTONE ROUTES ===
  
  // Get all milestones for an order
  app.get('/api/client/orders/:orderId/milestones', authenticateClient, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const orderId = parseInt(req.params.orderId);
      
      // Find order
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Check if order belongs to user
      if (order.userId !== user.id) {
        return res.status(403).json({ message: "Not authorized to view milestones for this order" });
      }
      
      // Get milestones
      const milestones = await storage.getProjectMilestonesByOrderId(orderId);
      
      res.json(milestones);
    } catch (error) {
      console.error("Error fetching milestones:", error);
      res.status(500).json({ message: "Error fetching milestones" });
    }
  });

  // === DASHBOARD ROUTES ===
  
  // Get dashboard data
  app.get('/api/client/dashboard', authenticateClient, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      // Get recent orders
      const orders = await storage.getOrdersByUserId(user.id);
      
      // Get unread messages count
      const messages = await storage.getUnreadMessagesByReceiverId(user.id);
      
      // Calculate summary data
      const activeOrders = orders.filter(order => order.status !== 'Zakończone' && order.status !== 'Anulowane').length;
      const completedOrders = orders.filter(order => order.status === 'Zakończone').length;
      const totalSpent = orders.filter(order => order.status === 'Zakończone').reduce((sum, order) => sum + order.totalPrice, 0);
      
      res.json({
        ordersCount: orders.length,
        activeOrders,
        completedOrders,
        unreadMessages: messages.length,
        totalSpent,
        recentOrders: orders.slice(0, 5) // 5 najnowszych zamówień
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Error fetching dashboard data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
