import { ConnectButton, DisconnectButton, WalletButton } from "../components";

import { createContext, useState } from "react";

import { useAuthentication } from "../hooks";

const NavbarContext = createContext({
    links: <></>,
    setLinks: (links: any) => { }
});

const DefaultLinks = ({ address }: any) => <>
    <WalletButton buttonText="Log in" />

    {address ? <DisconnectButton /> : <ConnectButton />}
</>

const NavbarProvider = ({ children }: any) => {
    const { address } = useAuthentication();

    const [links, setLinks] = useState(null);

    const navbarLinks = links || <DefaultLinks address={address} />;

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