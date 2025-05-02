import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Services table - for storing service configuration options
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  serviceId: text("service_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  basePrice: integer("base_price").notNull(),
  deliveryTime: integer("delivery_time").notNull(),
  features: text("features").array(),
  steps: jsonb("steps"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Orders table - for storing customer orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  serviceId: text("service_id").notNull(),
  configuration: jsonb("configuration").notNull(),
  contactInfo: jsonb("contact_info").notNull(),
  totalPrice: integer("total_price").notNull(),
  deliveryTime: integer("delivery_time").notNull(),
  fileUrl: text("file_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertServiceSchema = createInsertSchema(services).omit({ id: true, createdAt: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });

// Types
export type InsertService = z.infer<typeof insertServiceSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Service = typeof services.$inferSelect;
export type Order = typeof orders.$inferSelect;
