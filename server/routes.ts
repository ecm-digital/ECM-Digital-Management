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
import { setupAuth, isAuthenticated, ensureAuthenticated } from "./replitAuth";
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
  "Mentoring & Konsultacje": "Mentoring & Beratung",
  "Strona E-commerce": "E-Commerce-Website",
  "Strony w Wix Studio i Webflow": "Wix Studio & Webflow Websites",
  "E-commerce z AI": "E-Commerce mit KI",
  "Kampania Google Ads": "Google Ads Kampagne",
  "MVP z AI": "MVP mit KI",
  "Performance & SEO": "Performance & SEO",
  "Facebook & Instagram Ads": "Facebook & Instagram Ads",
  "Strategie contentowe": "Content-Strategien",
  "Sklepy pod kampanie": "Kampagnen-Shops",
  "Automatyzacje (n8n, Zapier)": "Automatisierungen (n8n, Zapier)",
  "Custom AI Tools": "Individuelle KI-Tools",
  "Product Discovery Workshop": "Product Discovery Workshop",
  "UX Scorecard": "UX Scorecard",
  // Nowe usługi Figma 2025
  "AI Landing Pages": "AI Landing Pages",
  "AI Prototypy UI": "AI UI-Prototypen",
  "Kampanie graficzne z AI": "KI-gestützte Grafikdesign-Kampagnen",
  "Ilustracje & ikony": "Illustrationen & Icons",
  "Pixel-perfect Dev Ready": "Pixel-perfect Dev Ready"
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

// Mapowanie nazw usług do kluczy w pliku tłumaczeń
const serviceNameToKey: Record<string, string> = {
  // Usługi UX/UI
  "Audyt UX": "uxAudit",
  "Audyt UX z elementami AI": "uxAuditAi",
  "Tygodniowa opieka AI/UX (cena za tydzień)": "monthlyAiUxCare",
  "UX Scorecard": "uxScorecard",
  "Projektowanie lejków konwersji": "conversionFunnelDesign",
  "AI UX Assistant": "aiUxAssistant",
  
  // Web Development
  "Strona internetowa": "website",
  "Sklep internetowy": "webStore",
  "Aplikacja webowa": "aiWebApp",
  "Strony w Wix Studio i Webflow": "wixWebflow",
  "Strona E-commerce": "ecommerceWebsite",
  "E-commerce z AI": "aiEcommerce",
  "Performance & SEO": "performanceSeo",
  
  // Marketing
  "Kampania Social Media": "socialMediaCampaign",
  "Newsletter z insightami": "insightsNewsletter",
  "Kampania Google Ads": "googleAdsCampaign",
  "Facebook & Instagram Ads": "fbInstagramAds",
  "Strategie contentowe": "contentStrategies",
  "Sklepy pod kampanie": "campaignStores",
  
  // AI & Automatyzacja
  "AI Chatbot": "aiChatbot",
  "Integracja AI": "aiIntegration",
  "Automatyzacja Procesów Biznesowych": "businessProcessAutomation",
  "Automatyzacje (n8n, Zapier)": "n8nZapierAutomation",
  "Custom AI Tools": "customAiTools",
  
  // Startup
  "Product Discovery Workshop": "productDiscoveryWorkshop",
  "MVP z AI": "aiMvp",
  "MVP Startupu": "startupMvp",
  "Mentoring & Konsultacje": "mentoringConsulting",
  
  // Figma 2025
  "AI Landing Pages": "aiLandingPages",
  "AI Prototypy UI": "aiUiPrototypes",
  "Kampanie graficzne z AI": "aiGraphicCampaigns",
  "Ilustracje & ikony": "illustrationsIcons",
  "Pixel-perfect Dev Ready": "pixelPerfectDevReady"
};

