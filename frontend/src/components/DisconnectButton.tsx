import { useAccount, useDisconnect } from 'wagmi'

const DisconnectButton = () => {
    const { address } = useAccount()
    const { disconnect } = useDisconnect()

    return (
        <div>
            <button onClick={() => disconnect()}>Disconnect</button>
        </div>
    )
}

export { DisconnectButton }