import { useAuthentication } from '../../hooks'

const DisconnectButton = () => {
    const { logout, isAuthenticated } = useAuthentication();

    const buttonText = isAuthenticated ? "Log out" : "Disconnect";

    return <button onClick={logout}>{buttonText}</button>
}

export { DisconnectButton }