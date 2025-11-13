import { ethers } from "ethers";
import { blockchainConfig, cattleRegistryABI } from "./config";

/**
 * Blockchain service for interacting with Cattle Registry smart contract
 */
export class BlockchainService {
  private provider: ethers.JsonRpcProvider | null = null;
  private wallet: ethers.Wallet | null = null;
  private contract: ethers.Contract | null = null;
  private enabled: boolean;

  constructor() {
    this.enabled = blockchainConfig.enabled;
    
    if (this.enabled) {
      this.initialize();
    } else {
      console.log("⚠️  Blockchain integration is disabled. Set BLOCKCHAIN_ENABLED=true to enable.");
    }
  }

  private initialize() {
    try {
      // Setup provider
      this.provider = new ethers.JsonRpcProvider(blockchainConfig.network.rpcUrl);
      
      // Setup wallet
      if (!blockchainConfig.privateKey) {
        throw new Error("BLOCKCHAIN_PRIVATE_KEY not configured");
      }
      this.wallet = new ethers.Wallet(blockchainConfig.privateKey, this.provider);
      
      // Setup contract
      this.contract = new ethers.Contract(
        blockchainConfig.cattleRegistryAddress,
        cattleRegistryABI,
        this.wallet
      );
      
      console.log("✅ Blockchain service initialized");
      console.log(`📍 Network: ${blockchainConfig.network.name}`);
      console.log(`📝 Contract: ${blockchainConfig.cattleRegistryAddress}`);
    } catch (error: any) {
      console.error("❌ Failed to initialize blockchain service:", error.message);
      this.enabled = false;
    }
  }

  /**
   * Check if blockchain service is available
   */
  isEnabled(): boolean {
    return this.enabled && this.contract !== null;
  }

