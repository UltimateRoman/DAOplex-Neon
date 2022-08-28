import { ethers } from "hardhat";

async function main() {
  const DAOToken = await ethers.getContractFactory("DAOToken");
  const daoToken = await DAOToken.deploy();
  await daoToken.deployed();
  console.log("Deployed DAOToken contract at: ", daoToken.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});