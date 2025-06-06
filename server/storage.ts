import { 
  users, orders, services, 
  projectFiles, messages, projectNotes, projectMilestones, welcomeMessages,
  blogPosts, knowledgeBase,
  type User, type InsertUser, 
  type Order, type InsertOrder, 
  type Service, type InsertService,
  type ProjectFile, type InsertProjectFile,
  type Message, type InsertMessage,
  type ProjectNote, type InsertProjectNote,
  type ProjectMilestone, type InsertProjectMilestone,
  type WelcomeMessage,
  type UpsertUser,
  type BlogPost, type InsertBlogPost,
  type KnowledgeBase, type InsertKnowledgeBase,
  type LoginData
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, or, like } from "drizzle-orm";
import { nanoid } from "nanoid";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

// Asynchroniczne funkcje pomocnicze do hashy haseł
const scryptAsync = promisify(scrypt);

// Funkcja haszująca hasło
async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

// Funkcja porównująca hasła
async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  if (!stored || !supplied) {
    console.log("Brak hasła do porównania:", { supplied: !!supplied, stored: !!stored });
    return false;
  }
  
  try {
    console.log("Przechowywane hasło:", stored);
    console.log("Format hasła (długość):", stored.length);
    
    const [hashed, salt] = stored.split('.');
    
    console.log("Części hasła po rozdzieleniu:", { 
      hashedLength: hashed?.length, 
      saltLength: salt?.length 
    });
    
    if (!salt) {
      console.log("Nieprawidłowy format hasła - brak soli");
      return false;
    }
    
    // Tworzymy nowe zahasłowane hasło z dostarczonego hasła i zapisanej soli
    console.log("Używam soli do obliczenia haszu:", salt);
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    const hashedSupplied = suppliedBuf.toString('hex');
    
    console.log("Oryginalny hasz:", hashed.substring(0, 20) + "...");
    console.log("Wygenerowany hasz:", hashedSupplied.substring(0, 20) + "...");
    
    // Zamiast porównywania buforów (co może powodować błędy gdy mają różne długości),
    // porównajmy bezpośrednio stringi hexadecymalne
    const match = hashed === hashedSupplied;
    
    console.log("Czy hasła się zgadzają:", match);
    return match;
  } catch (error) {
    console.error("Błąd podczas porównywania haseł:", error);
    return false;
  }
}

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createLocalUser(username: string, email: string, password: string): Promise<User>;
  validatePassword(username: string, password: string): Promise<User | null>;
  upsertUser(userData: UpsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<UpsertUser>): Promise<User | undefined>;
  getAllUsers(role?: string): Promise<User[]>;
  
  // Order operations
  getOrder(id: number): Promise<Order | undefined>;
  getOrderByOrderId(orderId: string): Promise<Order | undefined>;
  getOrdersByUserId(userId: number): Promise<Order[]>;
  getOrdersByStatus(status: string): Promise<Order[]>;
  getOrdersByAssignedToId(assignedToId: number): Promise<Order[]>;
  getRecentOrders(limit?: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, orderData: Partial<InsertOrder>): Promise<Order | undefined>;
  searchOrders(query: string): Promise<Order[]>;
  
  // Project files operations
  getProjectFile(id: number): Promise<ProjectFile | undefined>;
  getProjectFilesByOrderId(orderId: number): Promise<ProjectFile[]>;
  createProjectFile(file: InsertProjectFile): Promise<ProjectFile>;
  deleteProjectFile(id: number): Promise<boolean>;
  
  // Message operations
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesByOrderId(orderId: number): Promise<Message[]>;
  getMessagesBySenderId(senderId: number): Promise<Message[]>;
  getMessagesByReceiverId(receiverId: number): Promise<Message[]>;
  getUnreadMessagesByReceiverId(receiverId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<Message | undefined>;
  
  // Project note operations
  getProjectNote(id: number): Promise<ProjectNote | undefined>;
  getProjectNotesByOrderId(orderId: number): Promise<ProjectNote[]>;
  createProjectNote(note: InsertProjectNote): Promise<ProjectNote>;
  updateProjectNote(id: number, noteData: Partial<InsertProjectNote>): Promise<ProjectNote | undefined>;
  deleteProjectNote(id: number): Promise<boolean>;
  
  // Project milestone operations
  getProjectMilestone(id: number): Promise<ProjectMilestone | undefined>;
  getProjectMilestonesByOrderId(orderId: number): Promise<ProjectMilestone[]>;
  createProjectMilestone(milestone: InsertProjectMilestone): Promise<ProjectMilestone>;
  updateProjectMilestone(id: number, milestoneData: Partial<InsertProjectMilestone>): Promise<ProjectMilestone | undefined>;
  completeProjectMilestone(id: number): Promise<ProjectMilestone | undefined>;
  
  // Service operations
  getService(id: number): Promise<Service | undefined>;
  getServiceByServiceId(serviceId: string): Promise<Service | undefined>;
  getAllServices(): Promise<Service[]>;
  getServicesByCategory(category: string): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, serviceData: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;
  searchServices(query: string): Promise<Service[]>;
  
  // Onboarding operations
  getUserOnboardingStep(userId: number): Promise<number>;
  updateUserOnboardingStep(userId: number, step: number): Promise<User | undefined>;
  completeUserOnboarding(userId: number, preferences: any): Promise<User | undefined>;
  getWelcomeMessagesByUserId(userId: number): Promise<WelcomeMessage[]>;
  getWelcomeMessageByStep(userId: number, step: number): Promise<WelcomeMessage | undefined>;
  createWelcomeMessage(userId: number, step: number, title: string, content: string, actionLabel?: string, actionType?: string): Promise<WelcomeMessage>;
  updateWelcomeMessage(id: number, data: Partial<WelcomeMessage>): Promise<WelcomeMessage | undefined>;
  markWelcomeMessageAsCompleted(id: number): Promise<WelcomeMessage | undefined>;
  
  // Blog operations
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getAllBlogPosts(status?: string): Promise<BlogPost[]>;
  getRecentBlogPosts(limit?: number, status?: string): Promise<BlogPost[]>;
  getBlogPostsByCategory(category: string, status?: string): Promise<BlogPost[]>;
  getBlogPostsByTag(tag: string, status?: string): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, postData: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  incrementBlogPostViewCount(id: number): Promise<void>;
  searchBlogPosts(query: string, status?: string): Promise<BlogPost[]>;
  
  // Knowledge base operations
  getKnowledgeBaseArticle(id: number): Promise<KnowledgeBase | undefined>;
  getKnowledgeBaseArticleBySlug(slug: string): Promise<KnowledgeBase | undefined>;
  getAllKnowledgeBaseArticles(status?: string): Promise<KnowledgeBase[]>;
  getKnowledgeBaseArticlesByCategory(category: string, status?: string): Promise<KnowledgeBase[]>;
  getKnowledgeBaseArticlesByTag(tag: string, status?: string): Promise<KnowledgeBase[]>;
  createKnowledgeBaseArticle(article: InsertKnowledgeBase): Promise<KnowledgeBase>;
  updateKnowledgeBaseArticle(id: number, articleData: Partial<InsertKnowledgeBase>): Promise<KnowledgeBase | undefined>;
  deleteKnowledgeBaseArticle(id: number): Promise<boolean>;
  incrementKnowledgeBaseArticleViewCount(id: number): Promise<void>;
  searchKnowledgeBaseArticles(query: string, status?: string): Promise<KnowledgeBase[]>;
}

