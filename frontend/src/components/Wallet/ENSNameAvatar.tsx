import { useEnsName, useEnsAvatar } from "wagmi";

const ENSNameAvatar = ({ address }: any) => {
    const { data: ensName } = useEnsName({
        enabled: !!address,
        address: address as `0x${string}`,
        chainId: 1
    })

    const { data: ensAvatar } = useEnsAvatar({
        enabled: !!address,
        address: ensName as `0x${string}`,
        chainId: 1
    })

    const name = ensName ? ensName : address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""

    return (
        <>
            {ensAvatar ?
                <img className="img" src={ensAvatar} alt="avatar" /> :
                <span className="img" />
            }
            <span>{name}</span>
        </>
    )
}

export { ENSNameAvatar }