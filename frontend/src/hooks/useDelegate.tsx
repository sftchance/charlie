import { ethers } from "ethers";

import { useState } from "react";

import { usePrepareContractWrite, useContractWrite } from "wagmi";

import { signTypedData } from "@wagmi/core";

import { getTypedDelegations } from "../utils";

import { VotesToken, DelegatedCall } from "../types";

import { ERC20_VOTES_ABI } from "../utils";

const useDelegate = (tokens: VotesToken[], blocking: boolean) => {
    const [delegatedCalls, setDelegatedCalls] = useState<DelegatedCall[]>([]);

    const isReady = tokens && tokens.length === delegatedCalls.length;

    const { config, isSuccess: isPrepared } = usePrepareContractWrite({
        enabled: isReady,
        address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // TODO: Contract addresses
        abi: ERC20_VOTES_ABI,
        functionName: "aggregate",
        args: [delegatedCalls, blocking],
    });

    const { writeAsync } = useContractWrite(config);

    const openDelegationSignatures = async ({
        onError = (e: any) => { console.error(e) },
        onStart = (token: VotesToken) => { },
        onSign = (token: VotesToken) => { },
        onSuccess = () => { }
    }) => {
        const votesInterface = new ethers.utils.Interface(ERC20_VOTES_ABI);
    
        // Get the EIP 712 messages for each token
        const messages = getTypedDelegations(tokens);
    
        for (const [i, message] of messages.entries()) {
            try {
                const call: DelegatedCall = {
                    chainId: tokens[i].chainId,
                    target: tokens[i].ethereum_address as `0x${string}`,
                    status: 'pending'
                }

                // Trigger start effects
                onStart(tokens[i]);
                setDelegatedCalls((prev) => [...prev, call]);
                
                // Sign the message
                const signature = await signTypedData(message);
                onSign(tokens[i]);
    
                // Build the call data
                const { v, r, s } = ethers.utils.splitSignature(signature);
                const callData = votesInterface.encodeFunctionData("delegateBySig", [
                    tokens[i].delegatee,
                    tokens[i].nonce,
                    tokens[i].expiry,
                    v,
                    r,
                    s,
                ]);
    
                // Add the calldata and update status of the call
                setDelegatedCalls((prev) => 
                    prev.map((call) => call.target === tokens[i].ethereum_address ? 
                        { ...call, calldata: callData, status: 'signed' } : call));                            

            } catch (e) {
                console.error(e);
                onError(e);
                setDelegatedCalls((prev) =>
                    prev.map((call) => call.target === tokens[i].ethereum_address ?
                        { ...call, status: 'error' } : call));
            }
        }

        onSuccess();
    }

    const openDelegationTx = async ({
        onError = (e: any) => { console.error(e) },
        onStart = () => { },
        onSign = () => { },
        onSuccess = () => { }
    }) => {
        if (!writeAsync) return;
        
        try {
            onStart();

            const tx = await writeAsync();
            onSign();

            
            const receipt = await tx.wait();

            onSuccess();
            console.log(receipt);
        } catch (e) { 
            console.error(e); 
            onError(e);
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