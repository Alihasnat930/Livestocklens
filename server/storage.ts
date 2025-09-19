import { 
  users, cattle, healthRecords, vaccinations, feedingRecords, 
  feedInventory, diseaseDetections, salesTransactions, alerts,
  type User, type InsertUser, type Cattle, type InsertCattle,
  type HealthRecord, type InsertHealthRecord, type Vaccination, type InsertVaccination,
  type FeedingRecord, type InsertFeedingRecord, type FeedInventory, type InsertFeedInventory,
  type DiseaseDetection, type InsertDiseaseDetection, type SalesTransaction, type InsertSalesTransaction,
  type Alert, type InsertAlert
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

// Enhanced interface for livestock management system
export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Cattle management
  getCattle(id: string): Promise<Cattle | undefined>;
  getCattleByOwner(ownerId: string): Promise<Cattle[]>;
  createCattle(cattle: InsertCattle): Promise<Cattle>;
  updateCattle(id: string, cattle: Partial<InsertCattle>): Promise<Cattle>;
  getAllCattle(): Promise<Cattle[]>;
  
  // Health records
  getHealthRecords(cattleId: string): Promise<HealthRecord[]>;
  createHealthRecord(record: InsertHealthRecord): Promise<HealthRecord>;
  
  // Vaccinations
  getVaccinations(cattleId: string): Promise<Vaccination[]>;
  createVaccination(vaccination: InsertVaccination): Promise<Vaccination>;
  getUpcomingVaccinations(): Promise<Vaccination[]>;
  
  // Feeding records
  getFeedingRecords(cattleId: string): Promise<FeedingRecord[]>;
  createFeedingRecord(record: InsertFeedingRecord): Promise<FeedingRecord>;
  
  // Feed inventory
  getFeedInventory(): Promise<FeedInventory[]>;
  createFeedInventory(item: InsertFeedInventory): Promise<FeedInventory>;
  updateFeedInventory(id: string, item: Partial<InsertFeedInventory>): Promise<FeedInventory>;
  
  // Disease detection
  getDiseaseDetections(cattleId: string): Promise<DiseaseDetection[]>;
  createDiseaseDetection(detection: InsertDiseaseDetection): Promise<DiseaseDetection>;
  
  // Sales transactions
  getSalesTransactions(): Promise<SalesTransaction[]>;
  createSalesTransaction(transaction: InsertSalesTransaction): Promise<SalesTransaction>;
  
  // Alerts
  getAlerts(userId: string): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  markAlertAsRead(id: string): Promise<void>;
  
  // Analytics
  getHealthStats(): Promise<{
    total: number;
    healthy: number;
    sick: number;
    critical: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
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

  // Cattle management
  async getCattle(id: string): Promise<Cattle | undefined> {
    const [animal] = await db.select().from(cattle).where(eq(cattle.id, id));
    return animal || undefined;
  }

  async getCattleByOwner(ownerId: string): Promise<Cattle[]> {
    return await db.select().from(cattle).where(eq(cattle.ownerId, ownerId));
  }

  async createCattle(insertCattle: InsertCattle): Promise<Cattle> {
    const [animal] = await db
      .insert(cattle)
      .values(insertCattle)
      .returning();
    return animal;
  }

  async updateCattle(id: string, updateData: Partial<InsertCattle>): Promise<Cattle> {
    const [animal] = await db
      .update(cattle)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(cattle.id, id))
      .returning();
    return animal;
  }

  async getAllCattle(): Promise<Cattle[]> {
    return await db.select().from(cattle).orderBy(desc(cattle.createdAt));
  }

  // Health records
  async getHealthRecords(cattleId: string): Promise<HealthRecord[]> {
    return await db
      .select()
      .from(healthRecords)
      .where(eq(healthRecords.cattleId, cattleId))
      .orderBy(desc(healthRecords.checkupDate));
  }

  async createHealthRecord(record: InsertHealthRecord): Promise<HealthRecord> {
    const [healthRecord] = await db
      .insert(healthRecords)
      .values(record)
      .returning();
    return healthRecord;
  }

  // Vaccinations
  async getVaccinations(cattleId: string): Promise<Vaccination[]> {
    return await db
      .select()
      .from(vaccinations)
      .where(eq(vaccinations.cattleId, cattleId))
      .orderBy(desc(vaccinations.administeredDate));
  }

  async createVaccination(vaccination: InsertVaccination): Promise<Vaccination> {
    const [vaccinationRecord] = await db
      .insert(vaccinations)
      .values(vaccination)
      .returning();
    return vaccinationRecord;
  }

  async getUpcomingVaccinations(): Promise<Vaccination[]> {
    return await db
      .select()
      .from(vaccinations)
      .where(sql`${vaccinations.nextDueDate} <= NOW() + INTERVAL '30 days'`)
      .orderBy(vaccinations.nextDueDate);
  }

  // Feeding records
  async getFeedingRecords(cattleId: string): Promise<FeedingRecord[]> {
    return await db
      .select()
      .from(feedingRecords)
      .where(eq(feedingRecords.cattleId, cattleId))
      .orderBy(desc(feedingRecords.feedingTime));
  }

  async createFeedingRecord(record: InsertFeedingRecord): Promise<FeedingRecord> {
    const [feedingRecord] = await db
      .insert(feedingRecords)
      .values(record)
      .returning();
    return feedingRecord;
  }

  // Feed inventory
  async getFeedInventory(): Promise<FeedInventory[]> {
    return await db.select().from(feedInventory).orderBy(feedInventory.name);
  }

  async createFeedInventory(item: InsertFeedInventory): Promise<FeedInventory> {
    const [inventoryItem] = await db
      .insert(feedInventory)
      .values(item)
      .returning();
    return inventoryItem;
  }

  async updateFeedInventory(id: string, updateData: Partial<InsertFeedInventory>): Promise<FeedInventory> {
    const [inventoryItem] = await db
      .update(feedInventory)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(feedInventory.id, id))
      .returning();
    return inventoryItem;
  }

  // Disease detection
  async getDiseaseDetections(cattleId: string): Promise<DiseaseDetection[]> {
    return await db
      .select()
      .from(diseaseDetections)
      .where(eq(diseaseDetections.cattleId, cattleId))
      .orderBy(desc(diseaseDetections.analysisDate));
  }

  async createDiseaseDetection(detection: InsertDiseaseDetection): Promise<DiseaseDetection> {
    const [detectionRecord] = await db
      .insert(diseaseDetections)
      .values(detection)
      .returning();
    return detectionRecord;
  }

  // Sales transactions
  async getSalesTransactions(): Promise<SalesTransaction[]> {
    return await db
      .select()
      .from(salesTransactions)
      .orderBy(desc(salesTransactions.saleDate));
  }

  async createSalesTransaction(transaction: InsertSalesTransaction): Promise<SalesTransaction> {
    const [salesTransaction] = await db
      .insert(salesTransactions)
      .values(transaction)
      .returning();
    return salesTransaction;
  }

  // Alerts
  async getAlerts(userId: string): Promise<Alert[]> {
    return await db
      .select()
      .from(alerts)
      .where(eq(alerts.userId, userId))
      .orderBy(desc(alerts.createdAt));
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const [alertRecord] = await db
      .insert(alerts)
      .values(alert)
      .returning();
    return alertRecord;
  }

  async markAlertAsRead(id: string): Promise<void> {
    await db
      .update(alerts)
      .set({ isRead: true })
      .where(eq(alerts.id, id));
  }

  // Analytics
  async getHealthStats(): Promise<{
    total: number;
    healthy: number;
    sick: number;
    critical: number;
  }> {
    const results = await db
      .select({
        healthStatus: cattle.healthStatus,
        count: sql<number>`count(*)::int`,
      })
      .from(cattle)
      .groupBy(cattle.healthStatus);

    const stats = { total: 0, healthy: 0, sick: 0, critical: 0 };
    
    results.forEach((result) => {
      stats.total += result.count;
      if (result.healthStatus === 'healthy') stats.healthy = result.count;
      else if (result.healthStatus === 'sick') stats.sick = result.count;
      else if (result.healthStatus === 'critical') stats.critical = result.count;
    });

    return stats;
  }
}

export const storage = new DatabaseStorage();
