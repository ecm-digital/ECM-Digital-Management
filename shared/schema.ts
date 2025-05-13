import { pgTable, text, serial, integer, boolean, jsonb, timestamp, uniqueIndex, varchar, index, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table dla Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table - obsługuje zarówno Replit Auth jak i tradycyjne logowanie
export const users = pgTable("users", {
  id: integer("id").primaryKey().notNull(), // ID użytkownika (integer)
  username: varchar("username").unique().notNull(),
  email: varchar("email").unique(),
  password: varchar("password"), // Pole na hasło (haszowane)
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  bio: text("bio"),
  profileImage: varchar("profile_image"), // Zauważ zmianę z profileImageUrl na profileImage
  company: text("company"),
  role: text("role").default("client"), // client, admin, agent
  createdAt: timestamp("created_at").defaultNow(),
});

// Services table - for storing service configuration options
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  serviceId: text("service_id").notNull(),
  name: text("name").notNull(),
  shortDescription: text("short_description"),  // Krótki opis
  description: text("description").notNull(),  // Podstawowy opis
  longDescription: text("long_description"),   // Długi opis (szczegółowy)
  basePrice: integer("base_price").notNull(),
  deliveryTime: integer("delivery_time").notNull(),
  features: text("features").array(),          // Główne cechy (zostaje dla wstecznej kompatybilności)
  benefits: text("benefits").array(),          // Lista korzyści
  scope: text("scope").array(),                // Zakres usługi
  steps: jsonb("steps"),
  category: text("category").default("Inne"),  // Pojedyncza kategoria
  status: text("status").default("Aktywna"),   // Status usługi
  createdAt: timestamp("created_at").defaultNow(),
});

// Orders table - for storing customer orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  serviceId: text("service_id").notNull(),
  orderId: text("order_id").notNull(), // unikalny identyfikator zamówienia
  configuration: jsonb("configuration").notNull(),
  contactInfo: jsonb("contact_info").notNull(),
  totalPrice: integer("total_price").notNull(),
  deliveryTime: integer("delivery_time").notNull(),
  fileUrl: text("file_url"),
  status: text("status").default("Nowe"), // Nowe, W realizacji, Zakończone, Anulowane
  userId: integer("user_id").references(() => users.id),
  assignedToId: integer("assigned_to_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deadline: timestamp("deadline"),
});

// Project files table - pliki związane z zamówieniami
export const projectFiles = pgTable("project_files", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type"), // Typ pliku (np. 'brief', 'design', 'final')
  fileSize: integer("file_size"),
  uploadedById: integer("uploaded_by_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Messages table - wiadomości między klientem a agencją
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  receiverId: integer("receiver_id").references(() => users.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Project notes - notatki do projektów widoczne tylko dla agencji
export const projectNotes = pgTable("project_notes", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  createdById: integer("created_by_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Task/milestone table - etapy realizacji projektu
export const projectMilestones = pgTable("project_milestones", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("Oczekujące"), // Oczekujące, W trakcie, Zakończone
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tabela wiadomości powitalnych
export const welcomeMessages = pgTable("welcome_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  step: integer("step").notNull(), // Kolejny krok w sekwencji powitalnej
  title: text("title").notNull(), // Tytuł wiadomości
  content: text("content").notNull(), // Treść wiadomości
  actionLabel: text("action_label"), // Etykieta przycisku akcji
  actionType: text("action_type"), // Typ akcji (np. "next", "complete", "skip")
  isCompleted: boolean("is_completed").default(false), // Czy krok został zakończony
  completedAt: timestamp("completed_at"), // Kiedy krok został zakończony
  createdAt: timestamp("created_at").defaultNow(),
});

// Blog posts - tabela dla wpisów na blogu
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(), // URL-friendly identyfikator postu
  title: text("title").notNull(), // Tytuł wpisu
  excerpt: text("excerpt").notNull(), // Krótki opis/fragment wpisu
  content: text("content").notNull(), // Pełna treść wpisu w formacie HTML/Markdown
  authorId: integer("author_id").references(() => users.id).notNull(), // Autor wpisu
  thumbnailUrl: text("thumbnail_url"), // URL obrazka wyróżniającego
  tags: text("tags").array(), // Tagi dla wpisu
  category: text("category"), // Kategoria wpisu
  status: text("status").default("draft"), // Status: draft, published, archived
  viewCount: integer("view_count").default(0), // Licznik wyświetleń
  publishedAt: timestamp("published_at"), // Data publikacji
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Knowledge base - tabela dla bazy wiedzy
export const knowledgeBase = pgTable("knowledge_base", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(), // URL-friendly identyfikator artykułu
  title: text("title").notNull(), // Tytuł artykułu
  excerpt: text("excerpt").notNull(), // Krótki opis/fragment artykułu
  content: text("content").notNull(), // Pełna treść artykułu w formacie HTML/Markdown
  category: text("category").notNull(), // Kategoria: tutorials, faq, guides, itp.
  authorId: integer("author_id").references(() => users.id).notNull(), // Autor artykułu
  thumbnailUrl: text("thumbnail_url"), // URL obrazka wyróżniającego
  tags: text("tags").array(), // Tagi dla artykułu
  status: text("status").default("draft"), // Status: draft, published, archived
  viewCount: integer("view_count").default(0), // Licznik wyświetleń
  publishedAt: timestamp("published_at"), // Data publikacji
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lead Magnet - tabela do przechowywania leadów
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  email: varchar("email").notNull(),
  leadType: varchar("lead_type").notNull().default("newsletter"),
  source: varchar("source"), // skąd pochodzi lead (ścieżka URL)
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  consentGiven: boolean("consent_given").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  convertedAt: timestamp("converted_at"),
  convertedToCustomer: boolean("converted_to_customer").default(false),
  additionalData: jsonb("additional_data"), // dodatkowe dane zależne od typu leada
});

// Relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  assignedTo: one(users, {
    fields: [orders.assignedToId],
    references: [users.id],
  }),
  files: many(projectFiles),
  messages: many(messages),
  notes: many(projectNotes),
  milestones: many(projectMilestones),
}));

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders, { relationName: "userOrders" }),
  assignedOrders: many(orders, { relationName: "assignedOrders" }),
  uploadedFiles: many(projectFiles),
  sentMessages: many(messages, { relationName: "sentMessages" }),
  receivedMessages: many(messages, { relationName: "receivedMessages" }),
  notes: many(projectNotes),
  welcomeMessages: many(welcomeMessages),
  blogPosts: many(blogPosts),
  knowledgeBaseArticles: many(knowledgeBase),
}));

