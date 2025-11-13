import cron from 'node-cron';
import { storage } from './storage';

// Schedule daily feed execution at 6:00 AM every day
export function initializeFeedScheduler() {
  console.log('📅 Initializing feed plan scheduler...');

  // Run daily at 6:00 AM
  cron.schedule('0 6 * * *', async () => {
    console.log('🔄 Running daily feed execution...');
    
    try {
      const activePlans = await storage.getActiveFeedPlans();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let successCount = 0;
      let failCount = 0;

      for (const plan of activePlans) {
        try {
          // Check if plan should be active today
          const startDate = new Date(plan.startDate);
          const endDate = new Date(plan.endDate);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);

          if (today < startDate || today > endDate) {
            console.log(`⏭️ Skipping plan ${plan.name}: Not in date range`);
            continue;
          }

          // Check if already executed today
          const alreadyExecuted = await storage.checkExecutionToday(plan.id, today);
          if (alreadyExecuted) {
            console.log(`⏭️ Skipping plan ${plan.name}: Already executed today`);
            continue;
          }

          // Calculate daily deduction
          const dailyTotal = parseFloat(plan.dailyRationPerAnimal) * plan.totalAnimals;
          
          // Get plan ingredients
          const ingredients = await storage.getFeedPlanIngredients(plan.id);
          
          const ingredientsUsed = [];
          
          for (const ing of ingredients) {
            const dailyAmount = (dailyTotal * parseFloat(ing.percentage)) / 100;
            
            // Update consumed amount
            await storage.updateIngredientConsumed(ing.id, dailyAmount);
            
            // Update inventory lock
            await storage.deductFromInventoryLock(ing.inventoryItemId, plan.id, dailyAmount);
            
            ingredientsUsed.push({
              itemId: ing.inventoryItemId,
              quantity: dailyAmount
            });
          }

          // Log execution
          await storage.createFeedExecutionLog({
            feedPlanId: plan.id,
            executionDate: today,
            quantityDeducted: dailyTotal.toString(),
            ingredientsUsed,
            status: 'success',
            notes: 'Automated daily execution via cron'
          });

          // Check if plan should be completed
          if (today >= endDate) {
            await storage.completeFeedPlan(plan.id);
            
            // Create completion alert
            await storage.createAlert({
              userId: plan.ownerId,
              type: 'info',
              title: 'Feed Plan Completed',
              description: `Feed plan "${plan.name}" has been completed automatically.`,
              isRead: false,
              actionRequired: false
            });
            
            console.log(`✅ Completed plan: ${plan.name}`);
          } else {
            console.log(`✅ Executed plan: ${plan.name} - ${dailyTotal}kg deducted`);
          }

          successCount++;
        } catch (error: any) {
          console.error(`❌ Error executing plan ${plan.name}:`, error.message);
          
          // Log failed execution
          await storage.createFeedExecutionLog({
            feedPlanId: plan.id,
            executionDate: today,
            quantityDeducted: '0',
            ingredientsUsed: [],
            status: 'failed',
            notes: `Error: ${error.message}`
          });

          failCount++;
        }
      }

      console.log(`📊 Daily execution completed: ${successCount} success, ${failCount} failed`);

      // Check for low inventory and create alerts
      await checkLowInventoryAlerts();

    } catch (error) {
      console.error('❌ Daily feed execution error:', error);
    }
  });

  // Also run at 12:00 PM and 6:00 PM for additional feeding times if needed
  cron.schedule('0 12,18 * * *', async () => {
    console.log('🔔 Checking feed plan status...');
    await checkLowInventoryAlerts();
  });

  console.log('✅ Feed plan scheduler initialized');
}

