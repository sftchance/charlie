import { Link } from "react-router-dom"

import { ConnectButton, Search } from "../components"

import "./Home.css"

const Home = () => {
    const exampleAddress = "0x5e349eca2dc61aBCd9dD99Ce94d04136151a09Ee"

    return (
        <div className="home">
            <div className="hero">
                <div className="container">
                    <div className="content">
                        <h1>Manage and delegate your governance tokens across every chain in one click.</h1>
                        <p className="lead">Unlock the full power of the network around governance tokens with the ability to delegate all your voting power - no coding needed.</p>

                        <div className="buttons">
                            <ConnectButton />
                            <p>or</p>
                            <Search />
                        </div>

                        <Link to={`/account/${exampleAddress}`} className="example">View example wallet</Link>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="benefits">
                    <div className="card benefit">
                        <h3>Make holding governance tokens worth it</h3>
                        <p>Unlock the full power of the network around governance tokens with the ability to delegate all your voting power - no coding needed.</p>
                    </div>

                    <div className="card benefit">
                        <h3>Delegate your tokens in one click</h3>
                        <p>Delegate your tokens across every chain in one click. No coding needed.</p>
                    </div>

                    <div className="card benefit">
                        <h3>Manage your tokens across every chain</h3>
                        <p>Manage your tokens across every chain in one place. No coding needed.</p>
                    </div>

                    <div className="card benefit">
                        <h3>Unlock the full power of the network</h3>
                        <p>Unlock the full power of the network around governance tokens with the ability to delegate all your voting power - no coding needed.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { Home }