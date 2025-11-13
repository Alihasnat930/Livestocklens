const hre = require("hardhat");

async function main() {
  console.log("🔍 Testing Amoy Contract Connection\n");
  console.log("=".repeat(70));

  const CONTRACT_ADDRESS = "0x3Fe4a2EDFdA338B049331bee4a66F500A2e9682a"; // your deployed address

  const [deployer] = await hre.ethers.getSigners();
  console.log("👤 Using account:", deployer.address);

  const provider = hre.ethers.provider;
  const contract = await hre.ethers.getContractAt("CattleRegistry", CONTRACT_ADDRESS);

  const latestBlock = await provider.getBlockNumber();
  const BATCH_SIZE = 5000;

  console.log("🌐 Latest block:", latestBlock);

  let fromBlock = latestBlock - 20000;
  if (fromBlock < 0) fromBlock = 0;

  // Utility function for batched event fetching
  async function fetchEventsInBatches(contract, eventName, startBlock, endBlock, batchSize = 5000) {
    let events = [];
    let from = startBlock;

    while (from <= endBlock) {
      const to = Math.min(from + batchSize - 1, endBlock);
      try {
        const batchEvents = await contract.queryFilter(eventName, from, to);
        events = events.concat(batchEvents);
      } catch (err) {
        console.error(`❌ Error fetching ${eventName} from ${from} → ${to}:`, err.message);
      }
      from = to + 1;
    }
    return events;
  }

  // Fetch all events
  const registeredEvents = await fetchEventsInBatches(contract, "CattleRegistered", fromBlock, latestBlock, BATCH_SIZE);
  const ownershipEvents = await fetchEventsInBatches(contract, "OwnershipTransferred", fromBlock, latestBlock, BATCH_SIZE);
  const vaccinationEvents = await fetchEventsInBatches(contract, "VaccinationAdded", fromBlock, latestBlock, BATCH_SIZE);

  console.log(`\n✅ Total CattleRegistered Events Found: ${registeredEvents.length}\n`);

  // Arrays to store all TX IDs
  let registrationTXs = [];
  let ownershipTXs = [];
  let vaccinationTXs = [];

  // Map ownership and vaccination TXs by RFID for easy lookup
  const ownershipMap = {};
  ownershipEvents.forEach(e => {
    const rfid = e.args?.rfid;
    if (!ownershipMap[rfid]) ownershipMap[rfid] = [];
    ownershipMap[rfid].push({ tx: e.transactionHash, owner: e.args?.newOwnerName, cnic: e.args?.newOwnerCNIC, timestamp: e.args?.timestamp });
    ownershipTXs.push(e.transactionHash);
  });

  const vaccinationMap = {};
  vaccinationEvents.forEach(e => {
    const rfid = e.args?.rfid;
    if (!vaccinationMap[rfid]) vaccinationMap[rfid] = [];
    vaccinationMap[rfid].push({ tx: e.transactionHash, vaccineName: e.args?.vaccineName, vaccinationDate: e.args?.vaccinationDate, recordedAt: e.args?.recordedAt });
    vaccinationTXs.push(e.transactionHash);
  });

  // Process each registered cattle
  for (const event of registeredEvents) {
    try {
      const rfid = event.args?.rfid;
      if (!rfid) continue;

      // Registration TX
      registrationTXs.push(event.transactionHash);

      // Get full data
      const cattle = await contract.getCattle(rfid);
      const heritage = await contract.getHeritage(rfid);

      console.log("📋 =========================");
      console.log(`RFID: ${cattle.rfid}`);
      console.log(`Breed: ${cattle.breed}`);
      console.log(`Gender: ${["Male", "Female", "Calf"][cattle.gender]}`);
      console.log(`Current Owner: ${cattle.currentOwnerName} (${cattle.currentOwnerCNIC})`);
      console.log(`Registered At: ${new Date(Number(cattle.registrationTimestamp) * 1000).toLocaleString()}`);
      console.log(`Registration TX: ${event.transactionHash}`);

      // Heritage info
      if (heritage.exists) {
        console.log("Heritage Info:");
        console.log(`  Father RFID: ${heritage.fatherRfid}`);
        console.log(`  Mother RFID: ${heritage.motherRfid}`);
        console.log(`  Certification: ${heritage.certification}`);
      } else {
        console.log("Heritage Info: Not provided");
      }

      // Ownership history
      console.log("\nOwnership History:");
      if (!ownershipMap[rfid] || ownershipMap[rfid].length === 0) {
        console.log("  None");
      } else {
        ownershipMap[rfid].forEach((o, idx) => {
          console.log(`  ${idx + 1}. ${o.owner} (${o.cnic}) at ${new Date(Number(o.timestamp) * 1000).toLocaleString()} [TX: ${o.tx}]`);
        });
      }

      // Vaccinations
      console.log("\nVaccinations:");
      if (!vaccinationMap[rfid] || vaccinationMap[rfid].length === 0) {
        console.log("  None");
      } else {
        vaccinationMap[rfid].forEach((v, idx) => {
          console.log(`  ${idx + 1}. ${v.vaccineName} on ${new Date(Number(v.vaccinationDate) * 1000).toLocaleDateString()} (Recorded at ${new Date(Number(v.recordedAt) * 1000).toLocaleString()}) [TX: ${v.tx}]`);
        });
      }

      console.log("\n");
    } catch (err) {
      console.error(`❌ Failed to fetch data for RFID: ${event.args?.rfid}`, err.message);
    }
  }

  // Display all TXs at the end
  console.log("🗂️ All Transaction IDs Collected:");
  console.log("📌 Registration TXs:");
  registrationTXs.forEach((tx, idx) => console.log(`  ${idx + 1}. ${tx}`));

  console.log("\n📌 Ownership TXs:");
  ownershipTXs.forEach((tx, idx) => console.log(`  ${idx + 1}. ${tx}`));

  console.log("\n📌 Vaccination TXs:");
  vaccinationTXs.forEach((tx, idx) => console.log(`  ${idx + 1}. ${tx}`));

  console.log("\n✅ DONE");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
