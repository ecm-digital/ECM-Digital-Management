import express, { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertServiceSchema } from "@shared/schema";
import multer from "multer";
import { z } from "zod";
import { nanoid } from "nanoid";
import path from "path";
import fs from "fs";
import { ParsedQs } from "qs";

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
      const services = await storage.getAllServices();
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
      
      res.json({ 
        id: order.id,
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

  const httpServer = createServer(app);
  return httpServer;
}
