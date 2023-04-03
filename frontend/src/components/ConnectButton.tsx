import { useAuthentication } from "../hooks";

const ConnectButton = (props: any) => {
    const { login } = useAuthentication();

    return <button {...props} onClick={login}>
        <span className="content">Connect Wallet</span>
    </button>
}

export { ConnectButton }