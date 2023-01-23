require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require('hardhat-deploy');
require("hardhat-gas-reporter");

require("dotenv").config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("deploy", "Deploys Charlie to the network")
  .addOptionalParam("verify", "Verify the deployed contracts on Etherscan", false, types.boolean)
  .setAction(async (taskArgs, hre) => {
    await hre.run('compile');

    const [deployer] = await ethers.getSigners();
    console.log(`✅ Connected to ${deployer.address}`);

    const chainId = await getChainId()
    console.log('✅ Connected to chain ' + chainId)

    const Charlie = await ethers.getContractFactory("Charlie");
    let charlie = await Charlie.deploy();
    charlie = await charlie.deployed();
    console.log("✅ Charlie Deployed.")
    charlieDeployment = {
      "Deployer": deployer.address,
      "Charlie Address": charlie.address,
      "Remaining ETH Balance": parseInt((await deployer.getBalance()).toString()) / 1000000000000000000,
    }
    console.table(charlieDeployment)

    if (chainId == '31337' || taskArgs.verify === false) return;

    await new Promise(r => setTimeout(r, 30000));
    await hre.run("verify:verify", {
      address: charlie.address,
      constructorArguments: [],
    });

    console.log("✅ Charlie Verified.")
  });

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000000
          }
        }
      }
    ],
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY,
      mainnet: process.env.ETHERSCAN_API_KEY,
      optimisticEthereum: process.env.OP_ETHERSCAN_API_KEY,
      avalanche: process.env.AVA_ETHERSCAN_API_KEY,
    }
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    gasPrice: 20,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    showMethodSig: true,
    showTimeSpent: true,
  },
  networks: {
    sepolia: {
      url: `https://rpc.sepolia.org/`,
      accounts: [`0x${process.env.TEST_PRIVATE_KEY}`],
      gasPrice: 30000000000,
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ETH_ALCHEMY_KEY}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      gasPrice: 30000000000,
    },
    optimism: {
      url: `https://opt-mainnet.g.alchemy.com/v2/${process.env.OP_ALCHEMY_KEY}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      gasPrice: 15000000000,
    },
  }
};
