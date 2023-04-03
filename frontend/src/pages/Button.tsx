import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import { useAccount } from "wagmi";

import { TokenRow } from "../components";

import { useColor, useDelegate } from "../hooks";

import { getBalances } from "../utils";

import { Token } from "../types";

import "./Button.css";

const Button = () => {
    const { address } = useAccount();

    const { buttonId } = useParams<{ buttonId: string }>();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [balances, setBalances] = useState<any>(null);

    const [selected, setSelected] = useState<Token[]>([]);

    const { 
        isPrepared, 
        openDelegationSignatures, 
        openDelegationTx 
    } = useDelegate(selected, false);

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

    const onSelect = (token: any) => {
        setSelected(selected => (
            selected.indexOf(token) === -1 ? [...selected, token] : selected.filter((t) => t !== token)
        ))
    }

    useEffect(() => {
        if (!data) return;

        getBalances({
            address: address as `0x${string}`,
            tokens: data.tokens,
            includeZeros: true
        }).then(({ results }) => {
            setBalances(results)
        })
    }, [isLoading])

    if (isLoading) return <>{"Loading..."}</>;

    if (error) return <>{"An error has occurred: " + error.message}</>;

    console.log('selected', selected)

    return (
        <>
            <div
                className={isModalOpen ? "modal" : "modal hidden"}
                // onClick={() => setIsModalOpen(false)}
            >
                <div className="modal-content">
                    <span className="close">
                        &times;
                    </span>

                    <h1>{data.text}</h1>

                    {data.tokens
                        .sort((a: any, b: any) => b.chain_id - a.chain_id)
                        .map((token: any) => {
                            const balance = balances?.find((balance: any) => balance.address === token.address)?.balance

                            const chainId = token.chain_id;
                            const previousChainId = data.tokens[data.tokens.indexOf(token) - 1]?.chain_id;

                            return (
                                <div key={`${token.ethereum_address}-${token.chain_id}`} style={{ display: "flex", flexDirection: "row"}}>
                                    <input type="checkbox" onClick={() => onSelect(token)}/>
                                    <TokenRow
                                        token={token}
                                        balance={balance}
                                        first={chainId !== previousChainId}
                                    />
                                </div>
                            )
                        })}

                    <button className="delegate">Delegate now</button>

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
