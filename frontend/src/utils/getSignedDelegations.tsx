import { signTypedData } from "@wagmi/core";

import { VotesToken } from "../types";

const getTypedData = (call: VotesToken) => {
    return {
        domain: {
            name: "Charlie",
            version: "1",
            chainId: call.chainId,
            verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC" as `0x${string}`,
        },
        types: {
            Delegation: [
                { name: "delegatee", type: "address" },
                { name: "nonce", type: "uint256" },
                { name: "expiry", type: "uint256" },
            ],
        },
        value: {
            delegatee: call.delegatee,
            nonce: call.nonce,
            expiry: call.expiry,
        }
    }
}

const getSignedDelegations = async (tokens: VotesToken[]) => {
    let signedTransactions: string[] = [];

    tokens.forEach(async (token) => {
        const signature = await signTypedData(
            getTypedData(token)
        );
        signedTransactions.push(signature);
    })

    return signedTransactions;
}

export { getSignedDelegations }