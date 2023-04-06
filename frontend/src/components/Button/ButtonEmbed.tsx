import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import { TokenRow } from "../";

import { useClient, useColor } from "../../hooks";

import { getBalances } from "../../utils";

import "./ButtonEmbed.css";

const ButtonEmbed = () => {
    const { buttonId } = useParams<{ buttonId: string }>();

    const { get, path } = useClient();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [balances, setBalances] = useState<any>(null);

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

    useEffect(() => {
        if (!data) return;

        getBalances({
            address: "0x62180042606624f02d8a130da8a3171e9b33894d",
            tokens: data.tokens,
            includeZeros: true
        }).then(({ results }) => {
            setBalances(results)
        })
    }, [isLoading])

    if (isLoading) return <>{"Loading..."}</>;

    if (error) return <>{"An error has occurred: " + error.message}</>;

    return (
        <>
            <div
                className={isModalOpen ? "modal" : "modal hidden"}
                onClick={() => setIsModalOpen(false)}>
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
                                <TokenRow
                                    key={`${token.ethereum_address}-${token.chain_id}`}
                                    token={token}
                                    balance={balance}
                                    first={chainId !== previousChainId}
                                />
                            )
                        })}

                    <button className="delegate">Delegate now</button>

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
