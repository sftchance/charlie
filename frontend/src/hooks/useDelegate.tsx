import { ethers } from "ethers";

import { useState } from "react";

import { usePrepareContractWrite, useContractWrite } from "wagmi";

import { getSignedTransactions } from "../utils"

import { DelegationCall, DelegatedCall } from "../types";

import ERC20Votes from "../abis/ERC20Votes.json";

const useDelegate = (calls: DelegationCall[], blocking: boolean) => {
    const [delegatedCalls, setDelegatedCalls] = useState<DelegatedCall[]>([]);

    const isReady = delegatedCalls.length > 0 && delegatedCalls.length === calls.length;

    const { config, isSuccess: isPrepared } = usePrepareContractWrite({
        enabled: isReady,
        address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // TODO: Contract addresses
        abi: ERC20Votes,
        functionName: "aggregate",
        args: [delegatedCalls, blocking],
    });

    const { writeAsync } = useContractWrite(config);

    const openDelegationSignatures = async (calls: DelegationCall[]) => {
        const votesInterface = new ethers.utils.Interface(ERC20Votes);

        const signatures = await getSignedTransactions(calls);

        signatures.map((signature, index) => {
            const { v, r, s } = ethers.utils.splitSignature(signature);

            const callData = votesInterface.encodeFunctionData("delegateBySig", [
                calls[index].delegatee,
                calls[index].nonce,
                calls[index].expiry,
                v,
                r,
                s,
            ]);

            const call = {
                target: calls[index].contractAddress,
                callData,
            }

            setDelegatedCalls((prev) => [...prev, call]);
        });

        console.log(signatures);
    }

    const openDelegationTx = async () => {
        if (!writeAsync) return;
        
        try {
            const tx = await writeAsync();

            const receipt = await tx.wait();

            console.log(receipt);
        } catch (e) { 
            console.error(e); 
        }
    }

    return { 
        isPrepared,
        delegatedCalls,
        openDelegationSignatures,
        openDelegationTx,
    }
}

export { useDelegate }