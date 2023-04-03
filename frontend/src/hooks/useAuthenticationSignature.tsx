import { useAccount, useNetwork, useSigner } from "wagmi";

import { useAuthenticationMessage, useAuthenticate } from "./";

const useAuthenticationSignature = ({
    onLoading = () => { },
    onSuccess = (args: any) => { },
    onError = (e: any) => { console.error(e) },
}: {
    onLoading?: (args: any) => void;
    onSuccess?: (args: any) => void;
    onError?: (e: any) => void;
}) => {
    const { chain } = useNetwork();

    const { address } = useAccount();

    const { data: signer } = useSigner();

    const { get } = useAuthenticationMessage({ signer })

    const { post } = useAuthenticate();

    const tryAuthentication = async ({ chain, signer }: any) => {
        const address = signer._address;

        const args = {
            chainId: chain.id,
            address,
            signer
        }

        onLoading(args);

        const { message, signature } = await get({
            chainId: args.chainId,
            address: args.address
        });

        post({ address, message, signature })
            .then(() => {
                onSuccess(args)
            })
    };

    const authenticate = () => {
        if (!chain || !signer) return;

        tryAuthentication({ chain, signer })
            .catch((error) => {
                onError(error)
            })
    }

    return { chain, address, signer, authenticate }
}

export { useAuthenticationSignature }