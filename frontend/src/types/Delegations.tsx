interface DelegationCall {
    chainId: number;
    contractAddress: `0x${string}`;
    delegatee: `0x${string}`;
    nonce: number;
    expiry: number;
}

interface DelegatedCall {
    target: `0x${string}`;
    callData: string;
}

export type { DelegationCall, DelegatedCall }