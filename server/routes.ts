import express, { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertServiceSchema, services } from "@shared/schema";
import multer from "multer";
import { z } from "zod";
import { nanoid } from "nanoid";
import path from "path";
import fs from "fs";
import { ParsedQs } from "qs";
import axios from "axios";
import { db } from "./db";

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
      
      // Transform database model to client model
      const services = servicesFromDb.map(service => ({
        id: service.serviceId, // Use service_id as id (should be a string)
        name: service.name,
        description: service.description,
        basePrice: service.basePrice,
        deliveryTime: service.deliveryTime,
        features: service.features,
        steps: service.steps,
      }));
      
      console.log("Services being returned to client:", services);
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Error fetching services" });
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

  // Import services from JSON (for initial setup)
  app.post("/api/admin/import-services", async (req, res) => {
    try {
      const { services } = req.body;
      
      if (!Array.isArray(services)) {
        return res.status(400).json({ message: "Expected an array of services" });
      }
      
      const results = [];
      
      for (const serviceData of services) {
        const insertData = {
          serviceId: serviceData.id,
          name: serviceData.name,
          description: serviceData.description,
          basePrice: serviceData.basePrice,
          deliveryTime: serviceData.deliveryTime,
          features: serviceData.features || [],
          steps: serviceData.steps || []
        };
        
        const validatedServiceData = insertServiceSchema.parse(insertData);
        const service = await storage.createService(validatedServiceData);
        results.push(service);
      }
      
      res.json({ 
        count: results.length,
        message: "Services imported successfully" 
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
              description: "description",
              basePrice: "base_price",
              deliveryTime: "delivery_time",
              features: "features",
              steps: "steps",
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
      const result = await db.select().from(services).limit(1);
      
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
  
  // Endpoint do synchronizacji danych pomiędzy aplikacjami
  app.post("/api/admin/sync-services", async (req, res) => {
    try {
      const apiKey = req.query.key as string;
      const { sourceApp } = req.body;
      
      // Weryfikacja klucza API
      if (!apiKey || apiKey !== "ecm-database-sharing-key") {
        return res.status(401).json({ message: "Unauthorized: Invalid API key" });
      }
      
      // Pobierz wszystkie usługi z bazy danych
      const allServices = await db.select().from(services);
      
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

  const httpServer = createServer(app);
  return httpServer;
}
