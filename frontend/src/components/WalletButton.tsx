import { useNavigate } from "react-router-dom";

import { useAuthentication } from "../hooks";

const WalletButton = (props: any) => {
    const navigate = useNavigate();

    const {
        address,
        authenticate,
        isLoading,
        isAuthenticated
    } = useAuthentication();

    if (!address) return <></>

    const buttonText = isAuthenticated ? address.slice(0, 6) + "..." + address.slice(-4) : "Authenticate";

    const onClick = () => {
        if (isLoading) return;

        if (isAuthenticated) {
            navigate("/account");
            return
        }

        authenticate();
    }

    return <button {...props} className="primary" onClick={onClick}>
        <span className="content">{buttonText}</span>
    </button>
}

export { WalletButton }