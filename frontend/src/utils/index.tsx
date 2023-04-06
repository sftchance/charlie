export {
    providers,
    MULTICALL,
    MULTICALL_ABI,
    ERC20_ABI,
    ERC20_VOTES_ABI
} from './config'

export { getCSRFToken } from './csrf'

export { getBalances } from './getBalances'
export { getDelegationInfo } from './getDelegationInfo'
export { getMultiCall, submitStaticMultiCalls } from './getMultiCall'
export { getTypedDelegations } from './getTypedDelegations'
export { formatAddress, formatBalance } from './format'

export const copy = (address: string | undefined) => {
    if (!address || address === undefined) return;
    navigator.clipboard.writeText(address);
}