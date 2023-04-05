import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import { useAccount } from "wagmi";

import { TokenRow } from "../components";

import { useColor, useDelegate } from "../hooks";

import { getBalances, getDelegationInfo } from "../utils";

import { VotesToken } from "../types";

import "./Button.css";

const Button = () => {
    const { address } = useAccount();

    const { buttonId } = useParams<{ buttonId: string }>();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
            fetch(`http://localhost:8000/buttons/${buttonId}/`).then((res) => res.json()),
    });

    const textColor = useColor(data?.hex_color);

    const { 
        isPrepared,
        delegatedCalls,
        openDelegationSignatures, 
        openDelegationTx 
    } = useDelegate(
        selectedTokens, 
        false
    );

    const onSelect = (token: any) => {
        setTokens(tokens => (
            tokens.map((t) => t.address === token.address ? { ...t, selected: !t.selected } : t)
        ));
    }

    const onDelegate = async () => {
        await openDelegationSignatures({
            onSuccess: () => {
                console.log('success')
            }
        });
    }

    useEffect(() => {
        if (!data) return;

        const getBalanceInfo = async () => {
            const { results } = await getBalances({
                address: address as `0x${string}`,
                tokens: data.tokens,
                includeZeros: true
            });

            const { results: delegation } = await getDelegationInfo({
                delegatee: data.ethereum_address, 
                tokens: results
            });

            setTokens(delegation)
        }

        getBalanceInfo();
    }, [isLoading])

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

                    {data.tokens
                        .sort((a: any, b: any) => b.chain_id - a.chain_id)
                        .map((token: any) => {
                            const thisToken = tokens.find((t) => t.address === token.ethereum_address);

                            const chainId = token.chain_id;
                            const previousChainId = data.tokens[data.tokens.indexOf(token) - 1]?.chain_id;

                            const delegateCall = delegatedCalls.find((call) => 
                                call.target === token.ethereum_address && call.chainId === chainId
                            );

                            return (
                                thisToken && (<TokenRow
                                    key={`${token.ethereum_address}-${token.chain_id}`} 
                                    token={thisToken}
                                    delegateCall={delegateCall}
                                    first={chainId !== previousChainId}
                                    isClicked={thisToken.selected}
                                    onClick={() => onSelect(thisToken)}
                                />)
                            )
                        })}

                    <button className="delegate" onClick={onDelegate}>
                        {selectedTokens && isPrepared ? "Delegate now" : "Sign delegations"}
                    </button>

                    <p>Powered by <strong>Charlie</strong>.</p>
                </div>
            </div >

            <button
                className="delegation-button"
                style={{
                    backgroundColor: data.hex_color,
                    color: textColor,
                }}
                onClick={() => setIsModalOpen(!isModalOpen)}
            >
                {data.text}
            </button>
        </>
    );
};

export { Button };