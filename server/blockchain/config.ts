// Blockchain configuration for Polygon Amoy testnet
export const blockchainConfig = {
  // Contract addresses from deployment
  cattleRegistryAddress: "0x3Fe4a2EDFdA338B049331bee4a66F500A2e9682a",
  
  // Network configuration
  network: {
    name: "polygon_amoy",
    chainId: 80002,
    rpcUrl: process.env.POLYGON_RPC_URL || "https://rpc-amoy.polygon.technology",
    explorerUrl: "https://amoy.polygonscan.com",
  },
  
  // Wallet configuration
  privateKey: process.env.BLOCKCHAIN_PRIVATE_KEY || "",
  
  // Gas settings
  gasLimit: 500000,
  
  // Feature flags
  enabled: process.env.BLOCKCHAIN_ENABLED === "true",
};

// ABI for CattleRegistry contract (minimal interface)
export const cattleRegistryABI = [
  // Register cattle
  "function registerCattle(string _rfid, string _breed, uint8 _gender, string _ownerCNIC, string _ownerName, string _txHash) external",
  
  // Get cattle info
  "function getCattle(string _rfid) external view returns (string rfid, string breed, uint8 gender, uint256 registrationTimestamp, string currentOwnerCNIC, string currentOwnerName, bool exists)",
  
  // Add vaccination
  "function addVaccination(string _rfid, string _vaccineName, uint256 _vaccinationDate, string _txHash) external",
  
  // Get vaccinations
  "function getVaccinations(string _rfid) external view returns (tuple(string vaccineName, uint256 vaccinationDate, uint256 recordedAt)[])",
  
  // Transfer ownership
  "function transferOwnership(string _rfid, string _newOwnerCNIC, string _newOwnerName, string _txHash) external",
  
  // Get ownership history
  "function getOwnershipHistory(string _rfid) external view returns (tuple(string ownerCNIC, string ownerName, uint256 timestamp)[])",
  
  // Set heritage
  "function setHeritage(string _rfid, string _fatherRfid, string _motherRfid, string _certification, string _txHash) external",
  
  // Get heritage
  "function getHeritage(string _rfid) external view returns (string fatherRfid, string motherRfid, string certification, bool exists)",
  
  // Events
  "event CattleRegistered(string rfid, string breed, uint8 gender, string ownerCNIC, string ownerName, uint256 timestamp)",
  "event VaccinationAdded(string rfid, string vaccineName, uint256 vaccinationDate, uint256 timestamp)",
  "event OwnershipTransferred(string rfid, string newOwnerCNIC, string newOwnerName, uint256 timestamp)",
  "event HeritageSet(string rfid, string fatherRfid, string motherRfid, string certification, uint256 timestamp)"
];
