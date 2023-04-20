import { useAuthentication } from "../../hooks";

interface ConnectButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    buttonText?: string;
}

const ConnectButton = ({ buttonText, className, ...props }: ConnectButtonProps) => {
    const { address, login } = useAuthentication();

    if (address) return <></>

    const text = buttonText || "Connect Wallet";

    return <>
        <button
            className={`primary ${className}`}
            onClick={login}
            {...props}
        >
            <span className="content">{text}</span>
        </button>
    </>
}

export { ConnectButton }