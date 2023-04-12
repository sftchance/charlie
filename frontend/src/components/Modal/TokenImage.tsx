interface TokenImageProps {
    blockchain: string
    address: `0x${string}`
}

const TokenImage = ({ blockchain, address }: TokenImageProps) => {
    return (
        <img
            src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${token.blockchain}/assets/${token.address}/logo.png`}
            alt="token"
            onError={e => {
                const el = e.target as HTMLImageElement
                el.src = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${token.address}/logo.png`
                el.onerror = null
            }}
            style={{ width: '20px', height: '20px', marginRight: '12px' }}
        />
    )
}

export { TokenImage }