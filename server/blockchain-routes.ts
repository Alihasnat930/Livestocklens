import type { Express, Request, Response } from "express";
import { blockchainService } from "./blockchain/service";
import { db } from "./db";
import { cattle, vaccinations } from "@shared/schema";
import { eq } from "drizzle-orm";

/**
 * Setup blockchain-related API routes
 */
export function setupBlockchainRoutes(app: Express) {
  // Check blockchain service status
  app.get("/api/blockchain/status", (req: Request, res: Response) => {
    const enabled = blockchainService.isEnabled();
    res.json({
      enabled,
      network: enabled ? "Polygon Amoy Testnet" : null,
      contract: enabled ? blockchainService.getContractUrl() : null,
    });
  });

  // Register cattle on blockchain
  app.post("/api/blockchain/cattle/register", async (req: Request, res: Response) => {
    try {
      const { cattleId } = req.body;

      if (!cattleId) {
        return res.status(400).json({ error: "Cattle ID is required" });
      }

      // Get cattle from database
      const [cattleRecord] = await db
        .select()
        .from(cattle)
        .where(eq(cattle.id, cattleId));

      if (!cattleRecord) {
        return res.status(404).json({ error: "Cattle not found" });
      }

      if (cattleRecord.blockchainRegistered) {
        return res.status(400).json({ 
          error: "Cattle already registered on blockchain",
          txHash: cattleRecord.blockchainTxHash
        });
      }

      // Get owner name
      const ownerName = (req as any).user?.name || "Unknown Owner";
      const ownerCNIC = cattleRecord.ownerCNIC || (req as any).user?.id || "N/A";

      // Register on blockchain
      const result = await blockchainService.registerCattle({
        rfid: cattleRecord.rfidId,
        breed: cattleRecord.breed,
        gender: cattleRecord.gender as "Male" | "Female" | "Calf" || "Male",
        ownerCNIC,
        ownerName,
      });

      if (!result.success) {
        return res.status(500).json({ error: result.error });
      }

      // Update database with blockchain info
      await db
        .update(cattle)
        .set({
          blockchainTxHash: result.txHash,
          blockchainRegistered: true,
          ownerCNIC,
          updatedAt: new Date(),
        })
        .where(eq(cattle.id, cattleId));

      res.json({
        success: true,
        txHash: result.txHash,
        explorerUrl: blockchainService.getTransactionUrl(result.txHash!),
      });
    } catch (error: any) {
      console.error("Blockchain registration error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get cattle from blockchain
  app.get("/api/blockchain/cattle/:rfid", async (req: Request, res: Response) => {
    try {
      const { rfid } = req.params;

      const result = await blockchainService.getCattle(rfid);

      if (!result.success) {
        return res.status(404).json({ error: result.error });
      }

      res.json(result.data);
    } catch (error: any) {
      console.error("Blockchain query error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Add vaccination to blockchain
  app.post("/api/blockchain/vaccination/add", async (req: Request, res: Response) => {
    try {
      const { vaccinationId } = req.body;

      if (!vaccinationId) {
        return res.status(400).json({ error: "Vaccination ID is required" });
      }

      // Get vaccination record
      const [vaccination] = await db
        .select()
        .from(vaccinations)
        .where(eq(vaccinations.id, vaccinationId));

      if (!vaccination) {
        return res.status(404).json({ error: "Vaccination record not found" });
      }

      if (vaccination.blockchainTxHash) {
        return res.status(400).json({
          error: "Vaccination already registered on blockchain",
          txHash: vaccination.blockchainTxHash
        });
      }

      // Get cattle RFID
      const [cattleRecord] = await db
        .select()
        .from(cattle)
        .where(eq(cattle.id, vaccination.cattleId));

      if (!cattleRecord) {
        return res.status(404).json({ error: "Cattle not found" });
      }

      // Add to blockchain
      const result = await blockchainService.addVaccination({
        rfid: cattleRecord.rfidId,
        vaccineName: vaccination.vaccine,
        vaccinationDate: vaccination.administeredDate,
      });

      if (!result.success) {
        return res.status(500).json({ error: result.error });
      }

      // Update database
      await db
        .update(vaccinations)
        .set({
          blockchainTxHash: result.txHash,
        })
        .where(eq(vaccinations.id, vaccinationId));

      res.json({
        success: true,
        txHash: result.txHash,
        explorerUrl: blockchainService.getTransactionUrl(result.txHash!),
      });
    } catch (error: any) {
      console.error("Blockchain vaccination error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get vaccination history from blockchain
  app.get("/api/blockchain/vaccinations/:rfid", async (req: Request, res: Response) => {
    try {
      const { rfid } = req.params;

      const result = await blockchainService.getVaccinations(rfid);

      if (!result.success) {
        return res.status(404).json({ error: result.error });
      }

      res.json(result.data);
    } catch (error: any) {
      console.error("Blockchain query error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Transfer ownership on blockchain
  app.post("/api/blockchain/cattle/transfer", async (req: Request, res: Response) => {
    try {
      const { cattleId, newOwnerCNIC, newOwnerName } = req.body;

      if (!cattleId || !newOwnerCNIC || !newOwnerName) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Get cattle record
      const [cattleRecord] = await db
        .select()
        .from(cattle)
        .where(eq(cattle.id, cattleId));

      if (!cattleRecord) {
        return res.status(404).json({ error: "Cattle not found" });
      }

      if (!cattleRecord.blockchainRegistered) {
        return res.status(400).json({
          error: "Cattle must be registered on blockchain first"
        });
      }

      // Transfer on blockchain
      const result = await blockchainService.transferOwnership({
        rfid: cattleRecord.rfidId,
        newOwnerCNIC,
        newOwnerName,
      });

      if (!result.success) {
        return res.status(500).json({ error: result.error });
      }

      // Update database
      await db
        .update(cattle)
        .set({
          ownerCNIC: newOwnerCNIC,
          updatedAt: new Date(),
        })
        .where(eq(cattle.id, cattleId));

      res.json({
        success: true,
        txHash: result.txHash,
        explorerUrl: blockchainService.getTransactionUrl(result.txHash!),
      });
    } catch (error: any) {
      console.error("Blockchain transfer error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get ownership history from blockchain
  app.get("/api/blockchain/ownership/:rfid", async (req: Request, res: Response) => {
    try {
      const { rfid } = req.params;

      const result = await blockchainService.getOwnershipHistory(rfid);

      if (!result.success) {
        return res.status(404).json({ error: result.error });
      }

      res.json(result.data);
    } catch (error: any) {
      console.error("Blockchain query error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Set heritage information on blockchain
  app.post("/api/blockchain/heritage/set", async (req: Request, res: Response) => {
    try {
      const { cattleId, fatherRfid, motherRfid, certification } = req.body;

      if (!cattleId) {
        return res.status(400).json({ error: "Cattle ID is required" });
      }

      // Get cattle record
      const [cattleRecord] = await db
        .select()
        .from(cattle)
        .where(eq(cattle.id, cattleId));

      if (!cattleRecord) {
        return res.status(404).json({ error: "Cattle not found" });
      }

      // Set heritage on blockchain
      const result = await blockchainService.setHeritage({
        rfid: cattleRecord.rfidId,
        fatherRfid: fatherRfid || "",
        motherRfid: motherRfid || "",
        certification: certification || "",
      });

      if (!result.success) {
        return res.status(500).json({ error: result.error });
      }

      res.json({
        success: true,
        txHash: result.txHash,
        explorerUrl: blockchainService.getTransactionUrl(result.txHash!),
      });
    } catch (error: any) {
      console.error("Blockchain heritage error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get heritage information from blockchain
  app.get("/api/blockchain/heritage/:rfid", async (req: Request, res: Response) => {
    try {
      const { rfid } = req.params;

      const result = await blockchainService.getHeritage(rfid);

      if (!result.success) {
        return res.status(404).json({ error: result.error });
      }

      res.json(result.data);
    } catch (error: any) {
      console.error("Blockchain query error:", error);
      res.status(500).json({ error: error.message });
    }
  });
}
