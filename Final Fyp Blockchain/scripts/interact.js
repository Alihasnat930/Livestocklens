const hre = require("hardhat");
const readline = require("readline-sync");

async function main() {
  console.log("🔍 Interactive Cattle Registry CLI\n");

  // Ask for contract address
  const CONTRACT_ADDRESS = readline.question("Enter CattleRegistry contract address: ");

  const [deployer] = await hre.ethers.getSigners();
  console.log("👤 Using account:", deployer.address);

  const contract = await hre.ethers.getContractAt("CattleRegistry", CONTRACT_ADDRESS);

  while (true) {
    console.log("\n=== Menu ===");
    console.log("1. Register New Cattle");
    console.log("2. Get Cattle Details by RFID");
    console.log("3. Check if RFID is Registered");
    console.log("4. Add Vaccination");
    console.log("5. Transfer Ownership");
    console.log("0. Exit");

    const choice = readline.questionInt("Enter choice: ");

    if (choice === 0) break;

    switch (choice) {
      case 1: {
    const rfid = readline.question("Enter RFID: ");
    const breed = readline.question("Enter Breed: ");
    const gender = readline.questionInt("Enter Gender (0=Male,1=Female,2=Calf): ");
    const ownerName = readline.question("Enter Owner Name: ");
    const ownerCNIC = readline.question("Enter Owner CNIC: ");

    // Optional heritage info
    let fatherRfid = "", motherRfid = "", certification = "";
    const heritage = readline.question("Add heritage info? (yes/no): ").toLowerCase();
    if (heritage === "yes") {
        fatherRfid = readline.question("Father RFID: ");
        motherRfid = readline.question("Mother RFID: ");
        certification = readline.question("Certification: ");
    }

    try {
        // Register cattle
        const tx = await contract.registerCattle(rfid, breed, gender, ownerCNIC, ownerName);
        await tx.wait();
        console.log(`✅ Cattle ${rfid} registered!`);

        // Set heritage if provided
        if (heritage === "yes") {
            const tx2 = await contract.setHeritage(rfid, fatherRfid, motherRfid, certification);
            await tx2.wait();
            console.log(`✅ Heritage set for ${rfid}`);
        }
    } catch (err) {
        console.error("❌ Registration failed:", err.message);
    }
    break;
}

      case 2: {
        // Get cattle details
        const rfid = readline.question("Enter RFID: ");
        try {
          const cattle = await contract.getCattle(rfid);
          console.log("\n📋 Cattle Details:");
          console.log(`RFID: ${cattle.rfid}`);
          console.log(`Breed: ${cattle.breed}`);
          console.log(`Gender: ${["Male","Female","Calf"][cattle.gender]}`);
          console.log(`Owner: ${cattle.currentOwnerName} (${cattle.currentOwnerCNIC})`);
        } catch (err) {
          console.error("❌ Failed to fetch cattle:", err.message);
        }
        break;
      }

      case 3: {
        // Check registration
        const rfid = readline.question("Enter RFID: ");
        try {
          const exists = await contract.isCattleRegistered(rfid);
          console.log(`\n❗ Is registered: ${exists}`);
        } catch (err) {
          console.error("❌ Failed to check registration:", err.message);
        }
        break;
      }

      case 4: {
        // Add vaccination
        const rfid = readline.question("Enter Cattle RFID: ");
        const vaccineName = readline.question("Enter Vaccine Name: ");
        const vaccinationDate = readline.questionInt("Enter Vaccination Date (YYYYMMDD): ");

        try {
          const tx = await contract.addVaccination(rfid, vaccineName, vaccinationDate);
          await tx.wait();
          console.log(`✅ Vaccination added for ${rfid}`);
        } catch (err) {
          console.error("❌ Failed to add vaccination:", err.message);
        }
        break;
      }

      case 5: {
        // Transfer ownership
        const rfid = readline.question("Enter Cattle RFID: ");
        const newOwnerName = readline.question("Enter New Owner Name: ");
        const newOwnerCNIC = readline.question("Enter New Owner CNIC: ");

        try {
          const tx = await contract.transferOwnership(rfid, newOwnerCNIC, newOwnerName);
          await tx.wait();
          console.log(`✅ Ownership transferred for ${rfid}`);
        } catch (err) {
          console.error("❌ Failed to transfer ownership:", err.message);
        }
        break;
      }

      default:
        console.log("❌ Invalid choice!");
    }
  }

  console.log("✅ Exiting CLI");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ ERROR:", error);
    process.exit(1);
  });
