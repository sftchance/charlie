import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

const ConnectButton = () => {
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })

    return <button onClick={() => connect()}>Connect Wallet</button>
}

export { ConnectButton }