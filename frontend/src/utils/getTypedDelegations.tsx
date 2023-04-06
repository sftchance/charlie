import { VotesToken } from "../types";

const getTypedDelegations = (calls: VotesToken[]) => {
    const messages = calls.map((call) => ({
        domain: {
            name: "Charlie",
            version: "1",
            chainId: call.chainId,
            verifyingContract: "0xbD8488016B3A84647c1230f934A6EDF522Cbd0d9" as `0x${string}`,
        },
        types: {
            Delegation: [
                { name: "delegatee", type: "address" },
                { name: "nonce", type: "uint256" },
                { name: "expiry", type: "uint256" },
            ],
        },
        value: {
            delegatee: call.delegatee as `0x${string}`,
            nonce: call.nonce,
            expiry: call.expiry,
        }
    }));

    return {
        messages
    }
}

export { getTypedDelegations }