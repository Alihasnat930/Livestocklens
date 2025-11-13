const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🐄 Cattle Registry - Complete Demo\n");

  const addresses = JSON.parse(fs.readFileSync("deployed-addresses.json", "utf8"));
  console.log("📋 Registry:", addresses.registry);

  const [owner] = await hre.ethers.getSigners();
  console.log("👤 Account:", owner.address, "\n");

  const CattleRegistry = await hre.ethers.getContractFactory("CattleRegistry");
  const Registry = CattleRegistry.attach(addresses.registry);

  console.log("=".repeat(70));
  console.log("COMPLETE CATTLE LIFECYCLE DEMO");
  console.log("=".repeat(70));

  const rfid = "RFID-DEMO-" + Date.now();
  const genderMap = { 0: "Male", 1: "Female", 2: "Calf" };

  try {
    // 1. Register cattle
    console.log("\n1️⃣ REGISTERING CATTLE...");
    const tx1 = await Registry.registerCattle(
      rfid,
      "Sahiwal",
      1,
      owner.address,
      "Farm Owner"
    );
    await tx1.wait();
    console.log("✅ Cattle registered:", rfid);

    // 2. Get cattle info
    console.log("\n2️⃣ CATTLE DETAILS...");
    const cattle = await Registry.getCattle(rfid);
    console.log("   RFID:", cattle.rfid);
    console.log("   Breed:", cattle.breed);
    console.log("   Gender:", genderMap[Number(cattle.gender)]);
    console.log("   Owner:", cattle.currentOwnerName);
    console.log("   Registered:", new Date(Number(cattle.registrationTimestamp) * 1000).toLocaleString());

    // 3. Set heritage
    console.log("\n3️⃣ SETTING HERITAGE...");
    const tx2 = await Registry.setHeritage(
      rfid,
      "FATHER-001",
      "MOTHER-001",
      "Pure Breed Certified"
    );
    await tx2.wait();
    console.log("✅ Heritage set");

    const heritage = await Registry.getHeritage(rfid);
    console.log("\n📋 HERITAGE DETAILS:");
    console.log("   Father RFID:", heritage.fatherRfid);
    console.log("   Mother RFID:", heritage.motherRfid);
    console.log("   Certification:", heritage.certification);

    // 4. Add vaccinations
    console.log("\n4️⃣ ADDING VACCINATIONS...");
    const today = Math.floor(Date.now() / 1000);
    const vaccines = [
      { name: "FMD Vaccine", date: today - 86400 * 30 },
      { name: "Brucellosis Vaccine", date: today - 86400 * 15 },
      { name: "Anthrax Vaccine", date: today }
    ];

    for (const vacc of vaccines) {
      const tx = await Registry.addVaccination(rfid, vacc.name, vacc.date);
      await tx.wait();
      console.log(`✅ Added: ${vacc.name}`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const vaccinations = await Registry.getVaccinations(rfid);
    console.log("\n💉 VACCINATION RECORDS (STORED ON BLOCKCHAIN):");
    console.log("=" .repeat(70));
    vaccinations.forEach((v, i) => {
      console.log(`\n   VACCINE #${i + 1}`);
      console.log(`   Name: ${v.vaccineName}`);
      console.log(`   Vaccination Date: ${new Date(Number(v.vaccinationDate) * 1000).toLocaleDateString()}`);
      console.log(`   Recorded At: ${new Date(Number(v.recordedAt) * 1000).toLocaleString()}`);
    });

    // 5. Transfer ownership
    console.log("\n\n5️⃣ TRANSFERRING OWNERSHIP...");
    const newOwnerAddr = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    const tx3 = await Registry.transferOwnership(
      rfid,
      newOwnerAddr,
      "John Smith"
    );
    await tx3.wait();
    console.log("✅ Ownership transferred");

    const ownership = await Registry.getOwnershipHistory(rfid);
    console.log("\n📜 OWNERSHIP RECORDS (STORED ON BLOCKCHAIN):");
    console.log("=".repeat(70));
    ownership.forEach((o, i) => {
      console.log(`\n   OWNER #${i + 1} ${i === ownership.length - 1 ? '(CURRENT)' : '(PREVIOUS)'}`);
      console.log(`   Name: ${o.ownerName}`);
      console.log(`   Address: ${o.ownerAddress}`);
      console.log(`   Transfer Date: ${new Date(Number(o.timestamp) * 1000).toLocaleString()}`);
    });

    // 6. Add more vaccinations
    console.log("\n\n6️⃣ ADDING MORE VACCINATIONS...");
    const tx4 = await Registry.addVaccination(rfid, "Blackleg Vaccine", today);
    await tx4.wait();
    console.log("✅ Added: Blackleg Vaccine");

    const vaccinations2 = await Registry.getVaccinations(rfid);
    console.log("\n💉 UPDATED VACCINATION RECORDS (STORED ON BLOCKCHAIN):");
    console.log("=".repeat(70));
    vaccinations2.forEach((v, i) => {
      console.log(`\n   VACCINE #${i + 1}`);
      console.log(`   Name: ${v.vaccineName}`);
      console.log(`   Vaccination Date: ${new Date(Number(v.vaccinationDate) * 1000).toLocaleDateString()}`);
      console.log(`   Recorded At: ${new Date(Number(v.recordedAt) * 1000).toLocaleString()}`);
    });

    console.log("\n" + "=".repeat(70));
    console.log("✅ ALL DATA STORED ON BLOCKCHAIN SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\n📊 SUMMARY:");
    console.log(`   Total Vaccinations: ${vaccinations2.length} (with names & timestamps)`);
    console.log(`   Total Ownership Transfers: ${ownership.length} (with names & timestamps)`);
    console.log(`   Heritage: Father, Mother & Certification names stored`);

  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("\nFull error:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Failed:", error);
    process.exit(1);
  });