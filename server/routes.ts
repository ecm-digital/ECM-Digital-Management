import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { 
  getStorage as getFirebaseStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage";
import multer from "multer";
import { z } from "zod";
import { nanoid } from "nanoid";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const firebaseStorage = getFirebaseStorage(firebaseApp);

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Service Schema
const serviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  basePrice: z.number(),
  deliveryTime: z.number(),
  features: z.array(z.string()).optional(),
  steps: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      layout: z.enum(['grid', 'checkbox-grid', 'default']).optional(),
      options: z.array(
        z.object({
          id: z.string(),
          type: z.enum(['select', 'checkbox', 'text']),
          label: z.string(),
          description: z.string().optional(),
          priceAdjustment: z.number().optional(),
          deliveryTimeAdjustment: z.number().optional(),
          choices: z.array(
            z.object({
              value: z.string(),
              label: z.string(),
              priceAdjustment: z.number().optional(),
              deliveryTimeAdjustment: z.number().optional(),
            })
          ).optional(),
        })
      ).optional(),
    })
  ).optional(),
});

// Order Schema
const orderSchema = z.object({
  service: serviceSchema.nullable(),
  configuration: z.record(z.any()),
  contactInfo: z.record(z.any()),
  totalPrice: z.number(),
  deliveryTime: z.number(),
  fileUrl: z.string().optional(),
  createdAt: z.string(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get services from Firestore
  app.get("/api/services", async (req, res) => {
    try {
      const servicesCol = collection(db, "services");
      const servicesSnapshot = await getDocs(servicesCol);
      const servicesList = servicesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      res.json(servicesList);
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

      const fileId = nanoid();
      const fileExtension = req.file.originalname.split('.').pop();
      const filePath = `uploads/${fileId}.${fileExtension}`;
      
      // Create a reference to the file in Firebase Storage
      const storageRef = ref(firebaseStorage, filePath);
      
      // Upload the file buffer
      await uploadBytes(storageRef, req.file.buffer, {
        contentType: req.file.mimetype,
      });
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      res.json({ url: downloadURL });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Error uploading file" });
    }
  });

  // Submit order
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = orderSchema.parse(req.body);
      
      // Add order to Firestore
      const ordersCol = collection(db, "orders");
      const orderRef = await addDoc(ordersCol, {
        ...orderData,
        createdAt: serverTimestamp()
      });
      
      res.json({ 
        id: orderRef.id,
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

  const httpServer = createServer(app);
  return httpServer;
}
