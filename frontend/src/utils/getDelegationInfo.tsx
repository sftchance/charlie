import { ethers } from "ethers";

import { providers, ERC20_VOTES_ABI } from "./config";

import { submitStaticMultiCall } from "./getMultiCall";

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
    const delegations: any[] = [];

    const votesInterface = new ethers.utils.Interface(ERC20_VOTES_ABI);

    for (const chainId of Object.keys(providers)) {
        const chainTargets: `0x${string}`[] = []
        const chainDatas: string[] = []

        const provider: ethers.providers.JsonRpcProvider = providers[Number(chainId)];

        for (const token of tokens.filter(token => token.chainId === Number(chainId))) {
            chainTargets.push(token.address);
            chainDatas.push(votesInterface.encodeFunctionData("nonces", [delegatee]));
            chainTargets.push(token.address);
            chainDatas.push(votesInterface.encodeFunctionData("delegates", [delegatee]));
        }

        if (chainTargets.length + chainDatas.length == 0) continue;

        const multiCallResult = await submitStaticMultiCall(
            chainTargets,
            chainDatas,
            provider
        );

        for (let i = 0; i < multiCallResult.length; i += 2) {
            const token = tokens.find(token => token.address === chainTargets[i]);

            if (token === undefined) continue;

            const nonce = multiCallResult[i].returnData;
            const currentDelegate = multiCallResult[i + 1].returnData;

            delegations.push({
                ...token,
                delegatee,
                selected: false,
                nonce: Number(nonce),
                currentDelegate: currentDelegate,
                expiry: Math.floor(Date.now() / 1000) + 300 /// ~5 minutes from now
            });
        }
    }

    return {
        results: delegations
    }
}

export { getDelegationInfo }