export const welcomeMessagesRelations = relations(welcomeMessages, ({ one }) => ({
  user: one(users, {
    fields: [welcomeMessages.userId],
    references: [users.id],
  }),
}));

export const projectFilesRelations = relations(projectFiles, ({ one }) => ({
  order: one(orders, {
    fields: [projectFiles.orderId],
    references: [orders.id],
  }),
  uploadedBy: one(users, {
    fields: [projectFiles.uploadedById],
    references: [users.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  order: one(orders, {
    fields: [messages.orderId],
    references: [orders.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
  }),
}));

export const projectNotesRelations = relations(projectNotes, ({ one }) => ({
  order: one(orders, {
    fields: [projectNotes.orderId],
    references: [orders.id],
  }),
  createdBy: one(users, {
    fields: [projectNotes.createdById],
    references: [users.id],
  }),
}));

export const projectMilestonesRelations = relations(projectMilestones, ({ one }) => ({
  order: one(orders, {
    fields: [projectMilestones.orderId],
    references: [orders.id],
  }),
}));

// Relacje dla bloga
export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
}));

// Relacje dla bazy wiedzy
export const knowledgeBaseRelations = relations(knowledgeBase, ({ one }) => ({
  author: one(users, {
    fields: [knowledgeBase.authorId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertServiceSchema = createInsertSchema(services).omit({ id: true, createdAt: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, updatedAt: true });
export const insertUserSchema = createInsertSchema(users).omit({ createdAt: true, updatedAt: true });
export const insertProjectFileSchema = createInsertSchema(projectFiles).omit({ id: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const insertProjectNoteSchema = createInsertSchema(projectNotes).omit({ id: true, createdAt: true, updatedAt: true });
export const insertProjectMilestoneSchema = createInsertSchema(projectMilestones).omit({ id: true, createdAt: true });
export const insertWelcomeMessageSchema = createInsertSchema(welcomeMessages).omit({ id: true, createdAt: true, completedAt: true });

// Schematy uwierzytelniania
export const loginSchema = z.object({
  username: z.string().min(1, { message: "Nazwa użytkownika jest wymagana" }),
  password: z.string().min(8, { message: "Hasło musi zawierać co najmniej 8 znaków" })
});

export const registerSchema = z.object({
  username: z.string().min(3, { message: "Nazwa użytkownika musi zawierać co najmniej 3 znaki" }),
  email: z.string().email({ message: "Podaj prawidłowy adres email" }),
  password: z.string().min(8, { message: "Hasło musi zawierać co najmniej 8 znaków" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Hasła muszą być identyczne",
  path: ["confirmPassword"]
});
export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({ id: true, createdAt: true, updatedAt: true, viewCount: true });
export const insertKnowledgeBaseSchema = createInsertSchema(knowledgeBase).omit({ id: true, createdAt: true, updatedAt: true, viewCount: true });
export const insertLeadSchema = createInsertSchema(leads).omit({ id: true, createdAt: true, convertedAt: true, convertedToCustomer: true });

// Types
export type InsertService = z.infer<typeof insertServiceSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProjectFile = z.infer<typeof insertProjectFileSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertProjectNote = z.infer<typeof insertProjectNoteSchema>;
export type InsertProjectMilestone = z.infer<typeof insertProjectMilestoneSchema>;
export type InsertWelcomeMessage = z.infer<typeof insertWelcomeMessageSchema>;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type InsertKnowledgeBase = z.infer<typeof insertKnowledgeBaseSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;

export type Service = typeof services.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type User = typeof users.$inferSelect;
export type ProjectFile = typeof projectFiles.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type ProjectNote = typeof projectNotes.$inferSelect;
export type ProjectMilestone = typeof projectMilestones.$inferSelect;
export type WelcomeMessage = typeof welcomeMessages.$inferSelect;
// BlogPost rozszerzony o pole authorName z join'a
export type BlogPost = typeof blogPosts.$inferSelect & {
  authorName?: string;
};

// KnowledgeBase rozszerzony o pole authorName z join'a
export type KnowledgeBase = typeof knowledgeBase.$inferSelect & {
  authorName?: string;
};
export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;

// Chatbot - wiadomości czatu
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id").notNull(), // Identyfikator sesji czatu
  userId: varchar("user_id").references(() => users.id), // Powiązanie z użytkownikiem (opcjonalne)
  role: varchar("role").notNull(), // 'user', 'assistant', 'system'
  content: text("content").notNull(), // Treść wiadomości
  timestamp: timestamp("timestamp").defaultNow(), // Czas wysłania
  metadata: jsonb("metadata"), // Dodatkowe dane (np. kontekst, typ, źródło wiedzy)
});

// Sesje czatu dla chatbota
export const chatSessions = pgTable("chat_sessions", {
  id: varchar("id").primaryKey(), // UUID sesji
  userId: varchar("user_id").references(() => users.id), // Powiązanie z użytkownikiem (opcjonalne) 
  name: text("name"), // Nazwa sesji (opcjonalna)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastActive: timestamp("last_active").defaultNow(), // Kiedy ostatnio była aktywna
  metadata: jsonb("metadata"), // Preferencje, kontekst itp.
  isActive: boolean("is_active").default(true), // Czy sesja jest aktywna
});

// Relacje dla chatbota
export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  session: one(chatSessions, {
    fields: [chatMessages.sessionId],
    references: [chatSessions.id],
  }),
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id],
  }),
}));

export const chatSessionsRelations = relations(chatSessions, ({ many, one }) => ({
  messages: many(chatMessages),
  user: one(users, {
    fields: [chatSessions.userId],
    references: [users.id],
  }),
}));

// Schematy Zod i typy dla chatbota
export const insertChatMessageSchema = createInsertSchema(chatMessages, {
  content: z.string().min(1),
  role: z.enum(['user', 'assistant', 'system']),
  metadata: z.record(z.any()).optional(),
}).omit({ id: true, timestamp: true });

export const insertChatSessionSchema = createInsertSchema(chatSessions, {
  name: z.string().optional(),
  metadata: z.record(z.any()).optional(),
}).omit({ createdAt: true, updatedAt: true, lastActive: true });

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;

// Notion integration tables
export const notionSyncStatus = pgTable("notion_sync_status", {
  id: serial("id").primaryKey(),
  resourceType: varchar("resource_type").notNull(), // "blog", "knowledge_base", "lead_magnet", etc.
  notionDatabaseId: varchar("notion_database_id").notNull(),
  lastSyncedAt: timestamp("last_synced_at").defaultNow(),
  status: varchar("status").default("active").notNull(), // "active", "paused", "error"
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notionItemMapping = pgTable("notion_item_mapping", {
  id: serial("id").primaryKey(),
  resourceType: varchar("resource_type").notNull(), // "blog", "knowledge_base", "lead_magnet", etc.
  localId: integer("local_id").notNull(), // ID of the local record (blog post, knowledge base article, etc.)
  notionPageId: varchar("notion_page_id").notNull(), // ID of the Notion page
  lastSyncedAt: timestamp("last_synced_at").defaultNow(),
  syncDirection: varchar("sync_direction").default("notion_to_local").notNull(), // "notion_to_local", "local_to_notion", "bidirectional"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schematy dla tabel Notion
export const insertNotionSyncStatusSchema = createInsertSchema(notionSyncStatus).omit({
  id: true, createdAt: true, updatedAt: true, lastSyncedAt: true
});

export const insertNotionItemMappingSchema = createInsertSchema(notionItemMapping).omit({
  id: true, createdAt: true, updatedAt: true, lastSyncedAt: true
});

// Typy dla tabel Notion
export type NotionSyncStatus = typeof notionSyncStatus.$inferSelect;
export type InsertNotionSyncStatus = z.infer<typeof insertNotionSyncStatusSchema>;
export type NotionItemMapping = typeof notionItemMapping.$inferSelect;
export type InsertNotionItemMapping = z.infer<typeof insertNotionItemMappingSchema>;

// Specjalny typ dla użytkownika z Replit Auth
export type UpsertUser = {
  id: number;
  username: string;
  email?: string | null;
  password?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  bio?: string | null;
  profileImage?: string | null;
  company?: string | null;
  role?: string | null;
  onboardingStep?: number | null;
  onboardingCompleted?: boolean | null;
  preferences?: any | null;
  industry?: string | null;
  projectType?: string | null;
  updatedAt?: Date | null;
};
