import { useEnsName, useEnsAvatar } from "wagmi";

const useENS = (address: string | undefined) => {
    if (!address) return {
        ensName: undefined,
        ensAvatar: undefined
    }

    const { data: ensName } = useEnsName({
        enabled: !!address,
        address: address as `0x${string}`,
        chainId: 1
    })

    const { data: ensAvatar } = useEnsAvatar({
        enabled: !!address,
        address: address as `0x${string}`,
        chainId: 1
    })

    return {
        ensName: ensName ?? address,
        ensAvatar
    }
}

export { useENS }