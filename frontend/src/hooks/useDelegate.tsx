import { ethers } from "ethers";

import { useState } from "react";

import { usePrepareContractWrite, useContractWrite } from "wagmi";

import { getSignedDelegations } from "../utils";

import { VotesToken, DelegatedCall } from "../types";

import { ERC20_VOTES_ABI } from "../utils";

const useDelegate = (tokens: VotesToken[], blocking: boolean) => {
    const [delegatedCalls, setDelegatedCalls] = useState<DelegatedCall[]>([]);

    const isReady = false;

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
        onLoading = () => { },
        onSuccess = () => { }
    }) => {
        const votesInterface = new ethers.utils.Interface(ERC20_VOTES_ABI);

        const signatures = await getSignedDelegations(tokens);

        console.log('tokens22', tokens)

        signatures.map((signature, index) => {
            const { v, r, s } = ethers.utils.splitSignature(signature);

            const callData = votesInterface.encodeFunctionData("delegateBySig", [
                tokens[index].delegatee,
                tokens[index].nonce,
                tokens[index].expiry,
                v,
                r,
                s,
            ]);

            const call = {
                target: tokens[index].ethereum_address as `0x${string}`,
                callData,
            }

            setDelegatedCalls((prev) => [...prev, call]);
        });

        console.log(signatures);
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