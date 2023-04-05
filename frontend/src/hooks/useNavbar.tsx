import { useContext, useEffect } from "react";

import { NavbarContext } from "../contexts/NavbarContext";

const useNavbar = (links: JSX.Element | undefined) => {
    const { links: _links, setLinks } = useContext(NavbarContext);

    useEffect(() => {
        if (links)
            setLinks(links);

        return () => {
            setLinks(null);
        };
    }, []);

    return { links: _links, setLinks };
};

export { useNavbar };