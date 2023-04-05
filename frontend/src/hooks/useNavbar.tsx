import { useContext, useEffect } from "react";

import { NavbarContext } from "../contexts/NavbarContext";

const useNavbar = (navigationLinks: JSX.Element | undefined) => {
    const { links: _links, setLinks } = useContext(NavbarContext);

    useEffect(() => {
        if (navigationLinks)
            setLinks(navigationLinks);

        return () => setLinks(null);
    }, []);

    return { links: _links, setLinks };
};

export { useNavbar };