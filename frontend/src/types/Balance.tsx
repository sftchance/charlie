interface Balance {
    chainId: number;
    name: string | null;
    symbol: string | null;
    address: string;
    balance: string;
    delegate: `0x${string}` | null;
    delegated: string | null;
}

export type { Balance };