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

        const provider: ethers.providers.AlchemyProvider = providers[Number(chainId)];

        console.log('tokens', tokens)
        for (const token of tokens.filter(token => token.chainId === Number(chainId))) {
            console.log('token', token)
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

        for (let i = 0; i < multiCallResult.length; i+=2) {
            const token = tokens.find(token => token.address === chainTargets[i]);

            if (token === undefined) continue;

            const nonce = multiCallResult[i].returnData;
            const currentDelegate = multiCallResult[i + 1].returnData;

            console.log('data', nonce, currentDelegate)

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

    // console.log('getting')
    // // Read calls to get the nonces and delegates for the caller.
    // const calls: any[] = [];

    // // Get all chains that are selected.
    // const chains = tokens.reduce((acc: string[], token) => {
    //     acc = acc || [];

    //     if (acc.indexOf(token.chainId) === -1)
    //         acc.push(token.chainId);
    //     return acc;
    // }, []);

    // chains.forEach((chain) => {
    //     // Get all the selected tokens on this chain.
    //     const chainTokens = tokens.filter((token) => token.chainId === chain);

    //     console.log('chainTokens', chainTokens)
    //     // For each token on the chain, get the nonces and delegates for the caller.
    //     chainTokens.forEach((token) => {
    //         const obj = {
    //             address: token.address as `0x${string}`,
    //             abi: ERC20_VOTES_ABI,
    //             args: [delegatee],
    //             chainId: token.chainId,
    //         }

    //         calls.push({ ...obj, functionName: "nonces" });
    //         calls.push({ ...obj, functionName: "delegates" });
    //     });
    // })

    // console.log('calls', calls)
    
    // const data = await multicall({
    //     contracts: calls,
    // })

    // console.log('data', data)

    // const tokenInfo: VotesToken[] = tokens.map((token, i) => ({
    //     ...token,
    //     delegatee,
    //     chainId: token.chainId,
    //     selected: false,
    //     ethereum_address: token.address,
    //     nonce: parseInt(data[i * 2] as string),
    //     currentDelegate: data[i * 2 + 1],
    //     expiry: Math.floor(Date.now() / 1000) + 300 /// ~5 minutes from now
    // }));

    // return {
    //     results: tokenInfo,
    // }

export { getDelegationInfo }