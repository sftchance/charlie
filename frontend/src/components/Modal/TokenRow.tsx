import { useState } from "react"

import { ethers } from "ethers"
import { useNetwork } from "wagmi"

import { useBlockExplorer } from "../../hooks"

import { Checkbox } from "../Form"

import { formatBalance, truncate } from "../../utils"

import { DelegatedCall, VotesToken } from "../../types"

import { ENSNameAvatar } from "../Wallet"

import "./TokenRow.css"

const TokenRow = ({
    token,
    delegateCall,
    isClicked,
    onClick
}: {
    token: VotesToken,
    delegateCall?: DelegatedCall,
    isClicked?: boolean,
    onClick?: () => void,
}) => {
    const { chains } = useNetwork();

    const [noTokenImage, setNoTokenImage] = useState<boolean>(false);

    const {
        chainId,
        address,
        name,
        delegatee,
        symbol,
        balance,
        currentDelegate,
    } = token;

    const blockExplorerURL = useBlockExplorer(chain, token.address);

    const actionStatus = delegateCall?.status;

    return (
        <>
            <div className="token">
                <div className="status">
                    <Checkbox
                        checked={isClicked}
                        onChange={onClick}
                        disabled={token.balance <= 0.001 || actionStatus === "pending"} />

                    <div className={`signature ${actionStatus}`} />
                </div>

                <a href={blockExplorerURL} target="_blank" rel="noreferrer">
                    <div className="name">
                        <div className="token-img">
                            <img
                                className="token img"
                                src={!noTokenImage ? `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${token.blockchain}/assets/${ethers.utils.getAddress(token.address)}/logo.png` : `/logos/${token.blockchain}.png`}
                                alt={token.name}
                                onError={() => setNoTokenImage(true)} />

                            {!noTokenImage && <img
                                className="chain img"
                                src={`/logos/${token.blockchain}.png`}
                                alt={token.blockchain} />}
                        </div>

                        <p><span className="name">{truncate(token.name, 22)}</span> <span className="symbol"> ${token.symbol}</span></p>
                    </div>
                </a>

                <p className="balance">
                    <span>{formatBalance(token.balance as unknown as string)}</span>
                </p>

                <div className="delegations">
                    <div className="delegation">
                        <ENSNameAvatar address={token.currentDelegate} />
                    </div>
                    <div className="arrow" />
                    <div className="delegation">
                        <ENSNameAvatar address={token.delegatee} />
                    </div>
                </div>
            </div>
        </>
    )
}

export { TokenRow }