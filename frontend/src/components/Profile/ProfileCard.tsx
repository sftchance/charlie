import { ProfileImage } from "./"

import { useENS } from "../../hooks"

import { formatAddress } from "../../utils"

import "./ProfileCard.css"

const ProfileCard = ({ address }: { address: `0x${string}` | undefined }) => {
    const { ensName, ensAvatar } = useENS(address)

    const formattedAddress = formatAddress(address)

    return <div className="profile card">
        <h2>
            <ProfileImage image={ensAvatar} />
            {ensName || formattedAddress}
        </h2>
    </div>
}

export { ProfileCard }