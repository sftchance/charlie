import { useAuthentication } from '../hooks'

const DisconnectButton = () => {
    const { logout } = useAuthentication();

    return <button onClick={logout}>Log out</button>
}

export { DisconnectButton }