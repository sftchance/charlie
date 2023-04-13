import { useNetwork } from "wagmi"

import { useBlockExplorer } from "../../hooks"

import { DelegatedCall, VotesToken } from "../../types"

import { Checkbox } from "../Form"

import "./TokenRow.css"

const getAddressOrENS = (address: string) => {
    // ensname
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const formatBalance = (balance: number) => {
    const bal = Number(balance)
    if (bal < 0.01)
        return "<0.01"
    if (bal > 1000000000)
        return `${(Math.round(balance / 100000000) / 10).toLocaleString()}b`
    if (bal > 10000000)
        return `${(Math.round(balance / 100000) / 10)}m`
    if (bal > 10000)
        return `${(Math.round(balance / 1000)) / 10}k`
    if (bal % 1 === 0)
        return bal

    return bal.toFixed(2)
}

const TokenRow = ({
    token,
    delegate,
    delegateCall,
    isClicked,
    onClick
}: {
    token: VotesToken,
    delegate: any,
    delegateCall?: DelegatedCall,
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
    } = token;

    const chain = chains.find(chain => chain.id === chainId)

    const blockExplorerURL = useBlockExplorer(chain, address);

    const actionStatus = delegateCall ? delegateCall.status : "hidden";

    return (
        <>
            <div className="token">
                <div className="status">
                    <Checkbox checked={isClicked} onChange={onClick} />

                    {/* <div className={`signature ${actionStatus}`} /> */}
                </div>

                <a href={blockExplorerURL} target="_blank" rel="noreferrer">
                    <div className="name">
                        <span className="img" />
                        <h5>{name}</h5>
                        {/* <p className="symbol">{`($${symbol})`}</p> */}
                    </div>
                </a>

                <div className="balance">
                    <h5>{formatBalance(balance)}</h5>
                </div>

                {/* <div className="delegations">
                    <div className="delegation">
                        <span className="img" />
                        <p>{getAddressOrENS(currentDelegate)}</p>
                    </div>
                    <div className="arrow" />
                    <div className="delegation">
                        {delegate.ensAvatar ?
                            <img src={delegate.ensAvatar} alt="avatar" /> :
                            <span className="img" />}
                        <p>{delegate.ensName}</p>
                    </div>
                </div> */}
            </div>
        </>
    )
}

export { TokenRow }