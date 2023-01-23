import { ConnectButton } from "../components"

import "./Home.css"

const Home = () => {
    return (
        <>
            <div className="hero">
                <div className="container">
                    <h1>Manage and delegate your governance tokens across every chain in one click now!</h1>
                    <p className="lead">Unlock the full power of the network around governance tokens with the ability to delegate all your voting power - no coding needed.</p>

                    <div className="buttons">
                        <ConnectButton />
                        <p>or</p>
                        <input type="text" placeholder="Enter your wallet address" />
                    </div>

                    <p>View example wallet</p>
                </div>
            </div>

            <div className="container">
            </div>
        </>
    )
}

export { Home }