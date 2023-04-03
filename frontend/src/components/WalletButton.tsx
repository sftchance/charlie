import { useNavigate } from "react-router-dom";

import { useAuthentication } from "../hooks";

const WalletButton = (props: any) => {
    const navigate = useNavigate();

    const { address, authenticate, isAuthenticated } = useAuthentication();

    if (!address) return <></>

    const buttonText = isAuthenticated ? address.slice(0, 6) + "..." + address.slice(-4) : "Authenticate";

    const onClick = () => {
        if (isAuthenticated) {
            navigate("/account");
            return
        }

        authenticate();
        // prompt signing in
    }

    return <button {...props} className="primary" onClick={onClick}>
        <span className="content">{buttonText}</span>
    </button>
}

export { WalletButton }