interface Balance {
    chainId: number;
    name: string | null;
    symbol: string | null;
    address: string;
    balance: string;
}

export type { Balance };