  /**
   * Register a new cattle on the blockchain
   */
  async registerCattle(data: {
    rfid: string;
    breed: string;
    gender: "Male" | "Female" | "Calf";
    ownerCNIC: string;
    ownerName: string;
  }): Promise<{ success: boolean; txHash?: string; error?: string }> {
    if (!this.isEnabled()) {
      return { success: false, error: "Blockchain service not enabled" };
    }

    try {
      const genderEnum = { Male: 0, Female: 1, Calf: 2 }[data.gender];
      
      // Generate a temporary transaction hash placeholder
      const tempTxHash = ethers.id(`${data.rfid}-${Date.now()}`).slice(0, 66);
      
      const tx = await this.contract!.registerCattle(
        data.rfid,
        data.breed,
        genderEnum,
        data.ownerCNIC,
        data.ownerName,
        tempTxHash,
        { gasLimit: blockchainConfig.gasLimit }
      );
      
      console.log(`⏳ Registering cattle ${data.rfid} on blockchain...`);
      const receipt = await tx.wait();
      
      console.log(`✅ Cattle registered on blockchain: ${receipt.hash}`);
      
      return {
        success: true,
        txHash: receipt.hash,
      };
    } catch (error: any) {
      console.error("❌ Blockchain registration error:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get cattle information from blockchain
   */
  async getCattle(rfid: string): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    if (!this.isEnabled()) {
      return { success: false, error: "Blockchain service not enabled" };
    }

    try {
      const result = await this.contract!.getCattle(rfid);
      
      if (!result.exists) {
        return { success: false, error: "Cattle not found on blockchain" };
      }
      
      return {
        success: true,
        data: {
          rfid: result.rfid,
          breed: result.breed,
          gender: ["Male", "Female", "Calf"][Number(result.gender)],
          registrationTimestamp: Number(result.registrationTimestamp),
          currentOwnerCNIC: result.currentOwnerCNIC,
          currentOwnerName: result.currentOwnerName,
        },
      };
    } catch (error: any) {
      console.error("❌ Blockchain query error:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Add vaccination record to blockchain
   */
  async addVaccination(data: {
    rfid: string;
    vaccineName: string;
    vaccinationDate: Date;
  }): Promise<{ success: boolean; txHash?: string; error?: string }> {
    if (!this.isEnabled()) {
      return { success: false, error: "Blockchain service not enabled" };
    }

    try {
      const timestamp = Math.floor(data.vaccinationDate.getTime() / 1000);
      const tempTxHash = ethers.id(`${data.rfid}-vac-${Date.now()}`).slice(0, 66);
      
      const tx = await this.contract!.addVaccination(
        data.rfid,
        data.vaccineName,
        timestamp,
        tempTxHash,
        { gasLimit: blockchainConfig.gasLimit }
      );
      
      console.log(`⏳ Adding vaccination for ${data.rfid} on blockchain...`);
      const receipt = await tx.wait();
      
      console.log(`✅ Vaccination added on blockchain: ${receipt.hash}`);
      
      return {
        success: true,
        txHash: receipt.hash,
      };
    } catch (error: any) {
      console.error("❌ Blockchain vaccination error:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get vaccination history from blockchain
   */
  async getVaccinations(rfid: string): Promise<{
    success: boolean;
    data?: any[];
    error?: string;
  }> {
    if (!this.isEnabled()) {
      return { success: false, error: "Blockchain service not enabled" };
    }

    try {
      const vaccinations = await this.contract!.getVaccinations(rfid);
      
      return {
        success: true,
        data: vaccinations.map((v: any) => ({
          vaccineName: v.vaccineName,
          vaccinationDate: new Date(Number(v.vaccinationDate) * 1000),
          recordedAt: new Date(Number(v.recordedAt) * 1000),
        })),
      };
    } catch (error: any) {
      console.error("❌ Blockchain query error:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Transfer cattle ownership on blockchain
   */
  async transferOwnership(data: {
    rfid: string;
    newOwnerCNIC: string;
    newOwnerName: string;
  }): Promise<{ success: boolean; txHash?: string; error?: string }> {
    if (!this.isEnabled()) {
      return { success: false, error: "Blockchain service not enabled" };
    }

    try {
      const tempTxHash = ethers.id(`${data.rfid}-transfer-${Date.now()}`).slice(0, 66);
      
      const tx = await this.contract!.transferOwnership(
        data.rfid,
        data.newOwnerCNIC,
        data.newOwnerName,
        tempTxHash,
        { gasLimit: blockchainConfig.gasLimit }
      );
      
      console.log(`⏳ Transferring ownership of ${data.rfid} on blockchain...`);
      const receipt = await tx.wait();
      
      console.log(`✅ Ownership transferred on blockchain: ${receipt.hash}`);
      
      return {
        success: true,
        txHash: receipt.hash,
      };
    } catch (error: any) {
      console.error("❌ Blockchain transfer error:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get ownership history from blockchain
   */
  async getOwnershipHistory(rfid: string): Promise<{
    success: boolean;
    data?: any[];
    error?: string;
  }> {
    if (!this.isEnabled()) {
      return { success: false, error: "Blockchain service not enabled" };
    }

    try {
      const history = await this.contract!.getOwnershipHistory(rfid);
      
      return {
        success: true,
        data: history.map((h: any) => ({
          ownerCNIC: h.ownerCNIC,
          ownerName: h.ownerName,
          timestamp: new Date(Number(h.timestamp) * 1000),
        })),
      };
    } catch (error: any) {
      console.error("❌ Blockchain query error:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Set heritage information on blockchain
   */
  async setHeritage(data: {
    rfid: string;
    fatherRfid: string;
    motherRfid: string;
    certification: string;
  }): Promise<{ success: boolean; txHash?: string; error?: string }> {
    if (!this.isEnabled()) {
      return { success: false, error: "Blockchain service not enabled" };
    }

    try {
      const tempTxHash = ethers.id(`${data.rfid}-heritage-${Date.now()}`).slice(0, 66);
      
      const tx = await this.contract!.setHeritage(
        data.rfid,
        data.fatherRfid,
        data.motherRfid,
        data.certification,
        tempTxHash,
        { gasLimit: blockchainConfig.gasLimit }
      );
      
      console.log(`⏳ Setting heritage for ${data.rfid} on blockchain...`);
      const receipt = await tx.wait();
      
      console.log(`✅ Heritage set on blockchain: ${receipt.hash}`);
      
      return {
        success: true,
        txHash: receipt.hash,
      };
    } catch (error: any) {
      console.error("❌ Blockchain heritage error:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get heritage information from blockchain
   */
  async getHeritage(rfid: string): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    if (!this.isEnabled()) {
      return { success: false, error: "Blockchain service not enabled" };
    }

    try {
      const result = await this.contract!.getHeritage(rfid);
      
      if (!result.exists) {
        return { success: false, error: "Heritage not found on blockchain" };
      }
      
      return {
        success: true,
        data: {
          fatherRfid: result.fatherRfid,
          motherRfid: result.motherRfid,
          certification: result.certification,
        },
      };
    } catch (error: any) {
      console.error("❌ Blockchain query error:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get transaction URL for explorer
   */
  getTransactionUrl(txHash: string): string {
    return `${blockchainConfig.network.explorerUrl}/tx/${txHash}`;
  }

  /**
   * Get contract URL for explorer
   */
  getContractUrl(): string {
    return `${blockchainConfig.network.explorerUrl}/address/${blockchainConfig.cattleRegistryAddress}`;
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService();
