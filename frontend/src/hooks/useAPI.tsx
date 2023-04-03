import { SiweMessage } from "siwe";

import { getCSRFToken } from "../utils";

const useNonce = () => {
    const get = async () => {
        return fetch(`http://localhost:8000/api/auth/nonce/`, {
            method: "GET",
            headers: {},
            credentials: 'include',
            mode: 'cors'
        })
            .then((res): any => {
                if (res.status >= 400) {
                    return res.json().then((data) => {
                        return Promise.reject(data)
                    })
                }

                return res
            })
            .then((res) => res.json())
            .catch((errors) => {
                console.log(errors)
            })
    };

    return { get }
}

const useAuthenticationMessage = ({ signer }: { signer: any }) => {
    const { get: getNonce } = useNonce();

    const get = async ({ chainId, address }: {
        chainId: number;
        address: `0x${string}`;
    }): Promise<{ message: SiweMessage, signature: `0x${string}` }> => {
        const csrfToken = getCSRFToken();

        if (!csrfToken) throw new Error("CSRF Token not found.");

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
    const post = async ({ message, signature }: {
        message: SiweMessage;
        signature: `0x${string}`
    }): Promise<{
        success: boolean;
        message: `0x${string}`
    }> => {
        return fetch(`http://localhost:8000/api/auth/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
            body: JSON.stringify({ message, signature }),
            credentials: 'include'
        })
            .then((res): any => {
                if (res.status >= 400) {
                    return res.json().then((data) => {
                        return Promise.reject(data)
                    })
                }

                return res
            })
            .then((res) => res.json())
            .catch((errors) => {
                console.log(errors)
            })
    };

    return { post }
}

export { useNonce, useAuthenticationMessage, useAuthenticate }