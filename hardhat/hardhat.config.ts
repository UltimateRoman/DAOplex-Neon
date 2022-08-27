import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const proxy_url = 'https://proxy.devnet.neonlabs.org/solana';
const network_id = 245022926;
const deployerPrivateKey = process.env.PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [deployerPrivateKey as any],
      blockGasLimit: 30000000
    },
    hardhat: {
      forking: {
        enabled: true,
        url: "https://proxy.devnet.neonlabs.org/solana",
        blockNumber: 157966224
      },
      mining: {
        auto: true
      }
    },
    neonlabs: {
      url: proxy_url,
      accounts: [deployerPrivateKey as any],
      chainId: network_id,
      gas: 3000000,
      gasPrice: 1000000000,
      blockGasLimit: 10000000,
      allowUnlimitedContractSize: false,
      timeout: 1000000
    }
  }
};

export default config;
