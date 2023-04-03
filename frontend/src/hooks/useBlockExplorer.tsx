const useBlockExplorer = (chain: any, address: string): string | undefined => {
    if (!chain || !chain.id) return;

    if (Number(chain?.id) === 1) return `https://etherscan.io/address/${address}`
    if (Number(chain?.id) === 10) return `https://optimistic.etherscan.io/address/${address}`
    if (Number(chain?.id) === 42161) return `https://arbiscan.io/address/${address}`
    if (Number(chain?.id) === 43114) return `https://cchain.explorer.avax.network/address/${address}`
    if (Number(chain?.id) === 137) return `https://polygonscan.com/address/${address}`

    if (chain?.block_explorer_url) {
        return `${chain.block_explorer_url}/address/${address}`
    }

    return `https://etherscan.io/address/${address}`
}

export { useBlockExplorer }