// Generator for unique order IDs
function generateOrderId(): string {
  const timestamp = new Date().getTime().toString(36);
  const random = nanoid(6);
  return `ECM-${timestamp}-${random}`.toUpperCase();
}

// DatabaseStorage implements IStorage using PostgreSQL
export class DatabaseStorage implements IStorage {
  // Importy są już na górze pliku
  // Z { blogPosts, knowledgeBase, ... } from "@shared/schema";
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Sprawdź czy zawiera id - teraz wymagane po migracji do Replit Auth
    if (!insertUser.id) {
      throw new Error('User ID is required for creating a user');
    }
    
    try {
      const [user] = await db
        .insert(users)
        .values(insertUser)
        .returning();
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // Upewnij się, że userData zawiera id, które jest wymagane przy insert
    if (!userData.id) {
      throw new Error('User ID is required for upsert operation');
    }
    
    const [user] = await db
      .insert(users)
      .values([{
        ...userData,
        updatedAt: new Date()
      }])
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<UpsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        ...userData,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllUsers(role?: string): Promise<User[]> {
    if (role) {
      return await db.select().from(users).where(eq(users.role, role));
    }
    return await db.select().from(users);
  }
  
  async createLocalUser(username: string, email: string, password: string): Promise<User> {
    // Sprawdź czy użytkownik o takiej nazwie użytkownika lub emailu już istnieje
    const existingUser = await this.getUserByUsername(username) || await this.getUserByEmail(email);
    if (existingUser) {
      throw new Error('Użytkownik o takiej nazwie lub adresie email już istnieje');
    }
    
    // Zahaszuj hasło
    const hashedPassword = await hashPassword(password);
    
    // Nie musimy generować ID, ponieważ jest to serial/autoincrement w bazie danych
    
    const [user] = await db
      .insert(users)
      .values({
        username,
        email,
        password: hashedPassword,
        authMethod: 'local',
        role: 'client',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    
    return user;
  }
  
  async validatePassword(username: string, password: string): Promise<User | null> {
    console.log(`Weryfikacja hasła dla użytkownika: ${username}`);
    
    // Pobierz użytkownika po nazwie użytkownika
    const user = await this.getUserByUsername(username);
    
    // Sprawdź czy użytkownik istnieje i ma hasło
    if (!user) {
      console.log("Użytkownik nie znaleziony");
      return null;
    }
    
    if (!user.password) {
      console.log("Użytkownik nie ma hasła");
      return null;
    }
    
    console.log("Porównywanie hasła...");
    const isValid = await comparePasswords(password, user.password);
    
    if (isValid) {
      console.log("Hasło poprawne, logowanie udane");
      return user;
    } else {
      console.log("Hasło niepoprawne, logowanie nieudane");
      return null;
    }
  }
  
  // Order operations
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async getOrderByOrderId(orderId: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.orderId, orderId));
    return order || undefined;
  }
  
  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.status, status))
      .orderBy(desc(orders.createdAt));
  }

  async getOrdersByAssignedToId(assignedToId: number): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.assignedToId, assignedToId))
      .orderBy(desc(orders.createdAt));
  }

  async getRecentOrders(limit: number = 10): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(limit);
  }
  
  async createOrder(order: InsertOrder): Promise<Order> {
    // Generate a unique order ID if not provided
    const orderWithId = {
      ...order,
      orderId: order.orderId || generateOrderId(),
      updatedAt: new Date(),
    };

    const [createdOrder] = await db
      .insert(orders)
      .values(orderWithId)
      .returning();
    return createdOrder;
  }

  async updateOrder(id: number, orderData: Partial<InsertOrder>): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({
        ...orderData,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  async searchOrders(query: string): Promise<Order[]> {
    // Wyszukiwanie wg orderId lub serviceId
    return await db
      .select()
      .from(orders)
      .where(
        or(
          like(orders.orderId, `%${query}%`),
          like(orders.serviceId, `%${query}%`)
        )
      )
      .orderBy(desc(orders.createdAt));
  }

  // Project files operations
  async getProjectFile(id: number): Promise<ProjectFile | undefined> {
    const [file] = await db.select().from(projectFiles).where(eq(projectFiles.id, id));
    return file || undefined;
  }

  async getProjectFilesByOrderId(orderId: number): Promise<ProjectFile[]> {
    return await db
      .select()
      .from(projectFiles)
      .where(eq(projectFiles.orderId, orderId))
      .orderBy(desc(projectFiles.createdAt));
  }

  async createProjectFile(file: InsertProjectFile): Promise<ProjectFile> {
    const [createdFile] = await db
      .insert(projectFiles)
      .values(file)
      .returning();
    return createdFile;
  }

  async deleteProjectFile(id: number): Promise<boolean> {
    const [deletedFile] = await db
      .delete(projectFiles)
      .where(eq(projectFiles.id, id))
      .returning();
    return !!deletedFile;
  }

  // Message operations
  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message || undefined;
  }

  async getMessagesByOrderId(orderId: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.orderId, orderId))
      .orderBy(desc(messages.createdAt));
  }

  async getMessagesBySenderId(senderId: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.senderId, senderId))
      .orderBy(desc(messages.createdAt));
  }

  async getMessagesByReceiverId(receiverId: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.receiverId, receiverId))
      .orderBy(desc(messages.createdAt));
  }

  async getUnreadMessagesByReceiverId(receiverId: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(
        and(
          eq(messages.receiverId, receiverId),
          eq(messages.isRead, false)
        )
      )
      .orderBy(desc(messages.createdAt));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [createdMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return createdMessage;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const [message] = await db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, id))
      .returning();
    return message;
  }

  // Project note operations
  async getProjectNote(id: number): Promise<ProjectNote | undefined> {
    const [note] = await db.select().from(projectNotes).where(eq(projectNotes.id, id));
    return note || undefined;
  }

  async getProjectNotesByOrderId(orderId: number): Promise<ProjectNote[]> {
    return await db
      .select()
      .from(projectNotes)
      .where(eq(projectNotes.orderId, orderId))
      .orderBy(desc(projectNotes.createdAt));
  }

  async createProjectNote(note: InsertProjectNote): Promise<ProjectNote> {
    const [createdNote] = await db
      .insert(projectNotes)
      .values({
        ...note,
        updatedAt: new Date(),
      })
      .returning();
    return createdNote;
  }

  async updateProjectNote(id: number, noteData: Partial<InsertProjectNote>): Promise<ProjectNote | undefined> {
    const [note] = await db
      .update(projectNotes)
      .set({
        ...noteData,
        updatedAt: new Date(),
      })
      .where(eq(projectNotes.id, id))
      .returning();
    return note;
  }

  async deleteProjectNote(id: number): Promise<boolean> {
    const [deletedNote] = await db
      .delete(projectNotes)
      .where(eq(projectNotes.id, id))
      .returning();
    return !!deletedNote;
  }

  // Project milestone operations
  async getProjectMilestone(id: number): Promise<ProjectMilestone | undefined> {
    const [milestone] = await db.select().from(projectMilestones).where(eq(projectMilestones.id, id));
    return milestone || undefined;
  }

  async getProjectMilestonesByOrderId(orderId: number): Promise<ProjectMilestone[]> {
    return await db
      .select()
      .from(projectMilestones)
      .where(eq(projectMilestones.orderId, orderId))
      .orderBy(desc(projectMilestones.createdAt));
  }

  async createProjectMilestone(milestone: InsertProjectMilestone): Promise<ProjectMilestone> {
    const [createdMilestone] = await db
      .insert(projectMilestones)
      .values(milestone)
      .returning();
    return createdMilestone;
  }

  async updateProjectMilestone(id: number, milestoneData: Partial<InsertProjectMilestone>): Promise<ProjectMilestone | undefined> {
    const [milestone] = await db
      .update(projectMilestones)
      .set(milestoneData)
      .where(eq(projectMilestones.id, id))
      .returning();
    return milestone;
  }

  async completeProjectMilestone(id: number): Promise<ProjectMilestone | undefined> {
    const [milestone] = await db
      .update(projectMilestones)
      .set({
        status: "Zakończone",
        completedAt: new Date(),
      })
      .where(eq(projectMilestones.id, id))
      .returning();
    return milestone;
  }
  
  // Service operations
  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || undefined;
  }
  
  async getServiceByServiceId(serviceId: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.serviceId, serviceId));
    return service || undefined;
  }
  
  async getAllServices(): Promise<Service[]> {
    return await db.select().from(services);
  }

  async getServicesByCategory(category: string): Promise<Service[]> {
    return await db
      .select()
      .from(services)
      .where(eq(services.category, category));
  }
  
  async createService(service: InsertService): Promise<Service> {
    const [createdService] = await db
      .insert(services)
      .values(service)
      .returning();
    return createdService;
  }

  async updateService(id: number, serviceData: Partial<InsertService>): Promise<Service | undefined> {
    const [service] = await db
      .update(services)
      .set(serviceData)
      .where(eq(services.id, id))
      .returning();
    return service;
  }

  async deleteService(id: number): Promise<boolean> {
    const [deletedService] = await db
      .delete(services)
      .where(eq(services.id, id))
      .returning();
    return !!deletedService;
  }

  async searchServices(query: string): Promise<Service[]> {
    return await db
      .select()
      .from(services)
      .where(
        or(
          like(services.name, `%${query}%`),
          like(services.description, `%${query}%`),
          like(services.category, `%${query}%`)
        )
      );
  }

  // Onboarding operations
  async getUserOnboardingStep(userId: number): Promise<number> {
    const user = await this.getUser(userId);
    return user?.onboardingStep || 0;
  }

  async updateUserOnboardingStep(userId: number, step: number): Promise<User | undefined> {
    return await this.updateUser(userId, {
      onboardingStep: step
    });
  }

  async completeUserOnboarding(userId: number, preferences: any): Promise<User | undefined> {
    return await this.updateUser(userId, {
      onboardingStep: 999, // Oznacza zakończony onboarding
      onboardingCompleted: true,
      preferences: preferences
    });
  }

  async getWelcomeMessagesByUserId(userId: number): Promise<WelcomeMessage[]> {
    return await db
      .select()
      .from(welcomeMessages)
      .where(eq(welcomeMessages.userId, userId))
      .orderBy(welcomeMessages.step);
  }

  async getWelcomeMessageByStep(userId: number, step: number): Promise<WelcomeMessage | undefined> {
    const [message] = await db
      .select()
      .from(welcomeMessages)
      .where(
        and(
          eq(welcomeMessages.userId, userId),
          eq(welcomeMessages.step, step)
        )
      );
    return message;
  }

  async createWelcomeMessage(
    userId: number, 
    step: number, 
    title: string, 
    content: string, 
    actionLabel?: string, 
    actionType?: string
  ): Promise<WelcomeMessage> {
    const [message] = await db
      .insert(welcomeMessages)
      .values({
        userId,
        step,
        title,
        content,
        actionLabel,
        actionType,
      })
      .returning();
    return message;
  }

  async updateWelcomeMessage(id: number, data: Partial<WelcomeMessage>): Promise<WelcomeMessage | undefined> {
    const [message] = await db
      .update(welcomeMessages)
      .set(data)
      .where(eq(welcomeMessages.id, id))
      .returning();
    return message;
  }

  async markWelcomeMessageAsCompleted(id: number): Promise<WelcomeMessage | undefined> {
    const [message] = await db
      .update(welcomeMessages)
      .set({
        isCompleted: true,
        completedAt: new Date(),
      })
      .where(eq(welcomeMessages.id, id))
      .returning();
    return message;
  }
  
  // Blog operations
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const posts = await db.select({
      id: blogPosts.id,
      slug: blogPosts.slug,
      title: blogPosts.title,
      excerpt: blogPosts.excerpt,
      content: blogPosts.content,
      authorId: blogPosts.authorId,
      thumbnailUrl: blogPosts.thumbnailUrl,
      tags: blogPosts.tags,
      category: blogPosts.category,
      status: blogPosts.status,
      viewCount: blogPosts.viewCount,
      publishedAt: blogPosts.publishedAt,
      createdAt: blogPosts.createdAt,
      updatedAt: blogPosts.updatedAt,
      authorName: sql`CONCAT(${users.firstName}, ' ', ${users.lastName})`.as('authorName')
    })
    .from(blogPosts)
    .leftJoin(users, eq(blogPosts.authorId, users.id))
    .where(eq(blogPosts.slug, slug));
    
    if (posts.length === 0) return undefined;
    
    // Konwertuj wynik na oczekiwany format BlogPost
    const post = posts[0] as unknown as BlogPost;
    return post;
  }

  async getAllBlogPosts(status: string = 'published'): Promise<BlogPost[]> {
    const posts = await db
      .select({
        id: blogPosts.id,
        slug: blogPosts.slug,
        title: blogPosts.title,
        excerpt: blogPosts.excerpt,
        content: blogPosts.content,
        authorId: blogPosts.authorId,
        thumbnailUrl: blogPosts.thumbnailUrl,
        tags: blogPosts.tags,
        category: blogPosts.category,
        status: blogPosts.status,
        viewCount: blogPosts.viewCount,
        publishedAt: blogPosts.publishedAt,
        createdAt: blogPosts.createdAt,
        updatedAt: blogPosts.updatedAt,
        authorName: sql`CONCAT(${users.firstName}, ' ', ${users.lastName})`.as('authorName')
      })
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .where(status ? eq(blogPosts.status, status) : undefined)
      .orderBy(desc(blogPosts.publishedAt));
    
    // Konwertuj wyniki na oczekiwany format
    return posts as unknown as BlogPost[];
  }

  async getRecentBlogPosts(limit: number = 5, status: string = 'published'): Promise<BlogPost[]> {
    const posts = await db
      .select({
        id: blogPosts.id,
        slug: blogPosts.slug,
        title: blogPosts.title,
        excerpt: blogPosts.excerpt,
        content: blogPosts.content,
        authorId: blogPosts.authorId,
        thumbnailUrl: blogPosts.thumbnailUrl,
        tags: blogPosts.tags,
        category: blogPosts.category,
        status: blogPosts.status,
        viewCount: blogPosts.viewCount,
        publishedAt: blogPosts.publishedAt,
        createdAt: blogPosts.createdAt,
        updatedAt: blogPosts.updatedAt,
        authorName: sql`CONCAT(${users.firstName}, ' ', ${users.lastName})`.as('authorName')
      })
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .where(status ? eq(blogPosts.status, status) : undefined)
      .orderBy(desc(blogPosts.publishedAt))
      .limit(limit);
      
    return posts as unknown as BlogPost[];
  }

  async getBlogPostsByCategory(category: string, status: string = 'published'): Promise<BlogPost[]> {
    const posts = await db
      .select({
        id: blogPosts.id,
        slug: blogPosts.slug,
        title: blogPosts.title,
        excerpt: blogPosts.excerpt,
        content: blogPosts.content,
        authorId: blogPosts.authorId,
        thumbnailUrl: blogPosts.thumbnailUrl,
        tags: blogPosts.tags,
        category: blogPosts.category,
        status: blogPosts.status,
        viewCount: blogPosts.viewCount,
        publishedAt: blogPosts.publishedAt,
        createdAt: blogPosts.createdAt,
        updatedAt: blogPosts.updatedAt,
        authorName: sql`CONCAT(${users.firstName}, ' ', ${users.lastName})`.as('authorName')
      })
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .where(
        and(
          eq(blogPosts.category, category),
          status ? eq(blogPosts.status, status) : undefined
        )
      )
      .orderBy(desc(blogPosts.publishedAt));
      
    return posts as unknown as BlogPost[];
  }

  async getBlogPostsByTag(tag: string, status: string = 'published'): Promise<BlogPost[]> {
    // Wyszukiwanie po tagach (pole tags jest tablicą)
    const posts = await db
      .select({
        id: blogPosts.id,
        slug: blogPosts.slug,
        title: blogPosts.title,
        excerpt: blogPosts.excerpt,
        content: blogPosts.content,
        authorId: blogPosts.authorId,
        thumbnailUrl: blogPosts.thumbnailUrl,
        tags: blogPosts.tags,
        category: blogPosts.category,
        status: blogPosts.status,
        viewCount: blogPosts.viewCount,
        publishedAt: blogPosts.publishedAt,
        createdAt: blogPosts.createdAt,
        updatedAt: blogPosts.updatedAt,
        authorName: sql`CONCAT(${users.firstName}, ' ', ${users.lastName})`.as('authorName')
      })
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .where(
        and(
          sql`${tag} = ANY(${blogPosts.tags})`,
          status ? eq(blogPosts.status, status) : undefined
        )
      )
      .orderBy(desc(blogPosts.publishedAt));
      
    return posts as unknown as BlogPost[];
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [createdPost] = await db
      .insert(blogPosts)
      .values({
        ...post,
        publishedAt: post.status === 'published' ? new Date() : undefined,
        updatedAt: new Date(),
      })
      .returning();
    return createdPost;
  }

  async updateBlogPost(id: number, postData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    // Jeśli status zmienia się na "published", ustaw publishedAt
    const updatedData = { ...postData };
    if (postData.status === 'published') {
      // Sprawdź aktualny status
      const [currentPost] = await db.select({ status: blogPosts.status }).from(blogPosts).where(eq(blogPosts.id, id));
      if (currentPost && currentPost.status !== 'published') {
        updatedData.publishedAt = new Date();
      }
    }

    const [post] = await db
      .update(blogPosts)
      .set({
        ...updatedData,
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, id))
      .returning();
    return post;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const [deletedPost] = await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, id))
      .returning();
    return !!deletedPost;
  }

  async incrementBlogPostViewCount(id: number): Promise<void> {
    await db.execute(sql`
      UPDATE blog_posts 
      SET view_count = view_count + 1 
      WHERE id = ${id}
    `);
  }

  async searchBlogPosts(query: string, status: string = 'published'): Promise<BlogPost[]> {
    const posts = await db
      .select({
        id: blogPosts.id,
        slug: blogPosts.slug,
        title: blogPosts.title,
        excerpt: blogPosts.excerpt,
        content: blogPosts.content,
        category: blogPosts.category,
        authorId: blogPosts.authorId,
        thumbnailUrl: blogPosts.thumbnailUrl,
        tags: blogPosts.tags,
        status: blogPosts.status,
        viewCount: blogPosts.viewCount,
        publishedAt: blogPosts.publishedAt,
        createdAt: blogPosts.createdAt,
        updatedAt: blogPosts.updatedAt,
        authorName: sql`CONCAT(${users.firstName}, ' ', ${users.lastName})`.as('authorName')
      })
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .where(
        and(
          or(
            like(blogPosts.title, `%${query}%`),
            like(blogPosts.excerpt, `%${query}%`),
            like(blogPosts.content, `%${query}%`)
          ),
          status ? eq(blogPosts.status, status) : undefined
        )
      )
      .orderBy(desc(blogPosts.publishedAt));
      
    return posts as unknown as BlogPost[];
  }
  
  // Knowledge base operations
  async getKnowledgeBaseArticle(id: number): Promise<KnowledgeBase | undefined> {
    const articles = await db
      .select({
        id: knowledgeBase.id,
        slug: knowledgeBase.slug,
        title: knowledgeBase.title,
        excerpt: knowledgeBase.excerpt,
        content: knowledgeBase.content,
        category: knowledgeBase.category,
        authorId: knowledgeBase.authorId,
        thumbnailUrl: knowledgeBase.thumbnailUrl,
        tags: knowledgeBase.tags,
        status: knowledgeBase.status,
        viewCount: knowledgeBase.viewCount,
        publishedAt: knowledgeBase.publishedAt,
        createdAt: knowledgeBase.createdAt,
        updatedAt: knowledgeBase.updatedAt,
        authorName: sql`CONCAT(${users.firstName}, ' ', ${users.lastName})`.as('authorName')
      })
      .from(knowledgeBase)
      .leftJoin(users, eq(knowledgeBase.authorId, users.id))
      .where(eq(knowledgeBase.id, id));
    
    if (!articles.length) return undefined;
    
    return articles[0] as unknown as KnowledgeBase;
  }

  async getKnowledgeBaseArticleBySlug(slug: string): Promise<KnowledgeBase | undefined> {
    const articles = await db
      .select({
        id: knowledgeBase.id,
        slug: knowledgeBase.slug,
        title: knowledgeBase.title,
        excerpt: knowledgeBase.excerpt,
        content: knowledgeBase.content,
        category: knowledgeBase.category,
        authorId: knowledgeBase.authorId,
        thumbnailUrl: knowledgeBase.thumbnailUrl,
        tags: knowledgeBase.tags,
        status: knowledgeBase.status,
        viewCount: knowledgeBase.viewCount,
        publishedAt: knowledgeBase.publishedAt,
        createdAt: knowledgeBase.createdAt,
        updatedAt: knowledgeBase.updatedAt,
        authorName: sql`CONCAT(${users.firstName}, ' ', ${users.lastName})`.as('authorName')
      })
      .from(knowledgeBase)
      .leftJoin(users, eq(knowledgeBase.authorId, users.id))
      .where(eq(knowledgeBase.slug, slug));
      
    if (articles.length === 0) return undefined;
    
    // Konwertuj wynik na oczekiwany format
    const article = articles[0] as unknown as KnowledgeBase;
    return article;
  }

  async getAllKnowledgeBaseArticles(status: string = 'published'): Promise<KnowledgeBase[]> {
    const articles = await db
      .select({
        id: knowledgeBase.id,
        slug: knowledgeBase.slug,
        title: knowledgeBase.title,
        excerpt: knowledgeBase.excerpt,
        content: knowledgeBase.content,
        category: knowledgeBase.category,
        authorId: knowledgeBase.authorId,
        thumbnailUrl: knowledgeBase.thumbnailUrl,
        tags: knowledgeBase.tags,
        status: knowledgeBase.status,
        viewCount: knowledgeBase.viewCount,
        publishedAt: knowledgeBase.publishedAt,
        createdAt: knowledgeBase.createdAt,
        updatedAt: knowledgeBase.updatedAt,
        authorName: sql`CONCAT(${users.firstName}, ' ', ${users.lastName})`.as('authorName')
      })
      .from(knowledgeBase)
      .leftJoin(users, eq(knowledgeBase.authorId, users.id))
      .where(status ? eq(knowledgeBase.status, status) : undefined)
      .orderBy(desc(knowledgeBase.updatedAt));
      
    return articles as unknown as KnowledgeBase[];
  }

  async getKnowledgeBaseArticlesByCategory(category: string, status: string = 'published'): Promise<KnowledgeBase[]> {
    const articles = await db
      .select({
        id: knowledgeBase.id,
        slug: knowledgeBase.slug,
        title: knowledgeBase.title,
        excerpt: knowledgeBase.excerpt,
        content: knowledgeBase.content,
        category: knowledgeBase.category,
        authorId: knowledgeBase.authorId,
        thumbnailUrl: knowledgeBase.thumbnailUrl,
        tags: knowledgeBase.tags,
        status: knowledgeBase.status,
        viewCount: knowledgeBase.viewCount,
        publishedAt: knowledgeBase.publishedAt,
        createdAt: knowledgeBase.createdAt,
        updatedAt: knowledgeBase.updatedAt,
        authorName: sql`CONCAT(${users.firstName}, ' ', ${users.lastName})`.as('authorName')
      })
      .from(knowledgeBase)
      .leftJoin(users, eq(knowledgeBase.authorId, users.id))
      .where(
        and(
          eq(knowledgeBase.category, category),
          status ? eq(knowledgeBase.status, status) : undefined
        )
      )
      .orderBy(desc(knowledgeBase.updatedAt));
      
    return articles as unknown as KnowledgeBase[];
  }

  async getKnowledgeBaseArticlesByTag(tag: string, status: string = 'published'): Promise<KnowledgeBase[]> {
    // Wyszukiwanie po tagach (pole tags jest tablicą)
    const articles = await db
      .select({
        id: knowledgeBase.id,
        slug: knowledgeBase.slug,
        title: knowledgeBase.title,
        excerpt: knowledgeBase.excerpt,
        content: knowledgeBase.content,
        category: knowledgeBase.category,
        authorId: knowledgeBase.authorId,
        thumbnailUrl: knowledgeBase.thumbnailUrl,
        tags: knowledgeBase.tags,
        status: knowledgeBase.status,
        viewCount: knowledgeBase.viewCount,
        publishedAt: knowledgeBase.publishedAt,
        createdAt: knowledgeBase.createdAt,
        updatedAt: knowledgeBase.updatedAt,
        authorName: sql`CONCAT(${users.firstName}, ' ', ${users.lastName})`.as('authorName')
      })
      .from(knowledgeBase)
      .leftJoin(users, eq(knowledgeBase.authorId, users.id))
      .where(
        and(
          sql`${tag} = ANY(${knowledgeBase.tags})`,
          status ? eq(knowledgeBase.status, status) : undefined
        )
      )
      .orderBy(desc(knowledgeBase.updatedAt));
      
    return articles as unknown as KnowledgeBase[];
  }

  async createKnowledgeBaseArticle(article: InsertKnowledgeBase): Promise<KnowledgeBase> {
    const [createdArticle] = await db
      .insert(knowledgeBase)
      .values({
        ...article,
        publishedAt: article.status === 'published' ? new Date() : undefined,
        updatedAt: new Date(),
      })
      .returning();
    return createdArticle;
  }

  async updateKnowledgeBaseArticle(id: number, articleData: Partial<InsertKnowledgeBase>): Promise<KnowledgeBase | undefined> {
    // Jeśli status zmienia się na "published", ustaw publishedAt
    const updatedData = { ...articleData };
    if (articleData.status === 'published') {
      // Sprawdź aktualny status
      const [currentArticle] = await db.select({ status: knowledgeBase.status }).from(knowledgeBase).where(eq(knowledgeBase.id, id));
      if (currentArticle && currentArticle.status !== 'published') {
        updatedData.publishedAt = new Date();
      }
    }

    const [article] = await db
      .update(knowledgeBase)
      .set({
        ...updatedData,
        updatedAt: new Date(),
      })
      .where(eq(knowledgeBase.id, id))
      .returning();
    return article;
  }

  async deleteKnowledgeBaseArticle(id: number): Promise<boolean> {
    const [deletedArticle] = await db
      .delete(knowledgeBase)
      .where(eq(knowledgeBase.id, id))
      .returning();
    return !!deletedArticle;
  }

  async incrementKnowledgeBaseArticleViewCount(id: number): Promise<void> {
    await db.execute(sql`
      UPDATE knowledge_base 
      SET view_count = view_count + 1 
      WHERE id = ${id}
    `);
  }

  async searchKnowledgeBaseArticles(query: string, status: string = 'published'): Promise<KnowledgeBase[]> {
    const articles = await db
      .select({
        id: knowledgeBase.id,
        slug: knowledgeBase.slug,
        title: knowledgeBase.title,
        excerpt: knowledgeBase.excerpt,
        content: knowledgeBase.content,
        category: knowledgeBase.category,
        authorId: knowledgeBase.authorId,
        thumbnailUrl: knowledgeBase.thumbnailUrl,
        tags: knowledgeBase.tags,
        status: knowledgeBase.status,
        viewCount: knowledgeBase.viewCount,
        publishedAt: knowledgeBase.publishedAt,
        createdAt: knowledgeBase.createdAt,
        updatedAt: knowledgeBase.updatedAt,
        authorName: sql`CONCAT(${users.firstName}, ' ', ${users.lastName})`.as('authorName')
      })
      .from(knowledgeBase)
      .leftJoin(users, eq(knowledgeBase.authorId, users.id))
      .where(
        and(
          or(
            like(knowledgeBase.title, `%${query}%`),
            like(knowledgeBase.excerpt, `%${query}%`),
            like(knowledgeBase.content, `%${query}%`)
          ),
          status ? eq(knowledgeBase.status, status) : undefined
        )
      )
      .orderBy(desc(knowledgeBase.updatedAt));
      
    return articles as unknown as KnowledgeBase[];
  }
}

// Export a single instance of DatabaseStorage
export const storage = new DatabaseStorage();
