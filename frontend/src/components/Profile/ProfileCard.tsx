import { useEnsName } from "wagmi"

import { formatAddress } from "../../utils"

const ProfileCard = ({ address }: { address: `0x${string}` | undefined }) => {
    const { data: name } = useEnsName({ address, chainId: 1 })

    const formattedAddress = formatAddress(address)

    return <div className="card">
        <h2>{name || formattedAddress}</h2>
    </div>
}

export { ProfileCard }