import { ethers } from "ethers";

import { providers, MULTICALL_ABI } from "./config";

const multiCallContracts: {
    [chainId: number]: `0x${string}`;
} = {
    1: "0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441",
    10: "0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441",
}

const getMultiCall = async (chainId: number) => {
    console.log('getting multi call address', chainId)

    const provider: ethers.providers.AlchemyProvider = providers[Number(chainId)];

    const multiCallContractAddress = multiCallContracts[chainId];
    const multiCallContract = new ethers.Contract(multiCallContractAddress, MULTICALL_ABI, provider);

    return multiCallContract;
}

export { getMultiCall }