// Funkcja pomocnicza do pobierania tłumaczeń usługi z pliku
const getServiceTranslation = (serviceName: string, lang: string) => {
  console.log("getServiceTranslation called for service:", serviceName, "lang:", lang);
  
  // Skip translation for non-German language
  if (lang !== 'de') {
    return null;
  }
  
  const serviceKey = serviceNameToKey[serviceName];
  if (!serviceKey) {
    console.log("No key mapping found for service:", serviceName);
    return null;
  }
  
  try {
    // Załaduj plik tłumaczeń
    const translationsPath = path.join(process.cwd(), 'client/public/locales/de/translation.json');
    
    const translationsFile = fs.readFileSync(translationsPath, 'utf8');
    const translations = JSON.parse(translationsFile);
    
    // Szukamy tłumaczenia w odpowiedniej ścieżce
    let translation = null;
    
    // Na podstawie sprawdzenia struktury, wiemy że servicesList jest pod services
    if (translations.services && translations.services.servicesList && 
        translations.services.servicesList[serviceKey]) {
      translation = translations.services.servicesList[serviceKey];
      console.log(`Found translation in services.servicesList for key: ${serviceKey}`);
    }
    
    if (!translation) {
      console.log(`No translation found for service key: ${serviceKey}`);
      return null;
    }
    
    // Jeśli mamy description, a nie mamy longDescription, stwórz przynajmniej podstawowy longDescription
    if (translation.description && !translation.longDescription) {
      translation.longDescription = translation.description + " " + 
        (translation.benefits || []).join(" ") + " " + 
        (translation.features || []).join(" ");
    }
    
    console.log(`Translation found for ${serviceName}, returning translated content`);
    return translation;
  } catch (error) {
    console.error("Error loading translations:", error);
    return null;
  }
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
  // Auth middleware setup
  await setupAuth(app);

  // Auth route for client panel
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Client panel protected route
  app.get('/api/client/dashboard', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      // Fetch client-specific data
      const orders = await storage.getOrdersByUserId(userId);
      const messages = await storage.getMessagesByReceiverId(userId);
      const welcomeMessages = await storage.getWelcomeMessagesByUserId(userId);
      
      res.json({
        orders,
        messages,
        welcomeMessages,
        unreadMessageCount: messages.filter(m => !m.isRead).length
      });
    } catch (error) {
      console.error("Error fetching client dashboard data:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

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
          
        // Pobierz tłumaczenia dla usługi
        const serviceKey = serviceNameToKey[service.name];
        const serviceTranslation = serviceKey && lang === 'de' ? getServiceTranslation(service.name, lang) : null;
        
        console.log(`Service ${service.name} (key: ${serviceKey}) translation in ${lang}:`, 
          serviceTranslation ? "Found" : "Not found");
        
        // Przelicz cenę na euro dla niemieckiej wersji (kurs 4.3 PLN za 1 EUR)
        const basePrice = lang === 'de' 
          ? Math.round(service.basePrice / 4.3) 
          : service.basePrice;

        return {
          id: service.serviceId,
          name: serviceName,
          shortDescription: serviceTranslation?.shortDescription || service.shortDescription || '',
          description: serviceTranslation?.description || service.description,
          longDescription: serviceTranslation?.longDescription || service.longDescription || '',
          basePrice: basePrice,
          deliveryTime: service.deliveryTime,
          features: serviceTranslation?.features || service.features || [],
          benefits: serviceTranslation?.benefits || service.benefits || [],
          scope: serviceTranslation?.scope || service.scope || [],
          steps: service.steps,
          category: serviceCategory,
          status: service.status || 'Aktywna',
          original: { // Zachowaj oryginalne wartości dla referencji
            name: service.name,
            category: service.category
          }
        };
      });
      
      // Logowanie pierwszych kilku usług dla diagnostyki
      if (services.length > 0) {
        console.log(`First service after translation (${lang}):`, {
          name: services[0].name,
          category: services[0].category,
          shortDescription: services[0].shortDescription.substring(0, 30) + '...'
        });
      }
      
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
      
      // Pobierz tłumaczenia dla usługi
      const serviceKey = serviceNameToKey[serviceFromDb.name];
      const serviceTranslation = serviceKey && lang === 'de' ? getServiceTranslation(serviceFromDb.name, lang) : null;
      
      console.log(`Service ${serviceFromDb.name} (key: ${serviceKey}) translation in ${lang}:`, 
        serviceTranslation ? "Found" : "Not found");
    
      // Przelicz cenę na euro dla niemieckiej wersji (kurs 4.3 PLN za 1 EUR)
      const basePrice = lang === 'de' 
        ? Math.round(serviceFromDb.basePrice / 4.3) 
        : serviceFromDb.basePrice;
        
      // Transform database model to client model
      const service = {
        id: serviceFromDb.serviceId,
        name: serviceName,
        shortDescription: serviceTranslation?.shortDescription || serviceFromDb.shortDescription || '',
        description: serviceTranslation?.description || serviceFromDb.description,
        longDescription: serviceTranslation?.longDescription || serviceFromDb.longDescription || '',
        basePrice: basePrice,
        deliveryTime: serviceFromDb.deliveryTime,
        features: serviceTranslation?.features || serviceFromDb.features || [],
        benefits: serviceTranslation?.benefits || serviceFromDb.benefits || [],
        scope: serviceTranslation?.scope || serviceFromDb.scope || [],
        steps: serviceFromDb.steps || [],
        category: serviceCategory,
        status: serviceFromDb.status || 'Aktywna',
        original: { // Zachowaj oryginalne wartości dla referencji
          name: serviceFromDb.name,
          category: serviceFromDb.category
        }
      };
      
      console.log("Service being returned to client (language: " + lang + "):", {
        name: service.name,
        category: service.category,
        shortDescription: service.shortDescription?.substring(0, 30) + '...'
      });
      
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
        orders: await storage.getOrdersByUserId("1"),
        messages: await storage.getMessagesByReceiverId("1"),
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
      const { username } = req.body;
      
      if (!username) {
        return res.status(400).json({ message: "Username is required" });
      }
      
      // Unikatowe ID dla użytkownika
      const userId = `user_${Date.now()}`;
      
      const user = await storage.createUser({ 
        id: userId,
        username,
        email: `${username}@example.com`,
        firstName: "Test",
        lastName: "User",
        role: "client"
      });
      
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
              email: "email",
              firstName: "first_name",
              lastName: "last_name",
              profileImageUrl: "profile_image_url",
              role: "role",
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
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const user = req.user as any;
      const userId = user.claims.sub;
      
      // Pobierz pełne dane użytkownika z bazy
      const userFromDb = await storage.getUser(userId);
      
      if (!userFromDb) {
        return res.status(404).json({ message: "User not found. Please complete registration." });
      }
      
      // Dodaj użytkownika z bazy do obiektu żądania
      (req as any).user = userFromDb;
      next();
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
      res.json(user);
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
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Error updating profile" });
    }
  });
  
  // Onboarding API endpoints
  app.get('/api/client/onboarding/status', authenticateClient, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const step = await storage.getUserOnboardingStep(user.id);
      
      res.json({
        step,
        completed: user.onboardingCompleted || false,
        industry: user.industry,
        projectType: user.projectType,
        preferences: user.preferences
      });
    } catch (error) {
      console.error("Error fetching onboarding status:", error);
      res.status(500).json({ message: "Failed to fetch onboarding status" });
    }
  });
  
  app.post('/api/client/onboarding/step', authenticateClient, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const { step } = req.body;
      
      if (typeof step !== 'number') {
        return res.status(400).json({ message: "Invalid step parameter" });
      }
      
      const updatedUser = await storage.updateUserOnboardingStep(user.id, step);
      res.json({ success: true, currentStep: step });
    } catch (error) {
      console.error("Error updating onboarding step:", error);
      res.status(500).json({ message: "Failed to update onboarding step" });
    }
  });
  
  app.post('/api/client/onboarding/complete', authenticateClient, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const { preferences, industry, projectType } = req.body;
      
      const updatedUser = await storage.updateUser(user.id, {
        onboardingStep: 999,
        onboardingCompleted: true,
        preferences,
        industry, 
        projectType
      });
      
      res.json({ 
        success: true, 
        message: "Onboarding completed successfully" 
      });
    } catch (error) {
      console.error("Error completing onboarding:", error);
      res.status(500).json({ message: "Failed to complete onboarding" });
    }
  });
  
  app.get('/api/client/welcome-messages', authenticateClient, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      const messages = await storage.getWelcomeMessagesByUserId(user.id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching welcome messages:", error);
      res.status(500).json({ message: "Failed to fetch welcome messages" });
    }
  });
  
  app.post('/api/client/welcome-messages', authenticateClient, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const { step, title, content, actionLabel, actionType } = req.body;
      
      if (typeof step !== 'number' || !title || !content) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const message = await storage.createWelcomeMessage(
        user.id,
        step,
        title,
        content,
        actionLabel,
        actionType
      );
      
      res.json(message);
    } catch (error) {
      console.error("Error creating welcome message:", error);
      res.status(500).json({ message: "Failed to create welcome message" });
    }
  });
  
  app.put('/api/client/welcome-messages/:id/complete', authenticateClient, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const messageId = parseInt(req.params.id);
      
      if (isNaN(messageId)) {
        return res.status(400).json({ message: "Invalid message ID" });
      }
      
      const message = await storage.markWelcomeMessageAsCompleted(messageId);
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      res.json(message);
    } catch (error) {
      console.error("Error marking welcome message as completed:", error);
      res.status(500).json({ message: "Failed to mark welcome message as completed" });
    }
  });

  // === BLOG ROUTES ===
  
  // Get all blog posts (public)
  app.get('/api/blog/posts', async (req: Request, res: Response) => {
    try {
      const status = req.query.status as string || 'published';
      const category = req.query.category as string;
      const tag = req.query.tag as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      let posts;
      
      if (category) {
        posts = await storage.getBlogPostsByCategory(category, status);
      } else if (tag) {
        posts = await storage.getBlogPostsByTag(tag, status);
      } else if (limit) {
        posts = await storage.getRecentBlogPosts(limit, status);
      } else {
        posts = await storage.getAllBlogPosts(status);
      }
      
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });
  
  // Get a single blog post by slug (public)
  app.get('/api/blog/posts/:slug', async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      // Increment view count
      await storage.incrementBlogPostViewCount(post.id);
      
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });
  
  // Create a new blog post (admin only)
  app.post('/api/blog/posts', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      // Sprawdź, czy użytkownik ma uprawnienia administratora
      const userFromDb = await storage.getUser(user.claims.sub);
      if (!userFromDb || userFromDb.role !== 'admin') {
        return res.status(403).json({ message: "Permission denied" });
      }
      
      const {
        slug,
        title,
        excerpt,
        content,
        category,
        tags,
        thumbnailUrl,
        status = 'draft'
      } = req.body;
      
      if (!slug || !title || !excerpt || !content) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Sprawdź czy slug jest już używany
      const existingPost = await storage.getBlogPostBySlug(slug);
      if (existingPost) {
        return res.status(409).json({ message: "Slug already exists" });
      }
      
      const post = await storage.createBlogPost({
        slug,
        title,
        excerpt,
        content,
        authorId: parseInt(userFromDb.id),
        category,
        tags,
        thumbnailUrl,
        status,
        publishedAt: status === 'published' ? new Date() : undefined
      });
      
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });
  
  // Update a blog post (admin only)
  app.put('/api/blog/posts/:id', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const postId = parseInt(req.params.id);
      
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      // Sprawdź, czy użytkownik ma uprawnienia administratora
      const userFromDb = await storage.getUser(user.claims.sub);
      if (!userFromDb || userFromDb.role !== 'admin') {
        return res.status(403).json({ message: "Permission denied" });
      }
      
      const post = await storage.getBlogPost(postId);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      const {
        slug,
        title,
        excerpt,
        content,
        category,
        tags,
        thumbnailUrl,
        status
      } = req.body;
      
      // Jeśli slug się zmienił, sprawdź czy nowy slug jest już używany
      if (slug && slug !== post.slug) {
        const existingPost = await storage.getBlogPostBySlug(slug);
        if (existingPost && existingPost.id !== postId) {
          return res.status(409).json({ message: "Slug already exists" });
        }
      }
      
      const updatedPost = await storage.updateBlogPost(postId, {
        slug,
        title,
        excerpt,
        content,
        category,
        tags,
        thumbnailUrl,
        status
      });
      
      res.json(updatedPost);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });
  
  // Delete a blog post (admin only)
  app.delete('/api/blog/posts/:id', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const postId = parseInt(req.params.id);
      
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      // Sprawdź, czy użytkownik ma uprawnienia administratora
      const userFromDb = await storage.getUser(user.claims.sub);
      if (!userFromDb || userFromDb.role !== 'admin') {
        return res.status(403).json({ message: "Permission denied" });
      }
      
      const post = await storage.getBlogPost(postId);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      const deleted = await storage.deleteBlogPost(postId);
      if (!deleted) {
        return res.status(500).json({ message: "Failed to delete blog post" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });
  
  // Search blog posts (public)
  app.get('/api/blog/search', async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      const status = req.query.status as string || 'published';
      
      if (!query || query.trim().length < 3) {
        return res.status(400).json({ message: "Search query must be at least 3 characters" });
      }
      
      const posts = await storage.searchBlogPosts(query, status);
      res.json(posts);
    } catch (error) {
      console.error("Error searching blog posts:", error);
      res.status(500).json({ message: "Failed to search blog posts" });
    }
  });
  
  // === KNOWLEDGE BASE ROUTES ===
  
  // Get all knowledge base articles (public)
  app.get('/api/kb/articles', async (req: Request, res: Response) => {
    try {
      const status = req.query.status as string || 'published';
      const category = req.query.category as string;
      const tag = req.query.tag as string;
      
      let articles;
      
      if (category) {
        articles = await storage.getKnowledgeBaseArticlesByCategory(category, status);
      } else if (tag) {
        articles = await storage.getKnowledgeBaseArticlesByTag(tag, status);
      } else {
        articles = await storage.getAllKnowledgeBaseArticles(status);
      }
      
      res.json(articles);
    } catch (error) {
      console.error("Error fetching knowledge base articles:", error);
      res.status(500).json({ message: "Failed to fetch knowledge base articles" });
    }
  });
  
  // Get a single knowledge base article by slug (public)
  app.get('/api/kb/articles/:slug', async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const article = await storage.getKnowledgeBaseArticleBySlug(slug);
      
      if (!article) {
        return res.status(404).json({ message: "Knowledge base article not found" });
      }
      
      // Increment view count
      await storage.incrementKnowledgeBaseArticleViewCount(article.id);
      
      res.json(article);
    } catch (error) {
      console.error("Error fetching knowledge base article:", error);
      res.status(500).json({ message: "Failed to fetch knowledge base article" });
    }
  });
  
  // Create a new knowledge base article (admin only)
  app.post('/api/kb/articles', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      // Sprawdź, czy użytkownik ma uprawnienia administratora
      const userFromDb = await storage.getUser(user.claims.sub);
      if (!userFromDb || userFromDb.role !== 'admin') {
        return res.status(403).json({ message: "Permission denied" });
      }
      
      const {
        slug,
        title,
        excerpt,
        content,
        category,
        tags,
        thumbnailUrl,
        status = 'draft'
      } = req.body;
      
      if (!slug || !title || !excerpt || !content || !category) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Sprawdź czy slug jest już używany
      const existingArticle = await storage.getKnowledgeBaseArticleBySlug(slug);
      if (existingArticle) {
        return res.status(409).json({ message: "Slug already exists" });
      }
      
      const article = await storage.createKnowledgeBaseArticle({
        slug,
        title,
        excerpt,
        content,
        category,
        authorId: parseInt(userFromDb.id),
        tags,
        thumbnailUrl,
        status,
        publishedAt: status === 'published' ? new Date() : undefined
      });
      
      res.status(201).json(article);
    } catch (error) {
      console.error("Error creating knowledge base article:", error);
      res.status(500).json({ message: "Failed to create knowledge base article" });
    }
  });
  
  // Update a knowledge base article (admin only)
  app.put('/api/kb/articles/:id', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const articleId = parseInt(req.params.id);
      
      if (isNaN(articleId)) {
        return res.status(400).json({ message: "Invalid article ID" });
      }
      
      // Sprawdź, czy użytkownik ma uprawnienia administratora
      const userFromDb = await storage.getUser(user.claims.sub);
      if (!userFromDb || userFromDb.role !== 'admin') {
        return res.status(403).json({ message: "Permission denied" });
      }
      
      const article = await storage.getKnowledgeBaseArticle(articleId);
      if (!article) {
        return res.status(404).json({ message: "Knowledge base article not found" });
      }
      
      const {
        slug,
        title,
        excerpt,
        content,
        category,
        tags,
        thumbnailUrl,
        status
      } = req.body;
      
      // Jeśli slug się zmienił, sprawdź czy nowy slug jest już używany
      if (slug && slug !== article.slug) {
        const existingArticle = await storage.getKnowledgeBaseArticleBySlug(slug);
        if (existingArticle && existingArticle.id !== articleId) {
          return res.status(409).json({ message: "Slug already exists" });
        }
      }
      
      const updatedArticle = await storage.updateKnowledgeBaseArticle(articleId, {
        slug,
        title,
        excerpt,
        content,
        category,
        tags,
        thumbnailUrl,
        status
      });
      
      res.json(updatedArticle);
    } catch (error) {
      console.error("Error updating knowledge base article:", error);
      res.status(500).json({ message: "Failed to update knowledge base article" });
    }
  });
  
  // Delete a knowledge base article (admin only)
  app.delete('/api/kb/articles/:id', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const articleId = parseInt(req.params.id);
      
      if (isNaN(articleId)) {
        return res.status(400).json({ message: "Invalid article ID" });
      }
      
      // Sprawdź, czy użytkownik ma uprawnienia administratora
      const userFromDb = await storage.getUser(user.claims.sub);
      if (!userFromDb || userFromDb.role !== 'admin') {
        return res.status(403).json({ message: "Permission denied" });
      }
      
      const article = await storage.getKnowledgeBaseArticle(articleId);
      if (!article) {
        return res.status(404).json({ message: "Knowledge base article not found" });
      }
      
      const deleted = await storage.deleteKnowledgeBaseArticle(articleId);
      if (!deleted) {
        return res.status(500).json({ message: "Failed to delete knowledge base article" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting knowledge base article:", error);
      res.status(500).json({ message: "Failed to delete knowledge base article" });
    }
  });
  
  // Search knowledge base articles (public)
  app.get('/api/kb/search', async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      const status = req.query.status as string || 'published';
      
      if (!query || query.trim().length < 3) {
        return res.status(400).json({ message: "Search query must be at least 3 characters" });
      }
      
      const articles = await storage.searchKnowledgeBaseArticles(query, status);
      res.json(articles);
    } catch (error) {
      console.error("Error searching knowledge base articles:", error);
      res.status(500).json({ message: "Failed to search knowledge base articles" });
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
