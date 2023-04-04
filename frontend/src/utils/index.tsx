export { providers, MULTICALL, MULTICALL_ABI, ERC20_ABI, ERC20_VOTES_ABI } from './config'
export { tokens } from './tokens'
export { getBalances } from './getBalances'
export { getDelegationInfo } from './getDelegationInfo'
export { getMultiCall } from './getMultiCall'
export { getSignedDelegations } from './getSignedDelegations'
export { formatAddress, formatBalance } from './format'

export const copy = (address: string | undefined) => {
    if (!address || address === undefined) return;
    navigator.clipboard.writeText(address);
}