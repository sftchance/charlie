interface Token {
    id: number,
    blockchain: string,
    chainId: number,
    decimals: number,
    address: string,
    name: string,
    symbol: string,
    verified: boolean,
}

interface VotesToken extends Token {
    balance: number,
    nonce: number,
    expiry: number,
    currentDelegate: `0x${string}`,
    delegatee: `0x${string}`,
    selected?: boolean,
}

export type { Token, VotesToken }