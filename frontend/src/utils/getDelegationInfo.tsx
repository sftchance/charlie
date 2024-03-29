import { ethers } from "ethers";

import { providers, ERC20_VOTES_ABI } from "./config";

import { submitStaticMultiCalls } from "./getMultiCall";

import { VotesToken } from "../types";

const getDelegationInfo = async ({
    delegatee,
    delegator,
    tokens,
}: {
    delegatee: `0x${string}`,
    delegator: `0x${string}`,
    tokens: any[],
}): Promise<{
    results: VotesToken[],
}> => {
    const results: any[] = [];

    const votesInterface = new ethers.utils.Interface(ERC20_VOTES_ABI);

    for (const chainId of Object.keys(providers)) {
        const calls: {
            target: `0x${string}`,
            allowFailure: boolean,
            callData: string,
        }[] = []

        const chainTokens = tokens.filter(token => token.chainId === Number(chainId));

        for (const token of chainTokens) {
            calls.push({
                target: token.address,
                allowFailure: true,
                callData: votesInterface.encodeFunctionData("nonces", [delegator])
            })

            calls.push({
                target: token.address,
                allowFailure: true,
                callData: votesInterface.encodeFunctionData("delegates", [delegator])
            })
        }

        if (calls.length === 0) continue;

        const multiCallResult = await submitStaticMultiCalls({
            calls,
            chainId: Number(chainId)
        });

        for (let i = 0; i < multiCallResult.length; i += 2) {
            const token = tokens.find(token => token.address === calls[i].target);

            if (token === undefined) continue;

            const nonce = Number(multiCallResult[i].returnData);

            const currentDelegate = `0x${multiCallResult[i + 1].returnData.slice(26)}`;

            const expiry = Math.floor(Date.now() / 1000) + 300;

            results.push({
                ...token,
                selected: false,
                delegatee,
                nonce,
                currentDelegate,
                expiry
            });
        }
    }

    return { results }
}

export { getDelegationInfo }