import { useEffect, useState, Fragment } from "react";

import { useParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import { useAccount, useNetwork } from "wagmi";

import { useClient, useColor, useDelegate, useENS } from "../../hooks";

import { TokenRow } from "../";

import { getBalances, getDelegationInfo, truncate } from "../../utils";

import { VotesToken } from "../../types";

import "./ButtonEmbed.css";

const sortByChainId = (a: VotesToken, b: VotesToken, targetChainId: number | undefined) => {
    const chain = targetChainId ?? 1;

    if (a.chainId === chain) return -1;
    if (b.chainId === chain) return 1;

    if (a.chainId < b.chainId) return -1;
    if (a.chainId > b.chainId) return 1;

    return a.symbol > b.symbol ? 1 : -1;
}

const ButtonEmbed = () => {
    const { buttonId } = useParams();

    const urlParams = new URLSearchParams(window.location.search);

    const config = urlParams.get('c') || null;

    const isModalForcedOpen = (config && config[0] === '1') ? true : false;

    const { address } = useAccount();

    const { chain } = useNetwork();

    const { get, path } = useClient();

    const [isModalOpen, setIsModalOpen] = useState(isModalForcedOpen);

    console.log(isModalForcedOpen, isModalOpen)

    const [tokens, setTokens] = useState<VotesToken[]>([]);

    const selectedTokens = tokens.filter((t) => t.selected === true);

    const {
        isLoading,
        error,
        data,
    }: {
        isLoading: boolean;
        error: any;
        data: any;
    } = useQuery({
        queryKey: ["button"],
        queryFn: () =>
            get(path(`buttons/${buttonId}/`))
    });

    const { ensName, ensAvatar } = useENS(data?.ethereum_address);

    const textColor = useColor([
        data?.primary_color,
        data?.secondary_color
    ]);

    const {
        isPrepared,
        isSigningNeeded,
        delegatedCalls,
        onRemoveCall,
        openDelegationSignatures,
        openDelegationTx
    } = useDelegate({
        tokens: selectedTokens,
        blocking: true
    });

    const onSelect = (token: any) => {
        if (token.selected) onRemoveCall(token);

        setTokens(tokens => (
            tokens.map((t) => t.address === token.address ? { ...t, selected: !t.selected } : t)
        ));
    }

    const onSign = async () => {
        await openDelegationSignatures({
            onSuccess: () => {
                console.log('success')
            }
        });
    }

    const onDelegate = async () => {
        await openDelegationTx({
            onSuccess: () => {
                console.log('success')
            }
        });
    }

    useEffect(() => {
        if (!data || !data.tokens) return;

        const getBalanceInfo = async () => {
            const { results } = await getBalances({
                address: address as `0x${string}`,
                tokens: data.tokens,
                includeZeros: true
            });

            const { results: balanceDelegations } = await getDelegationInfo({
                delegatee: data.ethereum_address,
                tokens: results
            });

            const sorted = balanceDelegations.sort((a: any, b: any) => sortByChainId(a, b, chain?.id));

            setTokens(sorted);
        }

        getBalanceInfo();
    }, [isLoading]);

    if (isLoading) return <>{"Loading..."}</>;

    if (error) return <>{"An error has occurred: " + error.message}</>;

    return (
        <>
            <div
                className={`modal ${isModalOpen ? "open" : "hidden"} ${isModalForcedOpen ? "forced" : ""}`}
                onClick={() => setIsModalOpen(false)}
            >
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <span className="close" onClick={() => setIsModalOpen(false)}>
                        &times;
                    </span>

                    <h1>{data.name}</h1>
                    <p>{data.description}</p>

                    <div className="tokens">
                        {tokens.map((token: any) => {
                            const previousChainId = tokens[tokens.indexOf(token) - 1]?.chainId;

                            const delegateCall = delegatedCalls.find((call) =>
                                call.target === token.address && call.chainId === token.chainId
                            );

                            const firstOfChain = token.chainId !== previousChainId;

                            return (
                                <TokenRow
                                    key={`${token.address}-${token.chainId}`}
                                    token={token}
                                    delegate={{ ensName: ensName, ensAvatar: ensAvatar }}
                                    delegateCall={delegateCall}
                                    isClicked={token.selected}
                                    onClick={() => onSelect(token)}
                                />
                            )
                        })}
                    </div>

                    <button className="delegate" disabled={!isPrepared && !isSigningNeeded} onClick={isPrepared ? onDelegate : onSign}>
                        {isSigningNeeded ? "Sign delegations" : "Delegate now"}
                    </button>

                    <p className="branding">Powered by <strong>
                        <a href="https://trycharlie.xyz" target="_blank" rel="noreferrer">
                            Charlie
                        </a>
                    </strong>.</p>
                </div>
            </div >

            <button
                className="delegation-button primary"
                style={{
                    background: `linear-gradient(-37deg, ${data.primary_color}, ${data.secondary_color})`,
                    color: textColor,
                }}
                onClick={() => setIsModalOpen(!isModalOpen)}
            >
                <span className="content">{data.text}</span>
            </button>
        </>
    );
};

export { ButtonEmbed };