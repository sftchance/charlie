import { useNetwork } from "wagmi"

import { useBlockExplorer } from "../../hooks"

import { DelegatedCall } from "../../types"

import "./TokenRow.css"

// TODO: break this out it's a monster now i'm sorry
const TokenRow = ({
    token,
    balance,
    delegateCall,
    currentDelegate,
    newDelegate,
    first,
    isClicked,
    onClick
}: {
    token: any,
    balance?: number,
    delegateCall?: DelegatedCall,
    currentDelegate?: string,
    newDelegate?: string,
    first: boolean,
    isClicked?: boolean,
    onClick?: () => void,
}) => {
    const { chains } = useNetwork()

    const chain = chains.find(chain => chain.id === token.chain_id)

    const blockExplorerURL = useBlockExplorer(chain, token?.ethereum_address);

    const actionStatus = delegateCall ? delegateCall.status : "";

    return (
        <div className="token">
            {first && <>
                <h1>{chain?.name}</h1>
                <hr />
            </>}

            <a href={blockExplorerURL} target="_blank" rel="noreferrer">
                <h2 style={{display: "flex"}}>
                    <div className={`status ${actionStatus}`} />

                    <input 
                        type="checkbox" 
                        onClick={onClick}
                        checked={isClicked}
                    />
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