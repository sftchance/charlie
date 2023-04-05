import { useNetwork } from "wagmi"

import { useBlockExplorer } from "../../hooks"

import { DelegatedCall, VotesToken } from "../../types"

import "./TokenRow.css"

const getAddressOrENS = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// TODO: break this out it's a monster now i'm sorry
const TokenRow = ({
    token,
    delegateCall,
    first,
    isClicked,
    onClick
}: {
    token: VotesToken,
    delegateCall?: DelegatedCall,
    first: boolean,
    isClicked?: boolean,
    onClick?: () => void,
}) => {
    const { chains } = useNetwork();

    const { 
        chainId,
        address, 
        name,
        symbol,
        balance,
        currentDelegate,
        delegatee,
    } = token;

    const chain = chains.find(chain => chain.id === chainId)

    const blockExplorerURL = useBlockExplorer(chain, address);

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
                        onChange={onClick}
                        checked={isClicked || false}
                    />
                    <span>(${symbol}) {name}</span>
                    <span>Balance: {balance}</span>
                    <div>
                        {currentDelegate && (getAddressOrENS(currentDelegate))}
                        --- 
                        {delegatee && (getAddressOrENS(delegatee))}
                    </div>
                </h2>
            </a>
        </div>
    )
}

export { TokenRow }