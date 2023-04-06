import { createContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useDisconnect } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit"

import { useAuthenticationSignature } from "../hooks";

interface AuthenticationContextType {
    address: `0x${string}` | undefined;
    user: any;
    login: ((() => void) | undefined);
    authenticate: () => void;
    logout: () => void;
    isLoading: boolean;
    isAuthenticated: boolean;
}

const AuthenticationContext = createContext<AuthenticationContextType>({
    address: undefined,
    user: null,
    login: () => { },
    authenticate: () => { },
    logout: () => { },
    isLoading: false,
    isAuthenticated: false,
});

const AuthenticationProvider = ({ children }: any) => {
    const navigate = useNavigate();

    const { openConnectModal: login } = useConnectModal()

    const { address, authenticate } = useAuthenticationSignature({
        onLoading: () => setIsLoading(true),
        onSuccess: ({ address }) => {
            setUser(address);

            setIsLoading(false)

            navigate("/account/")
        },
        onError: () => setIsLoading(false)
    });

    const { disconnect: logout } = useDisconnect({
        onSuccess: () => {
            localStorage.removeItem('address');

            setUser(undefined);
            setIsLoading(false)

            navigate('/');
        }
    });

    const [user, setUser] = useState(address);

    const [isLoading, setIsLoading] = useState(false);

    const localStorageAddress = localStorage.getItem('address') as `0x${string}` | undefined;

    const isAuthenticated = !isLoading && user === address && localStorageAddress === address;

    useEffect(() => {
        if (localStorageAddress && !user) {
            setUser(localStorageAddress);
        }
    }, [])

    return (
        <AuthenticationContext.Provider value={{
            address,
            user,
            login,
            authenticate,
            logout,
            isLoading,
            isAuthenticated
        }}>
            {children}
        </AuthenticationContext.Provider>
    );
};

export { AuthenticationContext, AuthenticationProvider };