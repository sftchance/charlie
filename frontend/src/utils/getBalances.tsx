import { ethers } from "ethers";

import { providers, tokens, ERC20_ABI, MULTICALL_ABI } from "./config";

const getBalances = async (address: String) => {
    for (const chainId of Object.keys(providers)) {
        const multiCallsTargets: `0x${string}`[] = []
        const multiCallsDatas: string[] = []

        const provider: ethers.providers.AlchemyProvider = providers[Number(chainId)];

        for (const token of tokens.filter(token => token.chainId === Number(chainId))) {
            const tokenContract = new ethers.Contract(token.address, ERC20_ABI, provider);

            multiCallsTargets.push(token.address)
            multiCallsDatas.push(tokenContract.interface.encodeFunctionData("balanceOf", [address]))
        }

        if (multiCallsTargets.length + multiCallsDatas.length == 0) continue;

        await getMultiCall(multiCallsTargets, multiCallsDatas, provider);
    }

    return [];
}

const getMultiCall = async (multiCallsTargets: `0x${string}`[], multiCallsData: string[], provider: ethers.providers.AlchemyProvider) => {
    console.log('multi', multiCallsTargets, multiCallsData);

    const multiCallContractAddress = "0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441"
    const multiCallContract = new ethers.Contract(multiCallContractAddress, MULTICALL_ABI, provider);

    const multiCallResult = await multiCallContract.aggregate(multiCallsTargets, multiCallsData);
}

export { getBalances }