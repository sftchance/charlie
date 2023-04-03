import { createContext, useState } from "react";

import { useAccount, useConnect, useDisconnect } from "wagmi";

import { InjectedConnector } from 'wagmi/connectors/injected'

interface AuthenticationContextType {
    address: `0x${string}` | undefined;
    user: any;
    login: (user: any) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthenticationContext = createContext<AuthenticationContextType>({
    address: undefined,
    user: null,
    login: () => { },
    logout: () => { },
    isAuthenticated: false,
});

const AuthenticationProvider = ({ children }: any) => {
    const { address } = useAccount();

    const [user, setUser] = useState(null);

    const isAuthenticated = user === address;

    const { connect: login } = useConnect({
        connector: new InjectedConnector(),
        onSuccess: (response: any) => {
            setUser(response.address);
        }
    })

    const { disconnect: logout } = useDisconnect({
        onSuccess: () => {
            setUser(null);
        }
    });

    return (
        <AuthenticationContext.Provider value={{
            address,
            user,
            login,
            logout,
            isAuthenticated
        }}>
            {children}
        </AuthenticationContext.Provider>
    );
};

export { AuthenticationContext, AuthenticationProvider };