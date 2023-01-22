import { useAccount, useDisconnect } from 'wagmi'

const DisconnectButton = () => {
    const { address } = useAccount()
    const { disconnect } = useDisconnect()

    return (
        <div>
            Connected to {address}
            <button onClick={() => disconnect()}>Disconnect</button>
        </div>
    )
}

export { DisconnectButton }