// Check for low inventory and send alerts
async function checkLowInventoryAlerts() {
  try {
    // Get all unique owner IDs
    const allPlans = await storage.getActiveFeedPlans();
    const ownerSet = new Set(allPlans.map(p => p.ownerId));
    const uniqueOwners = Array.from(ownerSet);

    for (const ownerId of uniqueOwners) {
      const items = await storage.getInventoryItems(ownerId);
      
      for (const item of items) {
        const available = parseFloat(item.availableQuantity);
        const reorderLevel = item.reorderLevel ? parseFloat(item.reorderLevel) : 0;

        if (available <= reorderLevel && available > 0) {
          // Check if alert already exists for this item today
          const existingAlerts = await storage.getAlerts(ownerId);
          const today = new Date().toDateString();
          const hasAlertToday = existingAlerts.some(
            alert => 
              alert.title === 'Low Inventory Alert' &&
              alert.description.includes(item.name) &&
              alert.createdAt &&
              new Date(alert.createdAt).toDateString() === today
          );

          if (!hasAlertToday) {
            await storage.createAlert({
              userId: ownerId,
              type: 'warning',
              title: 'Low Inventory Alert',
              description: `${item.name} is running low: ${available}${item.unit} remaining (Reorder level: ${reorderLevel}${item.unit})`,
              isRead: false,
              actionRequired: true
            });
            console.log(`⚠️ Low inventory alert created for: ${item.name}`);
          }
        } else if (available === 0) {
          // Critical: out of stock
          const existingAlerts = await storage.getAlerts(ownerId);
          const today = new Date().toDateString();
          const hasAlertToday = existingAlerts.some(
            alert => 
              alert.title === 'Critical: Out of Stock' &&
              alert.description.includes(item.name) &&
              alert.createdAt &&
              new Date(alert.createdAt).toDateString() === today
          );

          if (!hasAlertToday) {
            await storage.createAlert({
              userId: ownerId,
              type: 'critical',
              title: 'Critical: Out of Stock',
              description: `${item.name} is out of stock! Immediate reordering required.`,
              isRead: false,
              actionRequired: true
            });
            console.log(`🚨 Critical alert created for out of stock: ${item.name}`);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error checking low inventory:', error);
  }
}

// Manual trigger for testing (can be called via API)
export async function manualFeedExecution() {
  console.log('🔄 Manual feed execution triggered...');
  
  try {
    const activePlans = await storage.getActiveFeedPlans();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const results = [];

    for (const plan of activePlans) {
      try {
        // Check if plan should be active today
        const startDate = new Date(plan.startDate);
        const endDate = new Date(plan.endDate);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        if (today < startDate || today > endDate) {
          results.push({ planId: plan.id, status: 'skipped', reason: 'Not in date range' });
          continue;
        }

        // Check if already executed today
        const alreadyExecuted = await storage.checkExecutionToday(plan.id, today);
        if (alreadyExecuted) {
          results.push({ planId: plan.id, status: 'skipped', reason: 'Already executed today' });
          continue;
        }

        // Calculate daily deduction
        const dailyTotal = parseFloat(plan.dailyRationPerAnimal) * plan.totalAnimals;
        
        // Get plan ingredients
        const ingredients = await storage.getFeedPlanIngredients(plan.id);
        
        const ingredientsUsed = [];
        
        for (const ing of ingredients) {
          const dailyAmount = (dailyTotal * parseFloat(ing.percentage)) / 100;
          
          // Update consumed amount
          await storage.updateIngredientConsumed(ing.id, dailyAmount);
          
          // Update inventory lock
          await storage.deductFromInventoryLock(ing.inventoryItemId, plan.id, dailyAmount);
          
          ingredientsUsed.push({
            itemId: ing.inventoryItemId,
            quantity: dailyAmount
          });
        }

        // Log execution
        await storage.createFeedExecutionLog({
          feedPlanId: plan.id,
          executionDate: today,
          quantityDeducted: dailyTotal.toString(),
          ingredientsUsed,
          status: 'success',
          notes: 'Manual execution'
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

        results.push({ planId: plan.id, status: 'success', quantityDeducted: dailyTotal });
      } catch (error: any) {
        console.error(`Error executing plan ${plan.id}:`, error);
        results.push({ planId: plan.id, status: 'failed', error: error.message });
      }
    }

    return { success: true, results, date: today.toISOString() };
  } catch (error: any) {
    console.error('Manual feed execution error:', error);
    return { success: false, error: error.message };
  }
}
