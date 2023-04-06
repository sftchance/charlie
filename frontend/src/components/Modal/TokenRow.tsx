import { useNetwork } from "wagmi"

import { useBlockExplorer } from "../../hooks"

import { DelegatedCall, VotesToken } from "../../types"

import "./TokenRow.css"

const getAddressOrENS = (address: string) => {
    // ensname
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

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
        <>
            {first && <div className="chain">
                <div className="name">
                    <span className="img" />
                    <h1>{chain?.name}</h1>
                </div>
                <hr />
            </div>}

            <div className="token">
                <div className="status">
                    <div className={`signature ${actionStatus}`} />
                    
                    <input 
                        type="checkbox"
                        onChange={onClick}
                        checked={isClicked || false}
                    />
                </div>

                <a href={blockExplorerURL} target="_blank" rel="noreferrer">
                    <div className="name">
                        <span className="img" />
                        <h3>{name}</h3>
                        <span className="symbol">{`($${symbol})`}</span>
                    </div>
                </a>

                <div className="balance">
                    <h3>{Number(balance).toFixed(3)}</h3>
                </div>

                <div className="delegations">
                    <div className="delegation">
                        <span className="img" />
                        <span>{getAddressOrENS(currentDelegate)}</span>
                    </div>
                    <div className="arrow" />
                    <div className="delegation">
                        <span className="img" />
                        <span>{getAddressOrENS(delegatee)}</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export { TokenRow }