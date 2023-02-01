import { ethers } from "ethers";

import { providers, ERC20_ABI } from "./config";
import { getMultiCall } from "./getMultiCall";

import { tokens } from "./tokens";
import { Balance } from "../types";

// TODO PERSONAL NOTE: Right now there are so few delegatable tokens that we can just check 
// the balance of each token using multicall without worrying about a crazy architecture
// or the user of another tool. If we ever get to a point where we have a lot of tokens
// we should consider using a subgraph to get the balances of all tokens at once.

const getBalances = async (address: String, size: number = 200, offset: number = 0, includeZeros: boolean = false): Promise<{
    results: Balance[],
    hasNextPage: boolean,
}> => {
    const balances: Balance[] = [];

    for (const chainId of Object.keys(providers)) {
        const multiCallsTargets: `0x${string}`[] = []
        const multiCallsDatas: string[] = []

        const provider: ethers.providers.AlchemyProvider = providers[Number(chainId)];

        for (const token of tokens.filter(token => token.chainId === Number(chainId))) {
            const tokenContract = new ethers.Contract(token.address, ERC20_ABI, provider);

            if (token.symbol === 'null' || token.symbol === null || token.decimals === null) continue;

            multiCallsTargets.push(token.address)
            multiCallsDatas.push(tokenContract.interface.encodeFunctionData("balanceOf", [address]))
        }

        if (multiCallsTargets.length + multiCallsDatas.length == 0) continue;

        const multiCallResult = await submitStaticMultiCall(
            multiCallsTargets.slice(offset, offset + size),
            multiCallsDatas.slice(offset, offset + size),
            provider
        );

        for (let i = 0; i < multiCallResult.returnData.length; i++) {
            const token = tokens.find(token => token.address === multiCallsTargets[i]);

            if (token === undefined || token.decimals === null) continue;

            const balance = parseInt(multiCallResult.returnData[i].slice(2), 16);

            if (!includeZeros && balance === 0) continue;

            balances.push({
                chainId: Number(chainId),
                name: token?.name,
                symbol: token?.symbol,
                address: token.address,
                balance: `${balance / 10 ** token.decimals}`,
            } as Balance);
        }
    }

    return {
        results: balances,
        hasNextPage: offset + size < balances.length,
    }
}

const submitStaticMultiCall = async (
    multiCallsTargets: `0x${string}`[],
    multiCallsData: string[],
    provider: ethers.providers.AlchemyProvider
) => {
    const calls = multiCallsTargets.map((target, i) => {
        return {
            target,
            callData: multiCallsData[i],
        };
    });

    const multiCallContract = await getMultiCall(provider.network.chainId);

    const multiCallResult = await multiCallContract.callStatic.aggregate(calls);

    return multiCallResult;

    // const multiCallContract = await getMultiCall(provider.network.chainId);
    // const blocking = false;

    // const submit = false;
    // if (!submit) [];

    // const multiCallResult = await multiCallContract.callStatic.aggregate(multiCallsTargets, multiCallsData, blocking);

    // console.log('multiCallResult', multiCallResult);

    // return multiCallResult;
}

export { getBalances }