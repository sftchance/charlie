import { useEffect, useState } from "react";
import { useEnsName } from "wagmi";

import { providers } from "../../utils";

const trimAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Wagmi useENSAvatar did not work, so we use the wagmi useEnsName hook to get the ens name
// and then a useEffect to get the avatar if they have a name.
const ENSNameAvatar = ({ address }: any) => {
    const [ avatar, setAvatar ] = useState<string | undefined>(undefined)

    const disabled = !!address || address === "0x0000000000000000000000000000000000000000000000000000000000000000";
    
    const { data: ensName } = useEnsName({
        enabled: !disabled,
        address: address as `0x${string}`,
        chainId: 1
    })

    useEffect(() => {
        if(!ensName) return;

        async function getAvatar(ensName: string) {
            const avatar = await providers[1].getAvatar(ensName)
            
            setAvatar(avatar ? avatar : undefined)
        }

        getAvatar(ensName);
    }, [ensName])

    return (
        <>
            {avatar ?
                <img className="img" src={avatar} alt="avatar" /> :
                <span className="img" />
            }
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

export { ENSNameAvatar }