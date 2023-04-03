import { useAuthentication } from "../hooks";

const ConnectButton = (props: any) => {
    const { address, login } = useAuthentication();

    const buttonText = address ? "Sign In" : "Connect Wallet";

    return <button {...props} onClick={login}>
        <span className="content">{buttonText}</span>
    </button>
}

export { ConnectButton }