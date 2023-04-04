import { ethers } from "ethers";

import { providers, ERC20_ABI } from "./config";
import { getMultiCall } from "./getMultiCall";

import { Balance } from "../types";

const getBalances = async ({
    address,
    tokens,
    size,
    offset,
    includeZeros
}: {
    address: `0x${string}`
    tokens: any[],
    size?: number,
    offset?: number,
    includeZeros?: boolean,
}): Promise<{
    results: Balance[],
    hasNextPage: boolean,
}> => {
    const balances: Balance[] = []

    for (const chainId of Object.keys(providers)) {
        const multiCallsTargets: `0x${string}`[] = []
        const multiCallsDatas: string[] = []

        const provider: ethers.providers.AlchemyProvider = providers[Number(chainId)];

        for (const token of tokens.filter(token => token.chain_id === Number(chainId))) {
            const tokenContract = new ethers.Contract(token.ethereum_address, ERC20_ABI, provider);

            // if (token.symbol === 'null' || token.symbol === null || token.decimals === null) continue;

            multiCallsTargets.push(token.ethereum_address)
            multiCallsDatas.push(tokenContract.interface.encodeFunctionData("balanceOf", [address]))
        }

        if (multiCallsTargets.length + multiCallsDatas.length == 0) continue;

        const multiCallResult = await submitStaticMultiCall(
            multiCallsTargets,
            multiCallsDatas,
            provider
        );

        for (let i = 0; i < multiCallResult.length; i++) {
            const token = tokens.find(token => token.ethereum_address === multiCallsTargets[i]);

            // if (token === undefined || token.decimals === null) continue;

            const balance = parseInt(multiCallResult[i].returnData.slice(2), 16);

            if (!includeZeros && balance === 0) continue;

            balances.push({
                chainId: Number(chainId),
                name: token?.name,
                symbol: token?.symbol,
                address: token.ethereum_address,
                balance: `${balance / 10 ** token.decimals}`,
            } as Balance);
        }
    }

    const hasNextPage = offset && size ? offset + size < balances.length : false

    return {
        results: balances,
        hasNextPage
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
            allowFailure: true,
            callData: multiCallsData[i],
        };
    });

    const multiCallContract = await getMultiCall(provider.network.chainId);

    const multiCallResult = await multiCallContract.callStatic.aggregate3(calls);

    return multiCallResult;
}

export { getBalances }