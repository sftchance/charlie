import { ethers } from "ethers";

const providers: {
    [chainId: number]: ethers.providers.InfuraProvider
} = {
    1: new ethers.providers.InfuraProvider("homestead", "b9a7c3d3b9a7c3d3b9a7c3d3b9a7c3d3b9a7c3d3b9a7c3d3b9a7c3d3b9a7c3d3b9a7c3d3"),
    4: new ethers.providers.InfuraProvider("rinkeby", "b9a7c3d3b9a7c3d3b9a7c3d3b9a7c3d3b9a7c3d3b9a7c3d3b9a7c3d3b9a7c3d3b9a7c3d3"),
}

const multiCalls = { 
    1: "0xeefba1e63905ef1d7acba5a8513c70307c1ce441",
    4: "0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821",
}

const tokens: {
    address: `0x${string}`,
    chainId: number,
    name: string,
    symbol: string,
}[] = [{
    address: "0x30f3581ef6469334c8752d9b6ca3fb39c72f57f1",
    chainId: 1,
    name: "Keep3r",
    symbol: "KPR",
}, {
    address: "0x6f40d4a6237c257fff2db00fa0510deeecd303eb",
    chainId: 1,
    name: "Instadapp",
    symbol: "INST",
}]

const MULTICALL_ABI = [
    "function aggregate((address, bytes)[] calls) view returns (uint256 blockNumber, bytes[] returnData)",
]

const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint)",
    "function transfer(address to, uint amount)",
]

const getMultiCall = async (multiCallsData: string[]) => {

}

const getBalances = async (address: String) => {

    for (const chainId of Object.keys(providers)) {
        const multiCallsData = []
        const provider = providers[Number(chainId)];

        for (const token of tokens.filter(token => token.chainId === Number(chainId))) {
            const tokenContract = new ethers.Contract(token.address, ERC20_ABI, provider);

            multiCallsData.push(tokenContract.interface.encodeFunctionData("balanceOf", [address]))
        }

        await getMultiCall(multiCallsData);
    }
   
    return "";
}

export { tokens, getBalances }