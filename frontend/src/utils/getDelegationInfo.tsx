import { ethers } from "ethers";

import { ERC20_VOTES_ABI } from "./config";

import { multicall } from "@wagmi/core";

import { VotesToken } from "../types";

const getDelegationInfo = async ({
    delegatee,
    tokens,
}: {
    delegatee: `0x${string}`
    tokens: any[],
}): Promise<{
    results: VotesToken[],
}> => {
    // Read calls to get the nonces and delegates for the caller.
    const calls: any[] = [];

    // Get all chains that are selected.
    const chains = tokens.reduce((acc: string[], token) => {
        acc = acc || [];

        if (acc.indexOf(token.chainId) === -1)
            acc.push(token.chainId);
        return acc;
    }, []);

    chains.forEach((chain) => {
        // Get all the selected tokens on this chain.
        const chainTokens = tokens.filter((token) => token.chainId === chain);

        // For each token on the chain, get the nonces and delegates for the caller.
        chainTokens.forEach((token) => {
            const obj = {
                address: token.address as `0x${string}`,
                abi: ERC20_VOTES_ABI,
                args: [delegatee],
                chainId: token.chainId,
            }

            calls.push({ ...obj, functionName: "nonces" });
            calls.push({ ...obj, functionName: "delegates" });
        });
    })
    
    const data = await multicall({
        contracts: calls,
    })

    const tokenInfo: VotesToken[] = tokens.map((token, i) => ({
        ...token,
        delegatee,
        chainId: token.chainId,
        selected: false,
        ethereum_address: token.address,
        nonce: parseInt(data[i * 2] as string),
        currentDelegate: data[i * 2 + 1],
        expiry: Math.floor(Date.now() / 1000) + 300 /// ~5 minutes from now
    }));

    return {
        results: tokenInfo,
    }
}

export { getDelegationInfo }