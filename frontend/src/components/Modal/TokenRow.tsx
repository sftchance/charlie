import { useNetwork } from "wagmi"

import { useBlockExplorer } from "../../hooks"

import { Checkbox } from "../Form"

import { truncate } from "../../utils"

import { DelegatedCall, VotesToken } from "../../types"

import "./TokenRow.css"

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

    const chain = chains.find(chain => chain.id === token.chainId)

    const blockExplorerURL = useBlockExplorer(chain, token.address);

    const actionStatus = delegateCall ? delegateCall.status : "";

    return (
        <>
            <div className="token">
                <div className="status">
                    <Checkbox checked={isClicked} onChange={onClick} />

                    <div className={`signature ${actionStatus}`} />
                </div>

                <a href={blockExplorerURL} target="_blank" rel="noreferrer">
                    <div className="name">
                        <div className="token-img">
                            <img className="token img" src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${token.blockchain}/assets/${token.address}/logo.png`} />
                            <img className="chain img" src={`/logos/${token.blockchain}.png`} alt={token.blockchain} />
                        </div>

                        <p>{truncate(token.name, 18)}</p>
                    </div>
                </a>

                <div className="balance">
                    <p>{formatBalance(token.balance)}</p>
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