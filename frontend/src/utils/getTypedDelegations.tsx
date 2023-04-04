import { VotesToken } from "../types";

const getTypedDelegations = (calls: VotesToken[]) => {
    return calls.map((call) => ({
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
    }));
}

export { getTypedDelegations }