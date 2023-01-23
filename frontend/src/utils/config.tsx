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

const MULTICALL_ABI = [{"constant":true,"inputs":[],"name":"getCurrentBlockTimestamp","outputs":[{"name":"timestamp","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"components":[{"name":"target","type":"address"},{"name":"callData","type":"bytes"}],"name":"calls","type":"tuple[]"}],"name":"aggregate","outputs":[{"name":"blockNumber","type":"uint256"},{"name":"returnData","type":"bytes[]"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getLastBlockHash","outputs":[{"name":"blockHash","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"getEthBalance","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCurrentBlockDifficulty","outputs":[{"name":"difficulty","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCurrentBlockGasLimit","outputs":[{"name":"gaslimit","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCurrentBlockCoinbase","outputs":[{"name":"coinbase","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"blockNumber","type":"uint256"}],"name":"getBlockHash","outputs":[{"name":"blockHash","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"}]

const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint)",
]

export { providers, multiCalls, MULTICALL_ABI, ERC20_ABI }