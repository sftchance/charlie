export { providers, MULTICALL, MULTICALL_ABI, ERC20_ABI } from './config'
export { tokens } from './tokens'
export { getBalances } from './getBalances'
export { getMultiCall } from './getMultiCall'

export { formatAddress, formatBalance } from './format'

export const copy = (address: string | undefined) => {
    if (!address || address === undefined) return;
    navigator.clipboard.writeText(address);
}