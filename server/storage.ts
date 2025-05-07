import { 
  users, orders, services, 
  projectFiles, messages, projectNotes, projectMilestones, welcomeMessages,
  type User, type InsertUser, 
  type Order, type InsertOrder, 
  type Service, type InsertService,
  type ProjectFile, type InsertProjectFile,
  type Message, type InsertMessage,
  type ProjectNote, type InsertProjectNote,
  type ProjectMilestone, type InsertProjectMilestone,
  type WelcomeMessage,
  type UpsertUser
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, or, like } from "drizzle-orm";
import { nanoid } from "nanoid";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
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
}

// Generator for unique order IDs
function generateOrderId(): string {
  const timestamp = new Date().getTime().toString(36);
  const random = nanoid(6);
  return `ECM-${timestamp}-${random}`.toUpperCase();
}

// DatabaseStorage implements IStorage using PostgreSQL
export class DatabaseStorage implements IStorage {
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
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        ...userData,
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
}

// Export a single instance of DatabaseStorage
export const storage = new DatabaseStorage();
