import { ConnectButton, DisconnectButton, WalletButton } from "../components";

import { createContext, useState } from "react";

import { useAuthentication } from "../hooks";

const NavbarContext = createContext({
    links: <></>,
    setLinks: (links: any) => { }
});

const DefaultLinks = ({ isAuthenticated }: any) => <>
    <WalletButton />

    {isAuthenticated ? <DisconnectButton /> : <ConnectButton />}
</>

const NavbarProvider = ({ children }: any) => {
    const { isAuthenticated } = useAuthentication();

    const [links, setLinks] = useState(null);

    const navbarLinks = links || <DefaultLinks isAuthenticated={isAuthenticated} />;

    return (
        <NavbarContext.Provider value={{
            links: navbarLinks,
            setLinks
        }}>
            {children}
        </NavbarContext.Provider>
    );
};

export { NavbarContext, NavbarProvider }