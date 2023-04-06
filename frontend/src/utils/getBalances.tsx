import { ethers } from "ethers";

import { providers, ERC20_ABI } from "./config";
import { submitStaticMultiCalls } from "./getMultiCall";

import { Balance } from "../types";

const getBalances = async ({
    address,
    tokens,
    includeZeros
}: {
    address: `0x${string}`
    tokens: any[],
    size?: number,
    offset?: number,
    includeZeros?: boolean,
}): Promise<{
    results: Balance[]
}> => {
    const results: Balance[] = []

    const erc20Interface = new ethers.utils.Interface(ERC20_ABI);

    for (const chain of Object.keys(providers)) {
        const chainId = Number(chain);

        const calls: {
            target: `0x${string}`,
            allowFailure: boolean,
            callData: string,
        }[] = []

        const chainTokens = tokens.filter(token => token.chain_id === chainId);

        for (const token of chainTokens) {
            calls.push({
                target: token.ethereum_address,
                allowFailure: true,
                callData: erc20Interface.encodeFunctionData("balanceOf", [address])
            })
        }

        if (calls.length == 0) continue;

        const multiCallResult = await submitStaticMultiCalls({
            calls,
            chainId
        });

        for (let i = 0; i < multiCallResult.length; i++) {
            const token = tokens.find(token => token.ethereum_address === calls[i].target);

            if (token === undefined) continue;

            const balance = Number(multiCallResult[i].returnData);

            if (!includeZeros && balance === 0) continue;

            results.push({
                chainId,
                name: token?.name,
                symbol: token?.symbol,
                address: token.ethereum_address,
                balance: `${balance / 10 ** token.decimals}`,
            } as Balance);
        }
    }

    return { results }
}

export { getBalances }