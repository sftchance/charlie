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
        try {
            const votesInterface = new ethers.utils.Interface(ERC20_VOTES_ABI);
    
            // Get the EIP 712 messages for each token
            const messages = getTypedDelegations(tokens);
    
            messages.forEach(async (message, index) => {
                // Trigger start effects
                onStart(tokens[index]);
                
                // Sign the message
                const signature = await signTypedData(message);
                onSign(tokens[index]);
    
                // Build the call data
                const { v, r, s } = ethers.utils.splitSignature(signature);
                const callData = votesInterface.encodeFunctionData("delegateBySig", [
                    tokens[index].delegatee,
                    tokens[index].nonce,
                    tokens[index].expiry,
                    v,
                    r,
                    s,
                ]);
    
                // Add the call to the list of calls
                const call = {
                    chainId: tokens[index].chainId,
                    target: tokens[index].ethereum_address as `0x${string}`,
                    callData,
                }
                setDelegatedCalls((prev) => [...prev, call]);
            });
    
            onSuccess();
        } catch (e) {
            console.error(e);
            onError(e);
        }
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