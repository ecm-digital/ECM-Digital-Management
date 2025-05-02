import { pgTable, text, serial, integer, boolean, jsonb, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    usernameIdx: uniqueIndex("username_idx").on(table.username),
  };
});

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
  category: text("category").default("Inne"), // Pojedyncza kategoria
  status: text("status").default("Aktywna"),  // Status usługi
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
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

// Insert schemas
export const insertServiceSchema = createInsertSchema(services).omit({ id: true, createdAt: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });

// Types
export type InsertService = z.infer<typeof insertServiceSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Service = typeof services.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type User = typeof users.$inferSelect;
