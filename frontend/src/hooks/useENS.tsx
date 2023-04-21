import { useEnsName, useEnsAvatar } from "wagmi";

const useENS = (address: string | undefined) => {
    const { data: ensName } = useEnsName({
        enabled: !!address,
        address: address as `0x${string}`,
        chainId: 1
    })

    const { data: ensAvatar } = useEnsAvatar({
        enabled: !!ensName,
        address: ensName as `0x${string}`,
        chainId: 1
    })

    const name = ensName ? ensName : address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""

    return {
        ensName: name,
        ensAvatar
    }
}

export { useENS }