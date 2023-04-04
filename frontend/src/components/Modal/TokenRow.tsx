import { useNetwork } from "wagmi"

import { useBlockExplorer } from "../../hooks"

const TokenRow = ({
    token,
    balance,
    currentDelegate,
    newDelegate,
    first,
    isPending,
    isLoading,
    onClick
}: {
    token: any,
    balance?: number,
    currentDelegate?: string,
    newDelegate?: string,
    first: boolean,
    isPending?: boolean,
    isLoading?: boolean,
    onClick?: () => void,
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
                <h2 style={{display: "flex"}}>
                    <input type="checkbox" onClick={onClick} />
                    <span>(${token.symbol}) {token.name}</span>
                    <span>Balance: {balance}</span>
                    <div>
                        {currentDelegate && (currentDelegate.slice(0, 6) + "..." + currentDelegate.slice(-4))}
                        --- 
                        {newDelegate && (newDelegate.slice(0, 6) + "..." + newDelegate.slice(-4))}
                    </div>
                </h2>
            </a>
        </div>
    )
}

export { TokenRow }