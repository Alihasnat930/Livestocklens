import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table with role-based access
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(), // farmer, veterinarian, buyer, admin
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Cattle table for livestock management
export const cattle = pgTable("cattle", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  rfidId: text("rfid_id").notNull().unique(),
  name: text("name").notNull(),
  breed: text("breed").notNull(),
  dateOfBirth: timestamp("date_of_birth"),
  weight: decimal("weight", { precision: 8, scale: 2 }),
  gender: text("gender"), // male, female
  location: text("location"),
  healthStatus: text("health_status").notNull().default('healthy'), // healthy, sick, critical
  photo: text("photo"),
  ownerId: varchar("owner_id").references(() => users.id),
  // Blockchain integration fields
  blockchainTxHash: text("blockchain_tx_hash"), // Transaction hash from blockchain registration
  blockchainRegistered: boolean("blockchain_registered").default(false),
  ownerCNIC: text("owner_cnic"), // National ID for blockchain ownership tracking
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Health records for tracking medical history
export const healthRecords = pgTable("health_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cattleId: varchar("cattle_id").references(() => cattle.id).notNull(),
  checkupDate: timestamp("checkup_date").notNull(),
  veterinarianId: varchar("veterinarian_id").references(() => users.id),
  healthStatus: text("health_status").notNull(),
  temperature: decimal("temperature", { precision: 4, scale: 1 }),
  weight: decimal("weight", { precision: 8, scale: 2 }),
  notes: text("notes"),
  treatmentPlan: text("treatment_plan"),
  nextCheckup: timestamp("next_checkup"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Vaccination records
export const vaccinations = pgTable("vaccinations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cattleId: varchar("cattle_id").references(() => cattle.id).notNull(),
  vaccine: text("vaccine").notNull(),
  batchNumber: text("batch_number"),
  administeredDate: timestamp("administered_date").notNull(),
  veterinarianId: varchar("veterinarian_id").references(() => users.id),
  nextDueDate: timestamp("next_due_date"),
  notes: text("notes"),
  // Blockchain integration
  blockchainTxHash: text("blockchain_tx_hash"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Feeding records and schedules
export const feedingRecords = pgTable("feeding_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cattleId: varchar("cattle_id").references(() => cattle.id).notNull(),
  feedType: text("feed_type").notNull(),
  amount: decimal("amount", { precision: 8, scale: 2 }).notNull(),
  unit: text("unit").notNull(), // kg, lbs
  feedingTime: timestamp("feeding_time").notNull(),
  notes: text("notes"),
  feederId: varchar("feeder_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Feed inventory management
export const feedInventory = pgTable("feed_inventory", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // hay, grain, silage, supplements
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit").notNull(),
  lowThreshold: decimal("low_threshold", { precision: 10, scale: 2 }),
  lastRestocked: timestamp("last_restocked"),
  expiryDate: timestamp("expiry_date"),
  supplier: text("supplier"),
  costPerUnit: decimal("cost_per_unit", { precision: 8, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Disease detection records
export const diseaseDetections = pgTable("disease_detections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cattleId: varchar("cattle_id").references(() => cattle.id).notNull(),
  imagePath: text("image_path").notNull(),
  detectedDisease: text("detected_disease"),
  confidence: integer("confidence"), // percentage 0-100
  severity: text("severity"), // low, medium, high, none
  recommendations: json("recommendations"), // array of strings
  analysisDate: timestamp("analysis_date").notNull(),
  veterinarianReviewed: boolean("veterinarian_reviewed").default(false),
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  reviewNotes: text("review_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Sales transactions
export const salesTransactions = pgTable("sales_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionId: text("transaction_id").notNull().unique(),
  cattleId: varchar("cattle_id").references(() => cattle.id).notNull(),
  sellerId: varchar("seller_id").references(() => users.id).notNull(),
  buyerId: varchar("buyer_id").references(() => users.id),
  buyerInfo: json("buyer_info"), // for external buyers
  saleType: text("sale_type").notNull(), // live_cattle, meat, milk_rights, breeding
  weight: decimal("weight", { precision: 8, scale: 2 }),
  pricePerKg: decimal("price_per_kg", { precision: 8, scale: 2 }),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  saleDate: timestamp("sale_date").notNull(),
  status: text("status").notNull().default('pending'), // pending, completed, cancelled
  blockchainHash: text("blockchain_hash"),
  certificates: json("certificates"), // array of certificate types
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Alerts and notifications
export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  cattleId: varchar("cattle_id").references(() => cattle.id),
  type: text("type").notNull(), // critical, warning, info
  title: text("title").notNull(),
  description: text("description").notNull(),
  isRead: boolean("is_read").default(false),
  actionRequired: boolean("action_required").default(false),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Cattle groups for managing multiple cattle together
export const cattleGroups = pgTable("cattle_groups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  ownerId: varchar("owner_id").references(() => users.id).notNull(),
  cattleIds: json("cattle_ids").notNull().$type<string[]>(), // Array of cattle IDs
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Inventory items for feed ingredients
export const inventoryItems = pgTable("inventory_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(), // grain, protein, mineral, fodder, supplement
  unit: text("unit").notNull(), // kg, liters, bags
  totalQuantity: decimal("total_quantity", { precision: 10, scale: 2 }).notNull(),
  availableQuantity: decimal("available_quantity", { precision: 10, scale: 2 }).notNull(),
  lockedQuantity: decimal("locked_quantity", { precision: 10, scale: 2 }).default('0'),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }),
  reorderLevel: decimal("reorder_level", { precision: 10, scale: 2 }),
  supplier: text("supplier"),
  location: text("location"),
  expiryDate: timestamp("expiry_date"),
  ownerId: varchar("owner_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Feed plans for managing feeding schedules
export const feedPlans = pgTable("feed_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  cattleGroupId: varchar("cattle_group_id").references(() => cattleGroups.id),
  cattleId: varchar("cattle_id").references(() => cattle.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  dailyRationPerAnimal: decimal("daily_ration_per_animal", { precision: 8, scale: 2 }).notNull(), // kg per animal per day
  totalAnimals: integer("total_animals").notNull(),
  status: text("status").notNull().default('active'), // active, completed, cancelled
  notes: text("notes"),
  ownerId: varchar("owner_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Feed plan ingredients - composition of each feed plan
export const feedPlanIngredients = pgTable("feed_plan_ingredients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  feedPlanId: varchar("feed_plan_id").references(() => feedPlans.id).notNull(),
  inventoryItemId: varchar("inventory_item_id").references(() => inventoryItems.id).notNull(),
  percentage: decimal("percentage", { precision: 5, scale: 2 }).notNull(), // 0-100
  totalRequired: decimal("total_required", { precision: 10, scale: 2 }).notNull(), // Auto-calculated
  consumed: decimal("consumed", { precision: 10, scale: 2 }).default('0'),
  createdAt: timestamp("created_at").defaultNow(),
});

// Inventory locks to track locked quantities for feed plans
export const inventoryLocks = pgTable("inventory_locks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  inventoryItemId: varchar("inventory_item_id").references(() => inventoryItems.id).notNull(),
  feedPlanId: varchar("feed_plan_id").references(() => feedPlans.id).notNull(),
  lockedQuantity: decimal("locked_quantity", { precision: 10, scale: 2 }).notNull(),
  remainingQuantity: decimal("remaining_quantity", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default('locked'), // locked, released, consumed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Feed execution log for tracking daily deductions
export const feedExecutionLog = pgTable("feed_execution_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  feedPlanId: varchar("feed_plan_id").references(() => feedPlans.id).notNull(),
  executionDate: timestamp("execution_date").notNull(),
  quantityDeducted: decimal("quantity_deducted", { precision: 10, scale: 2 }).notNull(),
  ingredientsUsed: json("ingredients_used").notNull().$type<Array<{ itemId: string; quantity: number }>>(),
  status: text("status").notNull(), // success, failed, partial
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema exports for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCattleSchema = createInsertSchema(cattle).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHealthRecordSchema = createInsertSchema(healthRecords).omit({
  id: true,
  createdAt: true,
});

export const insertVaccinationSchema = createInsertSchema(vaccinations).omit({
  id: true,
  createdAt: true,
});

export const insertFeedingRecordSchema = createInsertSchema(feedingRecords).omit({
  id: true,
  createdAt: true,
});

export const insertFeedInventorySchema = createInsertSchema(feedInventory).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDiseaseDetectionSchema = createInsertSchema(diseaseDetections).omit({
  id: true,
  createdAt: true,
});

export const insertSalesTransactionSchema = createInsertSchema(salesTransactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
});

export const insertCattleGroupSchema = createInsertSchema(cattleGroups).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFeedPlanSchema = createInsertSchema(feedPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFeedPlanIngredientSchema = createInsertSchema(feedPlanIngredients).omit({
  id: true,
  createdAt: true,
});

export const insertInventoryLockSchema = createInsertSchema(inventoryLocks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFeedExecutionLogSchema = createInsertSchema(feedExecutionLog).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCattle = z.infer<typeof insertCattleSchema>;
export type Cattle = typeof cattle.$inferSelect;
export type InsertHealthRecord = z.infer<typeof insertHealthRecordSchema>;
export type HealthRecord = typeof healthRecords.$inferSelect;
export type InsertVaccination = z.infer<typeof insertVaccinationSchema>;
export type Vaccination = typeof vaccinations.$inferSelect;
export type InsertFeedingRecord = z.infer<typeof insertFeedingRecordSchema>;
export type FeedingRecord = typeof feedingRecords.$inferSelect;
export type InsertFeedInventory = z.infer<typeof insertFeedInventorySchema>;
export type FeedInventory = typeof feedInventory.$inferSelect;
export type InsertDiseaseDetection = z.infer<typeof insertDiseaseDetectionSchema>;
export type DiseaseDetection = typeof diseaseDetections.$inferSelect;
export type InsertSalesTransaction = z.infer<typeof insertSalesTransactionSchema>;
export type SalesTransaction = typeof salesTransactions.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertCattleGroup = z.infer<typeof insertCattleGroupSchema>;
export type CattleGroup = typeof cattleGroups.$inferSelect;
export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
export type InventoryItem = typeof inventoryItems.$inferSelect;
export type InsertFeedPlan = z.infer<typeof insertFeedPlanSchema>;
export type FeedPlan = typeof feedPlans.$inferSelect;
export type InsertFeedPlanIngredient = z.infer<typeof insertFeedPlanIngredientSchema>;
export type FeedPlanIngredient = typeof feedPlanIngredients.$inferSelect;
export type InsertInventoryLock = z.infer<typeof insertInventoryLockSchema>;
export type InventoryLock = typeof inventoryLocks.$inferSelect;
export type InsertFeedExecutionLog = z.infer<typeof insertFeedExecutionLogSchema>;
export type FeedExecutionLog = typeof feedExecutionLog.$inferSelect;
