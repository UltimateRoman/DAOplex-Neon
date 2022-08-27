import { ethers } from "hardhat";

async function main() {
  const DAOPlexBond = await ethers.getContractFactory("DAOPlexBond");
  const daoPlexBond = await DAOPlexBond.deploy();
  await daoPlexBond.deployed();
  console.log("Deployed Bond contract at: ", daoPlexBond.address);

  const BondCreator = await ethers.getContractFactory("BondCreator");
  const bondCreator = await BondCreator.deploy();
  await bondCreator.deployed();
  console.log("Deployed BondCreator contract at: ", bondCreator.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
