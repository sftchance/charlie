# Charlie Aggregator

Charlie is built with a very simple focus of improving the governance process on Ethereum. While there are many issues to solve, the first challenge to solve is the delegation of tokens. At this time, there sits an enormous amount of dormant voting power resulting in governance that isn't truly decentralized.

With barriers as high as the heavens, individuals are rarely capable of collecting enough delegation power to have any true say in the governance process.

Charlie aims to fix this and included in the repository is the very basic smart contract needed to do so.

## Running the tests and deploying the contracts

```
npm i
npx hardhat test
npx hardhat accounts
npx hardhat coverage --network hardhat
npx hardhat deploy --network <network_name>
```

## Supported chains

While it would be ideal to support all EVM chains, Charlie is in the MVP phase and first must be proven. If you need another chain that we don't support that means you are helping prove it! Please [open an issue](https://github.com/nftchance/charlie/issues) requesting the chain you'd like to be supported.

- [x] Sepolia
- [x] Ethereum
- [x] Optimism