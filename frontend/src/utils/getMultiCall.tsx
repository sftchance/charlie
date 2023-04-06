import { ethers } from "ethers";

import { providers, MULTICALL, MULTICALL_ABI } from "./config";

const getMultiCall = async (chainId: number) => {
    const provider: ethers.providers.JsonRpcProvider = providers[Number(chainId)];

    const multiCallContractAddress = MULTICALL;
    const multiCallContract = new ethers.Contract(multiCallContractAddress, MULTICALL_ABI, provider);

    return multiCallContract;
}

const submitStaticMultiCalls = async ({ calls, provider }: { calls: any[], provider: ethers.providers.JsonRpcProvider }) => {
    const multiCallContract = await getMultiCall(provider.network.chainId);

    const multiCallResult = await multiCallContract.callStatic.aggregate3(calls);

    return multiCallResult;
}

export { getMultiCall, submitStaticMultiCalls }