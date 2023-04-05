import { ethers } from "ethers";

import { useState } from "react";

import { usePrepareContractWrite, useContractWrite, useNetwork, useSwitchNetwork } from "wagmi";

import { signTypedData } from "@wagmi/core";

import { getTypedDelegations } from "../utils";

import { VotesToken, DelegatedCall } from "../types";

import { ERC20_VOTES_ABI } from "../utils";

import CharlieABI from "../abis/Charlie.json";

const useDelegate = (tokens: VotesToken[], blocking: boolean) => {
    const [delegatedCalls, setDelegatedCalls] = useState<DelegatedCall[]>([]);

    const isReady = tokens && tokens.length === delegatedCalls.length &&
        delegatedCalls.every((call) => call.status === 'signed');

    const { chain } = useNetwork();

    const { switchNetwork } = useSwitchNetwork();

    const args = delegatedCalls.map((call) => ({
        target: call.target,
        callData: call.callData as `0x${string}`,
    }));

    const { config, isSuccess: isPrepared } = usePrepareContractWrite({
        enabled: isReady,
        chainId: chain?.id,
        address: "0xbD8488016B3A84647c1230f934A6EDF522Cbd0d9", // TODO: Contract addresses
        abi: CharlieABI,
        functionName: "aggregate",
        args: [args, blocking],
    });

    const { writeAsync } = useContractWrite(config);

    const isTokenCall = (call: DelegatedCall, i: number) => {
        return call.chainId === tokens[i].chainId &&
            call.target === tokens[i].address;
    }

    const openDelegationSignatures = async ({
        onError = (e: any) => { console.error(e) },
        onStart = (token: VotesToken) => { },
        onSign = (token: VotesToken) => { },
        onSuccess = () => { }
    }) => {
        const votesInterface = new ethers.utils.Interface(ERC20_VOTES_ABI);
    
        // Get the EIP 712 messages for each token
        const { messages } = getTypedDelegations(tokens);
        
        
        for (const [i, message] of messages.entries()) {
            const delegateCall: DelegatedCall = {
                chainId: tokens[i].chainId,
                target: tokens[i].address as `0x${string}`,
                status: 'pending'
            }
            console.log('message', message, delegatedCalls)

            try {
                if (delegatedCalls[i] && delegatedCalls[i].status === 'signed') continue;

                // Switch to the correct network
                if (chain && chain.id !== message.domain.chainId && switchNetwork)
                    await switchNetwork(message.domain.chainId);

                // Trigger start effects
                onStart(tokens[i]);
                setDelegatedCalls((prev) => [...prev, delegateCall]);
                
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
                setDelegatedCalls((prev) => prev.map((call) => 
                    isTokenCall(call, i) ? { ...call, callData, status: 'signed' } : call));                            
            } catch (e) {
                onError(e);
                setDelegatedCalls((prev) => prev.map((call) =>
                    isTokenCall(call, i) ? { ...delegateCall, status: 'error' } : call));
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