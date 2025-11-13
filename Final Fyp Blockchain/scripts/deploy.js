const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🔧 Deploying Cattle Registry (CNIC Version)\n");

  // Force recompile
  console.log("Step 1: Cleaning artifacts...");
  if (fs.existsSync("artifacts")) {
    fs.rmSync("artifacts", { recursive: true, force: true });
    console.log("✅ Artifacts cleaned");
  }
  if (fs.existsSync("cache")) {
    fs.rmSync("cache", { recursive: true, force: true });
    console.log("✅ Cache cleaned");
  }

  console.log("\nStep 2: Force recompilation...");
  await hre.run("compile", { force: true });
  console.log("✅ Recompilation complete");

  console.log("\n" + "=".repeat(70));
  console.log("DEPLOYING CONTRACT");
  console.log("=".repeat(70));

  const [deployer] = await hre.ethers.getSigners();
  console.log("👤 Deployer:", deployer.address);

  try {
    console.log("\nDeploying CattleRegistry...");
    const CattleRegistry = await hre.ethers.getContractFactory("CattleRegistry");
    const registry = await CattleRegistry.deploy();
    await registry.waitForDeployment();
    const registryAddr = registry.target;
    console.log("✅ Deployed at:", registryAddr);

    // Save addresses
    const network = await hre.ethers.provider.getNetwork();
    const addresses = {
      registry: registryAddr,
      deployer: deployer.address,
      network: hre.network.name,
      chainId: network.chainId.toString(),
      deployedAt: new Date().toISOString()
    };

    fs.writeFileSync("deployed-addresses.json", JSON.stringify(addresses, null, 2));
    fs.writeFileSync("deployed-address.txt", registryAddr);
    console.log("✅ Addresses saved");

    console.log("\n" + "=".repeat(70));
    console.log("TESTING NEW DEPLOYMENT");
    console.log("=".repeat(70));

    const testRfid = "TEST-" + Date.now();
    
    console.log("\n✏️  Registering test cattle...");
    const tx1 = await registry.registerCattle(
      testRfid,
      "Sahiwal",
      1,
      "42101-1234567-8", // CNIC format
      "Test Owner"
    );
    await tx1.wait();
    console.log("✅ Registered:", testRfid);

    console.log("\n🔍 Checking if registered...");
    const isReg = await registry.isCattleRegistered(testRfid);
    console.log("✅ Is registered:", isReg);

    if (!isReg) {
      console.error("❌ Something is wrong - cattle not registered");
      process.exit(1);
    }

    console.log("\n📋 Getting cattle details...");
    const cattle = await registry.getCattle(testRfid);
    console.log("✅ Got cattle successfully!");
    console.log("   RFID:", cattle.rfid);
    console.log("   Breed:", cattle.breed);
    console.log("   Owner Name:", cattle.currentOwnerName);
    console.log("   Owner CNIC:", cattle.currentOwnerCNIC);

    console.log("\n" + "=".repeat(70));
    console.log("✅ ALL TESTS PASSED - CONTRACT IS WORKING");
    console.log("=".repeat(70));

  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.error("\nFull error:");
    console.error(error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });