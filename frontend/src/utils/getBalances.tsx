import { ethers } from "ethers";

import { providers, tokens, ERC20_ABI, MULTICALL_ABI } from "./config";

import { getMultiCall } from "./getMultiCall";

// TODO PERSONAL NOTE: Right now there are so few delegatable tokens that we can just check 
// the balance of each token using multicall without worrying about a crazy architecture
// or the user of another tool. If we ever get to a point where we have a lot of tokens
// we should consider using a subgraph to get the balances of all tokens at once.

const getBalances = async (address: String) => {
    const balances = [];

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

        const multiCallResult = await submitStaticMultiCall(multiCallsTargets, multiCallsDatas, provider);

        for (let i = 0; i < multiCallResult.length; i++) {
            const token = tokens.find(token => token.address === multiCallsTargets[i]);
            const balance = multiCallResult[i];

            if (token === undefined || balance === "0x") continue;

            balances.push({
                chainId: Number(chainId),
                name: token.name,
                symbol: token.symbol,
                address: token.address,
                balance: ethers.utils.formatUnits(balance, 18),
            });
        }
    }

    return balances;
}

const submitStaticMultiCall = async (
    multiCallsTargets: `0x${string}`[],
    multiCallsData: string[],
    provider: ethers.providers.AlchemyProvider
) => {
    console.log('multi', multiCallsTargets, multiCallsData);

    const multiCallContract = await getMultiCall(provider.network.chainId);
    const blocking = false;

    const submit = false;
    if (!submit) [];

    const multiCallResult = await multiCallContract.callStatic.aggregate(multiCallsTargets, multiCallsData, blocking);

    console.log('multiCallResult', multiCallResult);

    return multiCallResult;
}

export { getBalances }