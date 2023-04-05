import { useAuthentication } from "../../hooks";

const ConnectButton = (props: any) => {
    const { address, login } = useAuthentication();

    if (address) return <></>

    return <>
        <button className="primary" onClick={login}>
            <span className="content">Connect Wallet</span>
        </button>
    </>
}

export { ConnectButton }