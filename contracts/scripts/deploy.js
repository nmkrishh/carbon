const hre = require("hardhat");

async function main() {
  console.log("Deploying CarbonCredit contract...");

  const CarbonCredit = await hre.ethers.getContractFactory("CarbonCredit");
  const contract = await CarbonCredit.deploy();

  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log("CarbonCredit deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
