interface DelegatedCall {
    chainId: number;
    target: `0x${string}`;
    status: string;
    callData?: string;
}

export type { DelegatedCall }