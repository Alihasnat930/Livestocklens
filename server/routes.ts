import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, insertCattleSchema, insertHealthRecordSchema,
  insertVaccinationSchema, insertFeedingRecordSchema, insertFeedInventorySchema,
  insertDiseaseDetectionSchema, insertSalesTransactionSchema, insertAlertSchema,
  insertCattleGroupSchema, insertInventoryItemSchema, insertFeedPlanSchema
} from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

// JWT secret - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || "livestock-health-meter-secret";

// Configure multer for image uploads
const upload = multer({
  dest: 'uploads/cattle-images/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

// Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ error: 'Registration failed' });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password, role } = req.body;
      
      // Development mode - allow test users without database
      if (process.env.NODE_ENV === 'development') {
        // Test users for development
        const testUsers = [
          { id: '1', name: 'Test Farmer', email: 'farmer@test.com', role: 'farmer', password: 'test123' },
          { id: '2', name: 'Test Vet', email: 'vet@test.com', role: 'veterinarian', password: 'test123' },
          { id: '3', name: 'Test Buyer', email: 'buyer@test.com', role: 'buyer', password: 'test123' },
          { id: '4', name: 'Test Admin', email: 'admin@test.com', role: 'admin', password: 'test123' },
        ];

        const testUser = testUsers.find(u => u.email === email && u.password === password && u.role === role);
        if (testUser) {
          const token = jwt.sign(
            { userId: testUser.id, email: testUser.email, role: testUser.role },
            JWT_SECRET,
            { expiresIn: '24h' }
          );

          return res.json({
            token,
            user: {
              id: testUser.id,
              name: testUser.name,
              email: testUser.email,
              role: testUser.role,
              avatar: null
            }
          });
        }
      }
      
      // Production mode - use database
      try {
        const user = await storage.getUserByEmail(email);
        if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
          { userId: user.id, email: user.email, role: user.role },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar
          }
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(400).json({ error: 'Login failed' });
    }
  });

  // User profile routes
  app.get("/api/users/profile", authenticateToken, async (req: any, res) => {
    try {
      // Development mode - return mock user data
      if (process.env.NODE_ENV === 'development') {
        const testUsers = [
          { id: '1', name: 'Test Farmer', email: 'farmer@test.com', role: 'farmer' },
          { id: '2', name: 'Test Vet', email: 'vet@test.com', role: 'veterinarian' },
          { id: '3', name: 'Test Buyer', email: 'buyer@test.com', role: 'buyer' },
          { id: '4', name: 'Test Admin', email: 'admin@test.com', role: 'admin' },
        ];

        const testUser = testUsers.find(u => u.id === req.user.userId);
        if (testUser) {
          return res.json({
            id: testUser.id,
            name: testUser.name,
            email: testUser.email,
            role: testUser.role,
            avatar: null
          });
        }
      }

      // Production mode - use database
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      });
    } catch (error) {
      console.error('Profile fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  });

  // Cattle management routes
  app.get("/api/cattle", authenticateToken, async (req: any, res) => {
    try {
      let cattle;
      if (req.user.role === 'farmer') {
        cattle = await storage.getCattleByOwner(req.user.userId);
      } else {
        cattle = await storage.getAllCattle();
      }
      res.json(cattle);
    } catch (error) {
      console.error('Cattle fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch cattle' });
    }
  });

  app.get("/api/cattle/:id", authenticateToken, async (req, res) => {
    try {
      const cattle = await storage.getCattle(req.params.id);
      if (!cattle) {
        return res.status(404).json({ error: 'Cattle not found' });
      }
      res.json(cattle);
    } catch (error) {
      console.error('Cattle fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch cattle' });
    }
  });

  app.post("/api/cattle", authenticateToken, upload.single('photo'), async (req: any, res) => {
    try {
      const cattleData = insertCattleSchema.parse({
        ...req.body,
        ownerId: req.user.userId,
        photo: req.file ? req.file.path : null
      });
      
      const cattle = await storage.createCattle(cattleData);
      res.status(201).json(cattle);
    } catch (error) {
      console.error('Cattle creation error:', error);
      res.status(400).json({ error: 'Failed to create cattle' });
    }
  });

  app.put("/api/cattle/:id", authenticateToken, upload.single('photo'), async (req: any, res) => {
    try {
      const updateData = { ...req.body };
      if (req.file) {
        updateData.photo = req.file.path;
      }
      
      const cattle = await storage.updateCattle(req.params.id, updateData);
      res.json(cattle);
    } catch (error) {
      console.error('Cattle update error:', error);
      res.status(400).json({ error: 'Failed to update cattle' });
    }
  });

  // Health records routes
  app.get("/api/cattle/:id/health-records", authenticateToken, async (req, res) => {
    try {
      const records = await storage.getHealthRecords(req.params.id);
      res.json(records);
    } catch (error) {
      console.error('Health records fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch health records' });
    }
  });

  app.post("/api/health-records", authenticateToken, async (req: any, res) => {
    try {
      const recordData = insertHealthRecordSchema.parse({
        ...req.body,
        veterinarianId: req.user.role === 'veterinarian' ? req.user.userId : req.body.veterinarianId
      });
      
      const record = await storage.createHealthRecord(recordData);
      res.status(201).json(record);
    } catch (error) {
      console.error('Health record creation error:', error);
      res.status(400).json({ error: 'Failed to create health record' });
    }
  });

  // Vaccination routes
  app.get("/api/cattle/:id/vaccinations", authenticateToken, async (req, res) => {
    try {
      const vaccinations = await storage.getVaccinations(req.params.id);
      res.json(vaccinations);
    } catch (error) {
      console.error('Vaccinations fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch vaccinations' });
    }
  });

  app.get("/api/vaccinations/upcoming", authenticateToken, async (req, res) => {
    try {
      const vaccinations = await storage.getUpcomingVaccinations();
      res.json(vaccinations);
    } catch (error) {
      console.error('Upcoming vaccinations fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch upcoming vaccinations' });
    }
  });

  app.post("/api/vaccinations", authenticateToken, async (req: any, res) => {
    try {
      const vaccinationData = insertVaccinationSchema.parse({
        ...req.body,
        veterinarianId: req.user.role === 'veterinarian' ? req.user.userId : req.body.veterinarianId
      });
      
      const vaccination = await storage.createVaccination(vaccinationData);
      res.status(201).json(vaccination);
    } catch (error) {
      console.error('Vaccination creation error:', error);
      res.status(400).json({ error: 'Failed to create vaccination record' });
    }
  });

  // Feeding records routes
  app.get("/api/cattle/:id/feeding-records", authenticateToken, async (req, res) => {
    try {
      const records = await storage.getFeedingRecords(req.params.id);
      res.json(records);
    } catch (error) {
      console.error('Feeding records fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch feeding records' });
    }
  });

  app.post("/api/feeding-records", authenticateToken, async (req: any, res) => {
    try {
      const recordData = insertFeedingRecordSchema.parse({
        ...req.body,
        feederId: req.user.userId
      });
      
      const record = await storage.createFeedingRecord(recordData);
      res.status(201).json(record);
    } catch (error) {
      console.error('Feeding record creation error:', error);
      res.status(400).json({ error: 'Failed to create feeding record' });
    }
  });

  // Feed inventory routes
  app.get("/api/feed-inventory", authenticateToken, async (req, res) => {
    try {
      const inventory = await storage.getFeedInventory();
      res.json(inventory);
    } catch (error) {
      console.error('Feed inventory fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch feed inventory' });
    }
  });

  app.post("/api/feed-inventory", authenticateToken, async (req, res) => {
    try {
      const inventoryData = insertFeedInventorySchema.parse(req.body);
      const item = await storage.createFeedInventory(inventoryData);
      res.status(201).json(item);
    } catch (error) {
      console.error('Feed inventory creation error:', error);
      res.status(400).json({ error: 'Failed to create feed inventory item' });
    }
  });

  app.put("/api/feed-inventory/:id", authenticateToken, async (req, res) => {
    try {
      const item = await storage.updateFeedInventory(req.params.id, req.body);
      res.json(item);
    } catch (error) {
      console.error('Feed inventory update error:', error);
      res.status(400).json({ error: 'Failed to update feed inventory' });
    }
  });

  // Disease detection routes
  app.get("/api/cattle/:id/disease-detections", authenticateToken, async (req, res) => {
    try {
      const detections = await storage.getDiseaseDetections(req.params.id);
      res.json(detections);
    } catch (error) {
      console.error('Disease detections fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch disease detections' });
    }
  });

  app.post("/api/disease-detections", authenticateToken, upload.single('image'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Image file is required' });
      }

      // Simulate AI disease detection
      const mockDiseases = ['Healthy', 'Foot and Mouth Disease', 'Mastitis', 'Respiratory Infection'];
      const randomDisease = mockDiseases[Math.floor(Math.random() * mockDiseases.length)];
      const confidence = Math.floor(Math.random() * 30) + 70; // 70-100%
      
      const detectionData = insertDiseaseDetectionSchema.parse({
        cattleId: req.body.cattleId,
        imagePath: req.file.path,
        detectedDisease: randomDisease,
        confidence,
        severity: randomDisease === 'Healthy' ? 'none' : confidence > 85 ? 'high' : 'medium',
        recommendations: randomDisease === 'Healthy' 
          ? ['Continue regular monitoring', 'Maintain good nutrition']
          : ['Consult veterinarian', 'Monitor closely', 'Consider isolation'],
        analysisDate: new Date()
      });
      
      const detection = await storage.createDiseaseDetection(detectionData);
      res.status(201).json(detection);
    } catch (error) {
      console.error('Disease detection creation error:', error);
      res.status(400).json({ error: 'Failed to create disease detection' });
    }
  });

  // Sales transactions routes
  app.get("/api/sales-transactions", authenticateToken, async (req, res) => {
    try {
      const transactions = await storage.getSalesTransactions();
      res.json(transactions);
    } catch (error) {
      console.error('Sales transactions fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch sales transactions' });
    }
  });

  app.post("/api/sales-transactions", authenticateToken, async (req: any, res) => {
    try {
      // Generate transaction ID and blockchain hash
      const transactionId = `TX-${Date.now()}`;
      const blockchainHash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      
      const transactionData = insertSalesTransactionSchema.parse({
        ...req.body,
        transactionId,
        sellerId: req.user.userId,
        blockchainHash,
        verified: true
      });
      
      const transaction = await storage.createSalesTransaction(transactionData);
      res.status(201).json(transaction);
    } catch (error) {
      console.error('Sales transaction creation error:', error);
      res.status(400).json({ error: 'Failed to create sales transaction' });
    }
  });

  // Alerts routes
  app.get("/api/alerts", authenticateToken, async (req: any, res) => {
    try {
      const alerts = await storage.getAlerts(req.user.userId);
      res.json(alerts);
    } catch (error) {
      console.error('Alerts fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch alerts' });
    }
  });

  app.post("/api/alerts", authenticateToken, async (req: any, res) => {
    try {
      const alertData = insertAlertSchema.parse({
        ...req.body,
        userId: req.user.userId
      });
      
      const alert = await storage.createAlert(alertData);
      res.status(201).json(alert);
    } catch (error) {
      console.error('Alert creation error:', error);
      res.status(400).json({ error: 'Failed to create alert' });
    }
  });

  app.put("/api/alerts/:id/read", authenticateToken, async (req, res) => {
    try {
      await storage.markAlertAsRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error('Alert update error:', error);
      res.status(400).json({ error: 'Failed to mark alert as read' });
    }
  });

  // Analytics routes
  app.get("/api/analytics/health-stats", authenticateToken, async (req, res) => {
    try {
      const stats = await storage.getHealthStats();
      res.json(stats);
    } catch (error) {
      console.error('Health stats fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch health statistics' });
    }
  });

  // Dashboard summary route
  app.get("/api/dashboard/summary", authenticateToken, async (req: any, res) => {
    try {
      const [healthStats, upcomingVaccinations, alerts] = await Promise.all([
        storage.getHealthStats(),
        storage.getUpcomingVaccinations(),
        storage.getAlerts(req.user.userId)
      ]);

      res.json({
        healthStats,
        upcomingVaccinations: upcomingVaccinations.slice(0, 5), // Next 5 vaccinations
        recentAlerts: alerts.filter(alert => !alert.isRead).slice(0, 5) // 5 unread alerts
      });
    } catch (error) {
      console.error('Dashboard summary fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard summary' });
    }
  });

  // ==================== FEED PLAN & INVENTORY MANAGEMENT ROUTES ====================
  
  // Get all cattle groups
  app.get("/api/cattle-groups", authenticateToken, async (req: any, res) => {
    try {
      const groups = await storage.getCattleGroups(req.user.userId);
      res.json(groups);
    } catch (error) {
      console.error('Cattle groups fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch cattle groups' });
    }
  });

  // Create cattle group
  app.post("/api/cattle-groups", authenticateToken, async (req: any, res) => {
    try {
      const groupData = { ...req.body, ownerId: req.user.userId };
      const newGroup = await storage.createCattleGroup(groupData);
      res.status(201).json(newGroup);
    } catch (error) {
      console.error('Cattle group creation error:', error);
      res.status(500).json({ error: 'Failed to create cattle group' });
    }
  });

  // Get all inventory items
  app.get("/api/inventory", authenticateToken, async (req: any, res) => {
    try {
      const items = await storage.getInventoryItems(req.user.userId);
      res.json(items);
    } catch (error) {
      console.error('Inventory fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch inventory items' });
    }
  });

  // Create inventory item
  app.post("/api/inventory", authenticateToken, async (req: any, res) => {
    try {
      const itemData = { 
        ...req.body, 
        ownerId: req.user.userId,
        availableQuantity: req.body.totalQuantity,
        lockedQuantity: '0'
      };
      const newItem = await storage.createInventoryItem(itemData);
      res.status(201).json(newItem);
    } catch (error) {
      console.error('Inventory item creation error:', error);
      res.status(500).json({ error: 'Failed to create inventory item' });
    }
  });

  // Update inventory item
  app.put("/api/inventory/:id", authenticateToken, async (req: any, res) => {
    try {
      const updated = await storage.updateInventoryItem(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      console.error('Inventory update error:', error);
      res.status(500).json({ error: 'Failed to update inventory item' });
    }
  });

  // Get all feed plans
  app.get("/api/feed-plans", authenticateToken, async (req: any, res) => {
    try {
      const plans = await storage.getFeedPlans(req.user.userId);
      res.json(plans);
    } catch (error) {
      console.error('Feed plans fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch feed plans' });
    }
  });

  // Get single feed plan with details
  app.get("/api/feed-plans/:id", authenticateToken, async (req: any, res) => {
    try {
      const plan = await storage.getFeedPlanDetails(req.params.id);
      res.json(plan);
    } catch (error) {
      console.error('Feed plan fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch feed plan details' });
    }
  });

  // Create feed plan with inventory locking
  app.post("/api/feed-plans", authenticateToken, async (req: any, res) => {
    try {
      const { 
        name, 
        cattleGroupId, 
        cattleId, 
        startDate, 
        endDate, 
        dailyRationPerAnimal,
        totalAnimals,
        ingredients, // Array of { inventoryItemId, percentage }
        notes 
      } = req.body;

      // Validate ingredients total to 100%
      const totalPercentage = ingredients.reduce((sum: number, ing: any) => sum + parseFloat(ing.percentage), 0);
      if (Math.abs(totalPercentage - 100) > 0.01) {
        return res.status(400).json({ error: 'Ingredient percentages must total 100%' });
      }

      // Calculate duration in days
      const start = new Date(startDate);
      const end = new Date(endDate);
      const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      // Calculate total requirements per ingredient
      const totalDailyRation = parseFloat(dailyRationPerAnimal) * totalAnimals;
      const totalPlanRation = totalDailyRation * durationDays;

      const ingredientsWithRequirements = await Promise.all(
        ingredients.map(async (ing: any) => {
          const required = (totalPlanRation * parseFloat(ing.percentage)) / 100;
          const item = await storage.getInventoryItem(ing.inventoryItemId);
          
          if (!item) {
            throw new Error(`Inventory item ${ing.inventoryItemId} not found`);
          }

          const available = parseFloat(item.availableQuantity);
          if (available < required) {
            throw new Error(`Insufficient inventory for ${item.name}. Required: ${required}${item.unit}, Available: ${available}${item.unit}`);
          }

          return {
            inventoryItemId: ing.inventoryItemId,
            percentage: ing.percentage,
            totalRequired: required.toString(),
            consumed: '0'
          };
        })
      );

      // Create feed plan
      const feedPlan = await storage.createFeedPlan({
        name,
        cattleGroupId: cattleGroupId || null,
        cattleId: cattleId || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        dailyRationPerAnimal: dailyRationPerAnimal.toString(),
        totalAnimals,
        status: 'active',
        notes,
        ownerId: req.user.userId
      });

      // Create feed plan ingredients and lock inventory
      await Promise.all(
        ingredientsWithRequirements.map(async (ing) => {
          // Create ingredient record
          await storage.createFeedPlanIngredient({
            feedPlanId: feedPlan.id,
            ...ing
          });

          // Lock inventory
          await storage.lockInventory({
            inventoryItemId: ing.inventoryItemId,
            feedPlanId: feedPlan.id,
            lockedQuantity: ing.totalRequired,
            remainingQuantity: ing.totalRequired,
            status: 'locked'
          });

          // Update inventory available quantity
          await storage.updateInventoryLock(ing.inventoryItemId, parseFloat(ing.totalRequired));
        })
      );

      // Create alert for plan creation
      await storage.createAlert({
        userId: req.user.userId,
        type: 'info',
        title: 'Feed Plan Created',
        description: `Feed plan "${name}" has been created successfully for ${totalAnimals} animals.`,
        isRead: false,
        actionRequired: false
      });

      res.status(201).json(feedPlan);
    } catch (error: any) {
      console.error('Feed plan creation error:', error);
      res.status(400).json({ error: error.message || 'Failed to create feed plan' });
    }
  });

  // Cancel feed plan (unlock inventory)
  app.post("/api/feed-plans/:id/cancel", authenticateToken, async (req: any, res) => {
    try {
      const planId = req.params.id;
      
      // Get plan details
      const plan = await storage.getFeedPlanDetails(planId);
      if (!plan) {
        return res.status(404).json({ error: 'Feed plan not found' });
      }

      if (plan.status !== 'active') {
        return res.status(400).json({ error: 'Only active plans can be cancelled' });
      }

      // Release all inventory locks
      const locks = await storage.getInventoryLocksByPlan(planId);
      await Promise.all(
        locks.map(async (lock) => {
          await storage.releaseInventoryLock(lock.id);
          await storage.updateInventoryUnlock(lock.inventoryItemId, parseFloat(lock.remainingQuantity));
        })
      );

      // Update plan status
      await storage.updateFeedPlanStatus(planId, 'cancelled');

      // Create alert
      await storage.createAlert({
        userId: req.user.userId,
        type: 'warning',
        title: 'Feed Plan Cancelled',
        description: `Feed plan "${plan.name}" has been cancelled and inventory unlocked.`,
        isRead: false,
        actionRequired: false
      });

      res.json({ message: 'Feed plan cancelled successfully' });
    } catch (error) {
      console.error('Feed plan cancellation error:', error);
      res.status(500).json({ error: 'Failed to cancel feed plan' });
    }
  });

  // Execute daily feed deduction (can be called by cron job)
  app.post("/api/feed-plans/execute-daily", authenticateToken, async (req: any, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get all active plans
      const activePlans = await storage.getActiveFeedPlans();

      const results = await Promise.all(
        activePlans.map(async (plan) => {
          try {
            // Check if plan should be active today
            const startDate = new Date(plan.startDate);
            const endDate = new Date(plan.endDate);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);

            if (today < startDate || today > endDate) {
              return { planId: plan.id, status: 'skipped', reason: 'Not in date range' };
            }

            // Check if already executed today
            const alreadyExecuted = await storage.checkExecutionToday(plan.id, today);
            if (alreadyExecuted) {
              return { planId: plan.id, status: 'skipped', reason: 'Already executed today' };
            }

            // Calculate daily deduction
            const dailyTotal = parseFloat(plan.dailyRationPerAnimal) * plan.totalAnimals;
            
            // Get plan ingredients
            const ingredients = await storage.getFeedPlanIngredients(plan.id);
            
            const ingredientsUsed = await Promise.all(
              ingredients.map(async (ing) => {
                const dailyAmount = (dailyTotal * parseFloat(ing.percentage)) / 100;
                
                // Update consumed amount
                await storage.updateIngredientConsumed(ing.id, dailyAmount);
                
                // Update inventory lock
                await storage.deductFromInventoryLock(ing.inventoryItemId, plan.id, dailyAmount);
                
                return {
                  itemId: ing.inventoryItemId,
                  quantity: dailyAmount
                };
              })
            );

            // Log execution
            await storage.createFeedExecutionLog({
              feedPlanId: plan.id,
              executionDate: today,
              quantityDeducted: dailyTotal.toString(),
              ingredientsUsed,
              status: 'success',
              notes: 'Automated daily execution'
            });

            // Check if plan should be completed
            if (today >= endDate) {
              await storage.completeFeedPlan(plan.id);
              
              // Create completion alert
              await storage.createAlert({
                userId: plan.ownerId,
                type: 'info',
                title: 'Feed Plan Completed',
                description: `Feed plan "${plan.name}" has been completed.`,
                isRead: false,
                actionRequired: false
              });
            }

            return { planId: plan.id, status: 'success', quantityDeducted: dailyTotal };
          } catch (error: any) {
            console.error(`Error executing plan ${plan.id}:`, error);
            return { planId: plan.id, status: 'failed', error: error.message };
          }
        })
      );

      res.json({ 
        message: 'Daily execution completed', 
        results,
        date: today.toISOString() 
      });
    } catch (error) {
      console.error('Daily execution error:', error);
      res.status(500).json({ error: 'Failed to execute daily feed deduction' });
    }
  });

  // Get feed execution history
  app.get("/api/feed-plans/:id/execution-log", authenticateToken, async (req: any, res) => {
    try {
      const logs = await storage.getFeedExecutionLogs(req.params.id);
      res.json(logs);
    } catch (error) {
      console.error('Execution log fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch execution logs' });
    }
  });

  // Get inventory alerts (low stock, locked items, etc.)
  app.get("/api/inventory/alerts", authenticateToken, async (req: any, res) => {
    try {
      const items = await storage.getInventoryItems(req.user.userId);
      const alerts = items
        .filter(item => {
          const available = parseFloat(item.availableQuantity);
          const reorderLevel = item.reorderLevel ? parseFloat(item.reorderLevel) : 0;
          return available <= reorderLevel;
        })
        .map(item => ({
          itemId: item.id,
          itemName: item.name,
          available: item.availableQuantity,
          reorderLevel: item.reorderLevel,
          severity: parseFloat(item.availableQuantity) === 0 ? 'critical' : 'warning'
        }));
      
      res.json(alerts);
    } catch (error) {
      console.error('Inventory alerts fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch inventory alerts' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
