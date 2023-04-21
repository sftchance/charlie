import { useNavigate } from "react-router-dom";

import { useAuthentication, useENS } from "../../hooks";

interface WalletButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    buttonText?: string;
}

const WalletButton = ({ buttonText, className, ...props }: WalletButtonProps) => {
    const navigate = useNavigate();

    const {
        address,
        authenticate,
        isLoading,
        isAuthenticated
    } = useAuthentication();

    const { ensName } = useENS(address);

    if (!address) return <></>;

    const text = isAuthenticated ? ensName : buttonText || "Authenticate your wallet";

    const onClick = () => {
        if (isLoading) return;

        if (isAuthenticated) {
            navigate("/account/");
            return
        }

        authenticate();
    }

    return <button
        className={`primary ${className}`}
        onClick={onClick}
        {...props}
    >
        <span className="content">{text}</span>
    </button>
}

export { WalletButton }