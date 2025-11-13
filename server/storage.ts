import { 
  users, cattle, healthRecords, vaccinations, feedingRecords, 
  feedInventory, diseaseDetections, salesTransactions, alerts,
  cattleGroups, inventoryItems, feedPlans, feedPlanIngredients,
  inventoryLocks, feedExecutionLog,
  type User, type InsertUser, type Cattle, type InsertCattle,
  type HealthRecord, type InsertHealthRecord, type Vaccination, type InsertVaccination,
  type FeedingRecord, type InsertFeedingRecord, type FeedInventory, type InsertFeedInventory,
  type DiseaseDetection, type InsertDiseaseDetection, type SalesTransaction, type InsertSalesTransaction,
  type Alert, type InsertAlert, type CattleGroup, type InsertCattleGroup,
  type InventoryItem, type InsertInventoryItem, type FeedPlan, type InsertFeedPlan,
  type FeedPlanIngredient, type InsertFeedPlanIngredient, type InventoryLock, type InsertInventoryLock,
  type FeedExecutionLog, type InsertFeedExecutionLog
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, lte, gte } from "drizzle-orm";

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

  // ==================== CATTLE GROUPS ====================
  async getCattleGroups(ownerId: string): Promise<CattleGroup[]> {
    return db.select().from(cattleGroups).where(eq(cattleGroups.ownerId, ownerId));
  }

  async createCattleGroup(group: InsertCattleGroup): Promise<CattleGroup> {
    const [newGroup] = await db.insert(cattleGroups).values(group).returning();
    return newGroup;
  }

  async updateCattleGroup(id: string, data: Partial<InsertCattleGroup>): Promise<CattleGroup> {
    const [updated] = await db
      .update(cattleGroups)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(cattleGroups.id, id))
      .returning();
    return updated;
  }

  // ==================== INVENTORY MANAGEMENT ====================
  async getInventoryItems(ownerId: string): Promise<InventoryItem[]> {
    return db.select().from(inventoryItems).where(eq(inventoryItems.ownerId, ownerId));
  }

  async getInventoryItem(id: string): Promise<InventoryItem | undefined> {
    const [item] = await db.select().from(inventoryItems).where(eq(inventoryItems.id, id));
    return item;
  }

  async createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem> {
    const [newItem] = await db.insert(inventoryItems).values(item).returning();
    return newItem;
  }

  async updateInventoryItem(id: string, data: Partial<InsertInventoryItem>): Promise<InventoryItem> {
    const [updated] = await db
      .update(inventoryItems)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(inventoryItems.id, id))
      .returning();
    return updated;
  }

  async updateInventoryLock(itemId: string, quantity: number): Promise<void> {
    const [item] = await db.select().from(inventoryItems).where(eq(inventoryItems.id, itemId));
    if (!item) throw new Error('Inventory item not found');

    const newLocked = parseFloat(item.lockedQuantity || '0') + quantity;
    const newAvailable = parseFloat(item.availableQuantity) - quantity;

    await db
      .update(inventoryItems)
      .set({ 
        lockedQuantity: newLocked.toString(),
        availableQuantity: newAvailable.toString(),
        updatedAt: new Date()
      })
      .where(eq(inventoryItems.id, itemId));
  }

  async updateInventoryUnlock(itemId: string, quantity: number): Promise<void> {
    const [item] = await db.select().from(inventoryItems).where(eq(inventoryItems.id, itemId));
    if (!item) throw new Error('Inventory item not found');

    const newLocked = parseFloat(item.lockedQuantity || '0') - quantity;
    const newAvailable = parseFloat(item.availableQuantity) + quantity;

    await db
      .update(inventoryItems)
      .set({ 
        lockedQuantity: newLocked.toString(),
        availableQuantity: newAvailable.toString(),
        updatedAt: new Date()
      })
      .where(eq(inventoryItems.id, itemId));
  }

  // ==================== FEED PLANS ====================
  async getFeedPlans(ownerId: string): Promise<FeedPlan[]> {
    return db.select().from(feedPlans)
      .where(eq(feedPlans.ownerId, ownerId))
      .orderBy(desc(feedPlans.createdAt));
  }

  async getFeedPlanDetails(id: string): Promise<FeedPlan | undefined> {
    const [plan] = await db.select().from(feedPlans).where(eq(feedPlans.id, id));
    return plan;
  }

  async createFeedPlan(plan: InsertFeedPlan): Promise<FeedPlan> {
    const [newPlan] = await db.insert(feedPlans).values(plan).returning();
    return newPlan;
  }

  async updateFeedPlanStatus(id: string, status: string): Promise<void> {
    await db
      .update(feedPlans)
      .set({ status, updatedAt: new Date() })
      .where(eq(feedPlans.id, id));
  }

  async getActiveFeedPlans(): Promise<FeedPlan[]> {
    return db.select().from(feedPlans).where(eq(feedPlans.status, 'active'));
  }

  async completeFeedPlan(id: string): Promise<void> {
    await this.updateFeedPlanStatus(id, 'completed');
    
    // Release any remaining locked inventory
    const locks = await db.select()
      .from(inventoryLocks)
      .where(and(
        eq(inventoryLocks.feedPlanId, id),
        eq(inventoryLocks.status, 'locked')
      ));

    for (const lock of locks) {
      if (parseFloat(lock.remainingQuantity) > 0) {
        await this.updateInventoryUnlock(lock.inventoryItemId, parseFloat(lock.remainingQuantity));
      }
      await db
        .update(inventoryLocks)
        .set({ status: 'consumed', updatedAt: new Date() })
        .where(eq(inventoryLocks.id, lock.id));
    }
  }

  // ==================== FEED PLAN INGREDIENTS ====================
  async getFeedPlanIngredients(planId: string): Promise<FeedPlanIngredient[]> {
    return db.select().from(feedPlanIngredients)
      .where(eq(feedPlanIngredients.feedPlanId, planId));
  }

  async createFeedPlanIngredient(ingredient: InsertFeedPlanIngredient): Promise<FeedPlanIngredient> {
    const [newIngredient] = await db.insert(feedPlanIngredients).values(ingredient).returning();
    return newIngredient;
  }

  async updateIngredientConsumed(id: string, additionalAmount: number): Promise<void> {
    const [ingredient] = await db.select().from(feedPlanIngredients)
      .where(eq(feedPlanIngredients.id, id));
    
    if (ingredient) {
      const newConsumed = parseFloat(ingredient.consumed || '0') + additionalAmount;
      await db
        .update(feedPlanIngredients)
        .set({ consumed: newConsumed.toString() })
        .where(eq(feedPlanIngredients.id, id));
    }
  }

  // ==================== INVENTORY LOCKS ====================
  async lockInventory(lock: InsertInventoryLock): Promise<InventoryLock> {
    const [newLock] = await db.insert(inventoryLocks).values(lock).returning();
    return newLock;
  }

  async getInventoryLocksByPlan(planId: string): Promise<InventoryLock[]> {
    return db.select().from(inventoryLocks)
      .where(eq(inventoryLocks.feedPlanId, planId));
  }

  async releaseInventoryLock(id: string): Promise<void> {
    await db
      .update(inventoryLocks)
      .set({ status: 'released', updatedAt: new Date() })
      .where(eq(inventoryLocks.id, id));
  }

  async deductFromInventoryLock(itemId: string, planId: string, amount: number): Promise<void> {
    const [lock] = await db.select().from(inventoryLocks)
      .where(and(
        eq(inventoryLocks.inventoryItemId, itemId),
        eq(inventoryLocks.feedPlanId, planId)
      ));

    if (lock) {
      const newRemaining = parseFloat(lock.remainingQuantity) - amount;
      await db
        .update(inventoryLocks)
        .set({ 
          remainingQuantity: newRemaining.toString(),
          updatedAt: new Date()
        })
        .where(eq(inventoryLocks.id, lock.id));

      // Also update the inventory item's locked quantity
      const [item] = await db.select().from(inventoryItems)
        .where(eq(inventoryItems.id, itemId));
      
      if (item) {
        const newLocked = parseFloat(item.lockedQuantity || '0') - amount;
        await db
          .update(inventoryItems)
          .set({ 
            lockedQuantity: newLocked.toString(),
            updatedAt: new Date()
          })
          .where(eq(inventoryItems.id, itemId));
      }
    }
  }

  // ==================== FEED EXECUTION LOGS ====================
  async createFeedExecutionLog(log: InsertFeedExecutionLog): Promise<FeedExecutionLog> {
    const [newLog] = await db.insert(feedExecutionLog).values(log).returning();
    return newLog;
  }

  async getFeedExecutionLogs(planId: string): Promise<FeedExecutionLog[]> {
    return db.select().from(feedExecutionLog)
      .where(eq(feedExecutionLog.feedPlanId, planId))
      .orderBy(desc(feedExecutionLog.executionDate));
  }

  async checkExecutionToday(planId: string, date: Date): Promise<boolean> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const [log] = await db.select().from(feedExecutionLog)
      .where(and(
        eq(feedExecutionLog.feedPlanId, planId),
        gte(feedExecutionLog.executionDate, startOfDay),
        lte(feedExecutionLog.executionDate, endOfDay)
      ))
      .limit(1);

    return !!log;
  }
}

export const storage = new DatabaseStorage();
