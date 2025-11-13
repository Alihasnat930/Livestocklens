const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("📜 Ownership History Interaction Script\n");

  // Load deployed addresses
  let addresses;
  try {
    addresses = JSON.parse(fs.readFileSync("deployed-addresses.json", "utf8"));
  } catch (error) {
    console.error("❌ Error: deployed-addresses.json not found!");
    console.error("   Please run: npx hardhat run scripts/deploy.js --network amoy");
    process.exit(1);
  }

  const [owner] = await hre.ethers.getSigners();
  console.log("👤 Using account:", owner.address);
  console.log("📍 Registry:", addresses.registry, "\n");

  const Ownership = await hre.ethers.getContractAt("Ownership", addresses.ownership);
  const Registry = await hre.ethers.getContractAt("CattleRegistry", addresses.registry);

  const rfid = "RFID-12345";

  console.log("=".repeat(60));
  console.log("OWNERSHIP MANAGEMENT DEMO");
  console.log("=".repeat(60));

  try {
    // Step 1: Register a cattle first
    console.log("\n1️⃣ REGISTERING CATTLE...");
    
    const isCattleRegistered = await Registry.isCattleRegistered(rfid);
    
    if (!isCattleRegistered) {
      const tx0 = await Registry.registerCattle(
        rfid,
        "Sahiwal",
        1,  // Female
        owner.address,
        "Initial Owner"
      );
      await tx0.wait();
      console.log("✅ Cattle registered:", rfid);
    } else {
      console.log("✅ Cattle already registered:", rfid);
    }

    // Step 2: Get current owner
    console.log("\n2️⃣ GETTING CURRENT OWNER...");
    const currentOwner = await Ownership.getCurrentOwner(rfid);
    console.log("   Current Owner Address:", currentOwner[0]);
    console.log("   Current Owner Name:", currentOwner[1]);

    // Step 3: Get ownership count
    console.log("\n3️⃣ GETTING OWNERSHIP COUNT...");
    const ownershipCount = await Ownership.getOwnershipCount(rfid);
    console.log("   Total Owner Records:", ownershipCount.toString());

    // Step 4: Display full ownership history
    console.log("\n4️⃣ FULL OWNERSHIP HISTORY...");
    const history = await Ownership.getOwnershipHistory(rfid);
    
    if (history.length === 0) {
      console.log("   No ownership history found");
    } else {
      history.forEach((record, index) => {
        const timestamp = Number(record.timestamp);
        const date = new Date(timestamp * 1000).toLocaleString();
        console.log(`\n   Record #${index + 1}`);
        console.log(`   └─ Owner Address: ${record.ownerAddress}`);
        console.log(`   └─ Owner Name: ${record.ownerName}`);
        console.log(`   └─ Date: ${date}`);
      });
    }

    // Step 5: Get specific owner by index (if history exists)
    if (history.length > 0) {
      console.log("\n5️⃣ GETTING SPECIFIC OWNER BY INDEX...");
      const specificOwner = await Ownership.getOwnerByIndex(rfid, 0);
      console.log(`   First Owner:`);
      console.log(`   └─ Address: ${specificOwner[0]}`);
      console.log(`   └─ Name: ${specificOwner[1]}`);
      console.log(`   └─ Date: ${new Date(Number(specificOwner[2]) * 1000).toLocaleString()}`);
    }

    console.log("\n" + "=".repeat(60));
    console.log("✅ Ownership interaction completed successfully!");
    console.log("=".repeat(60));

  } catch (error) {
    console.error("\n❌ Error occurred:");
    console.error(error.message);
    
    if (error.data) {
      console.error("Error data:", error.data);
    }
    
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