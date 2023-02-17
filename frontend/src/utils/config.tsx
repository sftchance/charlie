import { ethers } from "ethers";

// Alchemy keys
// Mainnet: gXLumW8PNRWtrmcTIcMXSnMnQY_UnQpY
// Optimism: NAIFm3fALSbcksgIFr3P4Ku6_SqEeYQJ

const providers: {
    [chainId: number]: ethers.providers.AlchemyProvider
} = {
    // 1: new ethers.providers.AlchemyProvider(1, "gXLumW8PNRWtrmcTIcMXSnMnQY_UnQpY"),
    10: new ethers.providers.AlchemyProvider(10, "NAIFm3fALSbcksgIFr3P4Ku6_SqEeYQJ"),
}

const multiCalls = {
    // 1: "0xeefba1e63905ef1d7acba5a8513c70307c1ce441",
    10: "0x76D27C4E35314F8B57B92fa9Bf6ab6DE5c9Fddce",
}

const MULTICALL_ABI = [{ "inputs": [{ "internalType": "address", "name": "_authority", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": true, "internalType": "contract Authority", "name": "newAuthority", "type": "address" }], "name": "AuthorityUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "caller", "type": "address" }, { "components": [{ "internalType": "bool", "name": "success", "type": "bool" }, { "internalType": "uint256", "name": "blockNumber", "type": "uint256" }, { "internalType": "bytes", "name": "result", "type": "bytes" }], "indexed": false, "internalType": "struct CharlieHelpers.Response[]", "name": "results", "type": "tuple[]" }], "name": "CharlieCalled", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnerUpdated", "type": "event" }, { "inputs": [{ "components": [{ "internalType": "address", "name": "target", "type": "address" }, { "internalType": "bytes", "name": "callData", "type": "bytes" }], "internalType": "struct CharlieHelpers.Call[]", "name": "_calls", "type": "tuple[]" }, { "internalType": "bool", "name": "_blocking", "type": "bool" }], "name": "aggregate", "outputs": [{ "components": [{ "internalType": "bool", "name": "success", "type": "bool" }, { "internalType": "uint256", "name": "blockNumber", "type": "uint256" }, { "internalType": "bytes", "name": "result", "type": "bytes" }], "internalType": "struct CharlieHelpers.Response[]", "name": "responses", "type": "tuple[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "authority", "outputs": [{ "internalType": "contract Authority", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "blockNumber", "type": "uint256" }], "name": "getBlockHash", "outputs": [{ "internalType": "bytes32", "name": "blockHash", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getCurrentBlockCoinbase", "outputs": [{ "internalType": "address", "name": "coinbase", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getCurrentBlockDifficulty", "outputs": [{ "internalType": "uint256", "name": "difficulty", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getCurrentBlockGasLimit", "outputs": [{ "internalType": "uint256", "name": "gaslimit", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getCurrentBlockTimestamp", "outputs": [{ "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "addr", "type": "address" }], "name": "getEthBalance", "outputs": [{ "internalType": "uint256", "name": "balance", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getLastBlockHash", "outputs": [{ "internalType": "bytes32", "name": "blockHash", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "contract Authority", "name": "newAuthority", "type": "address" }], "name": "setAuthority", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "setOwner", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]

const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint)",
]

export { providers, multiCalls, MULTICALL_ABI, ERC20_ABI }