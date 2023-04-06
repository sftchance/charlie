import { useEffect, useState, useMemo } from "react";

import { useParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import { useAccount, useNetwork } from "wagmi";

import { useClient, useColor, useDelegate } from "../../hooks";

import { TokenRow } from "../";

import { getBalances, getDelegationInfo } from "../../utils";

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
    const { address } = useAccount();

    const { chain } = useNetwork();

    const { buttonId } = useParams();

    const { get, path } = useClient();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [tokens, setTokens] = useState<VotesToken[]>([]);

    const selectedTokens = tokens.filter((t) => t.selected === true)

    const currentChainId = useMemo(() => {
        return chain?.id ?? 1;
    }, [chain])

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

            // Sort current chain or mainnet to top.
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
                className={isModalOpen ? "modal" : "modal hidden"}
                onClick={() => setIsModalOpen(false)}
            >
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <span className="close" onClick={() => setIsModalOpen(false)}>
                        &times;
                    </span>

                    <h1>{data.text}</h1>

                    {tokens.map((token: any) => {
                        const previousChainId = tokens[tokens.indexOf(token) - 1]?.chainId;

                        const delegateCall = delegatedCalls.find((call) =>
                            call.target === token.address && call.chainId === token.chainId
                        );

                        return (
                            <TokenRow
                                key={`${token.address}-${token.chainId}`}
                                token={token}
                                delegateCall={delegateCall}
                                first={token.chainId !== previousChainId}
                                isClicked={token.selected}
                                onClick={() => onSelect(token)}
                            />
                        )
                    })}

                    <button className="delegate" disabled={!isPrepared && !isSigningNeeded} onClick={isPrepared ? onDelegate : onSign}>
                        {isSigningNeeded ? "Sign delegations" : "Delegate now"}
                    </button>

                    <p>Powered by <strong>Charlie</strong>.</p>
                </div>
            </div >

            <button
                className="delegation-button"
                style={{
                    background: `linear-gradient(-37deg, ${data.primary_color}, ${data.secondary_color})`,
                    color: textColor,
                }}
                onClick={() => setIsModalOpen(!isModalOpen)}
            >
                {data.text}
            </button>
        </>
    );
};

export { ButtonEmbed };