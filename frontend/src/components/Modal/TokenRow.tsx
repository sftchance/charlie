import { useNetwork } from "wagmi"

import { useBlockExplorer } from "../../hooks"

const TokenRow = ({
    token,
    balance,
    first,
    isPending,
    isLoading
}: {
    token: any,
    balance: number,
    first: boolean,
    isPending?: boolean,
    isLoading?: boolean
}) => {
    const { chains } = useNetwork()

    const chain = chains.find(chain => chain.id === token.chain_id)

    const blockExplorerURL = useBlockExplorer(chain, token?.ethereum_address);

    return (
        <div className="token">
            {first && <>
                <h1>{chain?.name}</h1>
                <hr />
            </>}

            <a href={blockExplorerURL} target="_blank" rel="noreferrer">
                <h2>
                    (${token.symbol}) {token.name}
                    <span>Balance: {balance}</span>
                </h2>
            </a>
        </div>
    )
}

export { TokenRow }