import { Link } from 'react-router-dom'

import { BlockchainImages } from "../Images/BlockchainImages"

import "./ButtonCard.css"

const ButtonCard = ({ button }: any) => {
    console.log(button)

    const blockchains: unknown[] = [...new Set(button.tokens.map((token: any) => token.blockchain))]

    return <Link to={`/account/buttons/${button.id}/`}>
        <div className="button-card card">
            <p>{button.name}</p>

            <BlockchainImages blockchains={blockchains} />
        </div>
    </Link>
}

export { ButtonCard }