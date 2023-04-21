import "./BlockchainImages.css"

const BlockchainImages = ({ blockchains }: { blockchains: unknown[] }) => {
    return <div className="blockchain-images">
        {blockchains.map((blockchain: any) => {
            return <div className="image" key={blockchain}>
                <img key={blockchain} src={`/logos/${blockchain}.png`} alt={blockchain} />
            </div>
        })}
    </div>
}

export { BlockchainImages }