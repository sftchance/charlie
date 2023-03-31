import { useConnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

const ConnectButton = (props: any) => {
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })

    return <button
        {...props}
        onClick={() => {
            connect();
            window.location.href = "/account";
        }}><span className="content">Connect Wallet</span></button>
}

export { ConnectButton }