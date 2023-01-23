import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

const ConnectButton = () => {
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })

    return <button onClick={() => {
        connect();
        window.location.href = "/account";
    }}>Connect Wallet</button>
}

export { ConnectButton }