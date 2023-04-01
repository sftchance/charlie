import { signTypedData } from "@wagmi/core";

import { DelegationCall } from "../types";

const getTypedData = (call: DelegationCall) => {
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

const getSignedTransactions = async (calls: DelegationCall[]) => {
    let signedTransactions: string[] = [];

    calls.forEach(async (call) => {
        const signature = await signTypedData(
            getTypedData(call)
        );
        signedTransactions.push(signature);
    })

    return signedTransactions;
}

export { getSignedTransactions }