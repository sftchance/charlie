import { useNavigate } from "react-router-dom";

import { useAuthentication, useENS } from "../../hooks";

const WalletButton = (props: any) => {
    const navigate = useNavigate();

    const {
        address,
        authenticate,
        isLoading,
        isAuthenticated
    } = useAuthentication();

    const { ensName } = useENS(address);

    if (!address) return <></>;

    const buttonText = props.buttonText ? props.buttonText : isAuthenticated ? ensName : "Authenticate";

    const onClick = () => {
        if (isLoading) return;

        if (isAuthenticated) {
            navigate("/account/");
            return
        }

        authenticate();
    }

    return <button {...props} className="primary" onClick={onClick}>
        <span className="content">{buttonText}</span>
    </button>
}

export { WalletButton }