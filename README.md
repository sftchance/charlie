# Charlie: A Modern Delegation Approach

![Charlie](/frontend/public/frame.png)

Since the beginning of the onchain governance, delegation has remained underutilized resulting in centralized organizations that are controlled by a select few whales.

Charlie is a modern delegation approach that aims to solve this problem by providing a decentralized and fair governance system by streamling the manner in which tokens are delegated to strong representatives.

## How it works

Charlie is a simple and intuitive delegation system that allows users to delegate tokens across a range of protocols and networks with the click of a button.

Instead of having to delegate tokens for each protocol individually, users can delegate their tokens to a single representative who will serve as the best proxy ecosystem-wide.

## Supported Networks

Currently, you can use Charlie to interact with governance tokens across a range of EVM-compatible networks. These networks include:

- Ethereum
- Optimism
- Polygon
- Avalanche
- Arbitrum

## Automated Token Aggregation

Charlie is the first delegation system that allows users to delegate tokens across a range of protocols and networks with the click of a button. To do this, it is powered under the hood by Flipside Crypto's [Query Engine](https://flipsidecrypto.xyz) along with a powerful onchain contract providing a still-decentralized and secure interaction with the system.

The current criteria is applied to all tokens in order to determine if they are eligible for delegation and is as follows:

- The token must support `ERC20Votes`.
- The token must have historical delegations.
  - Automated token detection for Charlie is not designed to seed new tokens, but rather to provide a fair and decentralized governance system for existing tokens.
- The name and symbol of the token must have a length of 2 or more characters.
  - This is to avoid tokens that are not intended for governance, such as test tokens.
- The token must be deployed on one of the supported networks.

The full list of tokens supported by automated aggregation can be found at [/api/erc20/fixtures/erc20.auto.json](/api/erc20/fixtures/erc20.auto.json).

## Adding a Governance Token to Charlie

While Charlie operates with automated aggregation, there may be certain circumstances where a token is not automatically detected. In these cases, you can add the token to the list of supported tokens by following the steps below:

1. Fork the repository.
2. Add your token to the list at [/api/erc20/fixtures/erc20.manual.json](/api/erc20/fixtures/erc20.manual.json).
3. Submit a pull request containing your update.
