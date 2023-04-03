interface Token {
    id: number,
    blockchain: string,
    chain_id: number,
    decimals: number,
    ethereum_address: string,
    name: string,
    symbol: string,
    verified: boolean,
}

export type { Token }