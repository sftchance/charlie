require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");

require("dotenv").config();

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
  gasReporter: {
    enabled: true,
    currency: 'USD',
    gasPrice: 20,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    showMethodSig: true,
    showTimeSpent: true,
  },
  sepolia: {
    url: `https://rpc.sepolia.org/`,
    accounts: [`0x${process.env.SEPOLIA_PRIVATE_KEY}`],
    gasPrice: 50000000000, // 50 gwei
  },
  mainnet: {
    url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
    accounts: [`0x${process.env.ETHEREUM_PRIVATE_KEY}`],
    gasPrice: 50000000000, // 50 gwei
  },
};
