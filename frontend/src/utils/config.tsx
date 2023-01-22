import { ethers } from "ethers";

// Alchemy keys
// Mainnet: gXLumW8PNRWtrmcTIcMXSnMnQY_UnQpY
// Optimism: NAIFm3fALSbcksgIFr3P4Ku6_SqEeYQJ

const providers: {
    [chainId: number]: ethers.providers.AlchemyProvider
} = {
    1: new ethers.providers.AlchemyProvider(1, "gXLumW8PNRWtrmcTIcMXSnMnQY_UnQpY"),
    10: new ethers.providers.AlchemyProvider(10, "NAIFm3fALSbcksgIFr3P4Ku6_SqEeYQJ"),
}

const multiCalls = {
    1: "0xeefba1e63905ef1d7acba5a8513c70307c1ce441",
    10: "0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821",
}

// TODO: Implement the use of the allow list of tokens

const tokens: {
    address: `0x${string}`,
    chainId: number,
    name: string,
    symbol: string,
}[] = [{
    address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
    chainId: 1,
    name: "Maker",
    symbol: "MKR",
}]

const MULTICALL_ABI = [
    "function aggregate((address, bytes)[] calls) view returns (uint256 blockNumber, bytes[] returnData)",
]

const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint)",
    "function transfer(address to, uint amount)",
]

export { providers, multiCalls, tokens, MULTICALL_ABI, ERC20_ABI }