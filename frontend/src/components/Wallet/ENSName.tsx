import { useEnsName } from "wagmi";

const trimAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const ENSName = ({ address }: any) => {
    const disabled = !!address || address === "0x0000000000000000000000000000000000000000000000000000000000000000";
    
    const { data: ensName } = useEnsName({
        enabled: !disabled,
        address: address as `0x${string}`,
        chainId: 1
    })

    return (
        <>
            {ensName ?
                <span>{ensName}</span> :
                <span>
                    {typeof(address) === "string" ? 
                        trimAddress(address) : 
                        "0x0000...0000"
                    }
                </span>
            }
        </>
    )
}

export { ENSName }