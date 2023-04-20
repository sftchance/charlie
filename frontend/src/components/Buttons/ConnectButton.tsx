import { useAuthentication } from "../../hooks";

const ConnectButton = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    const { address, login } = useAuthentication();

    if (address) return <></>

    return <>
        <button
            className={`primary ${className}`}
            onClick={login}
            {...props}
        >
            <span className="content">Connect Wallet</span>
        </button>
    </>
}

export { ConnectButton }