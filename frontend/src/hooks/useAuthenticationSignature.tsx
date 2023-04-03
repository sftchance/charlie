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

    const tryAuthentication = async ({ chainId, signer }: any) => {
        const address = signer._address;

        const { message, signature } = await get({ chainId, address });

        post({ message, signature })
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                onError(error)
            })
    };

    const authenticate = () => {
        if (!signer || !chain) return;

        const args = { chainId: chain.id, signer }

        onLoading(args);

        tryAuthentication(args)
            .then(() => {
                onSuccess(args);
            })
            .catch((error) => {
                onError(error)
            })
    }

    return { chain, address, signer, authenticate }
}

export { useAuthenticationSignature }