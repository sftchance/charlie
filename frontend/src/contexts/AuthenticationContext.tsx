import { createContext, useState } from "react";

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

    const { openConnectModal: login } = useConnectModal()

    const { address, authenticate } = useAuthenticationSignature({
        onLoading: () => setIsLoading(true),
        onSuccess: ({ address }) => {
            setUser(address);

            setIsLoading(false)
        },
        onError: () => setIsLoading(false)
    });

    const { disconnect: logout } = useDisconnect({
        onSuccess: () => {
            setUser(undefined);
            setIsLoading(false)
        }
    });

    const [user, setUser] = useState(address);

    const [isLoading, setIsLoading] = useState(false);

    const isAuthenticated = !isLoading && user === address;

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