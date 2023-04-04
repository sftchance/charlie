import { SiweMessage } from "siwe";

import { path, get, post } from "../utils";

const useNonce = () => {
    const _get = async () => {
        return get(path(`api/auth/nonce/`))
    };

    return { get: _get }
}

const useAuthenticationMessage = ({ signer }: { signer: any }) => {
    const { get: getNonce } = useNonce();

    const get = async ({ chainId, address }: {
        chainId: number;
        address: `0x${string}`;
    }): Promise<{ message: SiweMessage, signature: `0x${string}` }> => {
        const nonce = await getNonce();

        const statement = `Valid for 3 hours.`;

        const message = new SiweMessage({
            domain: document.location.host,
            address,
            chainId: chainId,
            uri: document.location.origin,
            version: '1',
            statement: statement,
            nonce: nonce.nonce,
        });

        const signature = await signer.signMessage(message.prepareMessage());

        return { message, signature };
    }

    return { get }
}

const useAuthenticate = () => {
    const _post = async ({ address, message, signature }: {
        address: `0x${string}`;
        message: SiweMessage;
        signature: `0x${string}`
    }): Promise<{
        success: boolean;
        message: `0x${string}`
    }> => {
        return post(path(`api/auth/login`), { message, signature })
            .then((res) => {
                localStorage.setItem('address', address);

                return res
            })
            .catch((errors) => {
                console.log(errors)
            })
    };

    return { post: _post }
}

export { useNonce, useAuthenticationMessage, useAuthenticate }