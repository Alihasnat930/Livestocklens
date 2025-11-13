const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("ðŸ” DIAGNOSTIC - Checking CattleRegistry\n");

  const addresses = JSON.parse(fs.readFileSync("deployed-addresses.json", "utf8"));
  const registryAddr = addresses.registry;
  console.log("ðŸ“‹ Registry:", registryAddr, "\n");

  const [owner] = await hre.ethers.getSigners();
  console.log("ðŸ‘¤ Account:", owner.address, "\n");

  const Registry = await hre.ethers.getContractAt("CattleRegistry", registryAddr);

  const rfid = "TEST-RFID-" + Date.now();

  console.log("=".repeat(60));
  console.log("STEP 1: Register cattle");
  console.log("=".repeat(60));

  try {
    const tx1 = await Registry.registerCattle(
      rfid,
      "Sahiwal",
      1,
      owner.address,
      "Test Owner"
    );
    await tx1.wait();
    console.log("âœ… Registered:", rfid);
  } catch (error) {
    console.error("âŒ Registration failed:", error.message);
    process.exit(1);
  }

  console.log("\n=".repeat(60));
  console.log("STEP 2: Check if registered");
  console.log("=".repeat(60));

  try {
    const isRegistered = await Registry.isCattleRegistered(rfid);
    console.log("Is registered?", isRegistered);
    
    if (!isRegistered) {
      console.error("âŒ PROBLEM: Cattle not found after registration!");
      process.exit(1);
    }
  } catch (error) {
    console.error("âŒ Check failed:", error.message);
    process.exit(1);
  }

  console.log("\n=".repeat(60));
  console.log("STEP 3: Call getCattle directly");
  console.log("=".repeat(60));

  try {
    const cattle = await Registry.getCattle(rfid);
    console.log("âœ… Success! Got cattle:");
    console.log("   RFID:", cattle.rfid);
    console.log("   Breed:", cattle.breed);
    console.log("   Gender:", Number(cattle.gender));
    console.log("   Owner Name:", cattle.currentOwnerName);
    console.log("   Owner Address:", cattle.currentOwner);
  } catch (error) {
    console.error("âŒ getCattle failed:", error.message);
    console.error("\nFull error:", error);
    
    // Try to understand what went wrong
    console.log("\n" + "=".repeat(60));
    console.log("DEBUGGING INFO");
    console.log("=".repeat(60));
    console.log("Error code:", error.code);
    console.log("Method:", error.method);
    console.log("Signature:", error.signature);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\nâŒ Script error:", error);
    process.exit(1);
  });