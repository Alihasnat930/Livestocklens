const hre = require("hardhat");

async function main() {
  const [caller] = await hre.ethers.getSigners();

  const vaccinationAddress = "0x39135c312b8d77a9919786B23615Af48EF4C5135";
  const vaccination = await hre.ethers.getContractAt("Vaccination", vaccinationAddress);

  console.log("Using account:", caller.address);

  const rfid = "RFID12345";
  const vaccineName = "VaccineX";

  const tx = await vaccination.addVaccination(rfid, vaccineName);
  await tx.wait();
  console.log(`Vaccination added for ${rfid}: ${vaccineName}`);

  const count = await vaccination.getVaccinationCount(rfid);
  console.log(`Total vaccinations for ${rfid}: ${count}`);

  console.log(`Vaccination records for ${rfid}:`);
  for (let i = 0; i < count; i++) {
    const record = await vaccination.getVaccination(rfid, i);
    console.log(
      `#${i + 1} Vaccine: ${record[0]}, Date: ${new Date(Number(record[1]) * 1000).toLocaleString()}`
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
