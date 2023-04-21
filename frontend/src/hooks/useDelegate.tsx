import { ethers } from "ethers";

import { useState } from "react";

import { usePrepareContractWrite, useContractWrite, useSwitchNetwork } from "wagmi";

import { signTypedData } from "@wagmi/core";

import { VotesToken, DelegatedCall } from "../types";

import { getTypedDelegations, ERC20_VOTES_ABI, MULTICALL, MULTICALL_ABI } from "../utils";

const useDelegate = ({
    chainId,
    tokens,
    blocking = false,
 } : { 
    chainId: number,
    tokens: VotesToken[],
    blocking: boolean
 }) => {
    const [delegatedCalls, setDelegatedCalls] = useState<DelegatedCall[]>([]);

    const { switchNetworkAsync } = useSwitchNetwork();

    const args = delegatedCalls.map((call) => ({
        target: call.target,
        allowFailure: !blocking,
        callData: call.callData as `0x${string}`
    }));

    const isSigningNeeded = Boolean(
        tokens.length !== delegatedCalls.length ||
        delegatedCalls.some((call) => call.status !== 'signed')
    );

    const { config, isSuccess: isPrepared } = usePrepareContractWrite({
        enabled: !isSigningNeeded,
        chainId: chainId ?? 1,
        address: MULTICALL,
        abi: MULTICALL_ABI,
        functionName: "aggregate3",
        args: [args],
    });

    const { writeAsync } = useContractWrite(config);

    // Does a call exist for this token?
    const isTokenCall = (call: DelegatedCall, token: VotesToken) => {
        return call.chainId === token.chainId &&
            call.target === token.address;
    }

    // Remove a call for a token
    const onRemoveCall = (token: VotesToken) => {
        setDelegatedCalls((prev) => prev.filter((call) => !isTokenCall(call, token)));
    }

    // Initiate the signature queue
    const openDelegationSignatures = async ({
        onError = (e: any) => { console.error(e) },
        onStart = (token: VotesToken) => { },
        onSign = (token: VotesToken) => { },
        onSuccess = () => { }
    }) => {
        const votesInterface = new ethers.utils.Interface(ERC20_VOTES_ABI);

        // Initialize new selected tokens with queued status
        for (const token of tokens) {
            const delegatedCall = delegatedCalls.find((call) => isTokenCall(call, token));

            if (delegatedCall && delegatedCall.status === 'signed') continue;

            setDelegatedCalls((prev) => {
                if (delegatedCall) return (prev.map((call) => isTokenCall(call, token) ? 
                    { ...call, status: 'queued' } : call));

                else return [...prev, { chainId: token.chainId, 
                    target: token.address as `0x${string}`, status: 'queued'}];
            });
        }
        
        // Get the EIP 712 messages for each token
        const { messages } = getTypedDelegations(tokens);
        
        // Queue the signing of each message
        for (const [i, message] of messages.entries()) {
            try {
                const token = tokens[i];
                const delegatedCall = delegatedCalls.find((call) => isTokenCall(call, token));
                
                // If the call already exists and is signed, skip it.
                if (delegatedCall && delegatedCall.status === 'signed') continue;
    
                // Trigger start effects
                onStart(token);
                
                // If the call already exists, add the calldata and update status of 
                // the call, else push the call.
                setDelegatedCalls((prev) => {
                    const call = prev.find((call) => isTokenCall(call, token));

                    if (call) return (prev.map((call) => isTokenCall(call, token) ? 
                        { ...call, status: 'pending' } : call));

                    else return [...prev, { chainId: token.chainId, 
                        target: token.address as `0x${string}`, status: 'pending'}];
                });
                
                // Switch network if necessary
                if (chainId !== token.chainId && switchNetworkAsync)
                    await switchNetworkAsync(token.chainId);
                
                // Sign the message
                const signature = await signTypedData(message);
                onSign(token);
   
                // Build the call data
                const { v, r, s } = ethers.utils.splitSignature(signature);
                const callData = votesInterface.encodeFunctionData("delegateBySig", [
                    token.delegatee,
                    token.nonce,
                    token.expiry,
                    v,
                    r,
                    s,
                ]);
    
                // Add the calldata and update status of the call
                setDelegatedCalls((prev) => prev.map((call) => isTokenCall(call, token) ? 
                    { ...call, callData, status: 'signed' } : call));                            
            } catch (e) {
                onError(e);
                // Set error for the rest of the txs and exit the loop.
                setDelegatedCalls((prev) => prev.map((call) => 
                    call.status === 'signed' ? call : { ...call, status: 'error' }));
                break;
            }
        }

        onSuccess();
    }

    // Send the multicall tx.
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
        isPrepared: isPrepared && !isSigningNeeded,
        isSigningNeeded: isSigningNeeded,
        delegatedCalls,
        onRemoveCall,
        openDelegationSignatures,
        openDelegationTx,
    }
}

export { useDelegate }