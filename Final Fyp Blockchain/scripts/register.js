const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🐄 Cattle Registration Script (CNIC Version)\n");

  // Load deployed addresses
  let addresses;
  try {
    addresses = JSON.parse(fs.readFileSync("deployed-addresses.json", "utf8"));
    console.log("✅ Loaded deployed addresses from deployed-addresses.json");
  } catch (error) {
    console.error("❌ Error: deployed-addresses.json not found!");
    console.error("   Please run: npx hardhat run scripts/deploy.js");
    process.exit(1);
  }

  const registryAddress = addresses.registry;
  console.log("📋 Registry Address:", registryAddress, "\n");

  // Get signer
  const [signer] = await hre.ethers.getSigners();
  console.log("👤 Using account:", signer.address, "\n");

  // Connect to CattleRegistry
  const CattleRegistry = await hre.ethers.getContractAt("CattleRegistry", registryAddress);

  // Cattle data to register
  const cattleData = {
    rfid: "RFID-REG-" + Date.now(),
    breed: "Sahiwal",
    gender: 1,
    ownerCNIC: "42101-1234567-8", // CNIC format: 5 digits - 7 digits - 1 digit
    ownerName: "Ahmed Khan"
  };

  console.log("=".repeat(60));
  console.log("REGISTERING NEW CATTLE");
  console.log("=".repeat(60));
  console.log("RFID:", cattleData.rfid);
  console.log("Breed:", cattleData.breed);
  console.log("Gender:", ["Male", "Female", "Calf"][cattleData.gender]);
  console.log("Owner:", cattleData.ownerName);
  console.log("Owner CNIC:", cattleData.ownerCNIC);
  console.log("=".repeat(60));

  try {
    console.log("\n⏳ Registering cattle...");
    
    const tx = await CattleRegistry.registerCattle(
      cattleData.rfid,
      cattleData.breed,
      cattleData.gender,
      cattleData.ownerCNIC,
      cattleData.ownerName
    );

    console.log("📝 Transaction Hash:", tx.hash);
    console.log("⏳ Waiting for confirmation...");
    
    const receipt = await tx.wait();
    
    console.log("\n✅ SUCCESS! Cattle registered on blockchain");
    console.log("📦 Block Number:", receipt.blockNumber);
    console.log("💰 Gas Used:", receipt.gasUsed.toString());

    // Verify registration
    console.log("\n🔍 Verifying registration...");
    const isRegistered = await CattleRegistry.isCattleRegistered(cattleData.rfid);
    
    if (isRegistered) {
      console.log("✅ Verification Passed - Cattle is registered!");
      
      // Retrieve and display cattle info
      const cattleInfo = await CattleRegistry.getCattle(cattleData.rfid);
      
      const genderMap = {0: "Male", 1: "Female", 2: "Calf"};
      
      console.log("\n🐮 Registered Cattle Details:");
      console.log("   RFID:", cattleInfo.rfid);
      console.log("   Breed:", cattleInfo.breed);
      console.log("   Gender:", genderMap[Number(cattleInfo.gender)]);
      console.log("   Owner Name:", cattleInfo.currentOwnerName);
      console.log("   Owner CNIC:", cattleInfo.currentOwnerCNIC);
      console.log("   Registered At:", new Date(Number(cattleInfo.registrationTimestamp) * 1000).toLocaleString());
    } else {
      console.log("❌ Verification Failed - Cattle not found");
    }

    console.log("\n" + "=".repeat(60));
    console.log("✅ Registration completed successfully!");
    console.log("=".repeat(60));

  } catch (error) {
    console.error("\n❌ Registration failed!");
    console.error("Error:", error.message);
    
    if (error.data) {
      console.error("Error data:", error.data);
    }
    
    console.error("\n🔧 Troubleshooting tips:");
    console.error("   1. Ensure contracts are deployed on the network");
    console.error("   2. Check you're using the correct network");
    console.error("   3. Verify you have enough balance for gas fees");
    console.error("   4. Check that the registry address is correct");
    
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Script failed:");
    console.error(error);
    process.exit(1);
  });