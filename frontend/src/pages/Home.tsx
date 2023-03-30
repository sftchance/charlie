import { useState } from "react"

import { ConnectButton, EasterEgg } from "../components"

import "./Home.css"

const Home = () => {
    const exampleAddress = "0x5e349eca2dc61aBCd9dD99Ce94d04136151a09Ee"

    const [easterEggFound, setEasterEggFound] = useState(false)

    const toggleEasterEgg = () => {
        setEasterEggFound(!easterEggFound)
    }

    return (
        <div className="home">
            <EasterEgg found={easterEggFound} toggle={toggleEasterEgg} />

            <div className="hero">
                <div className="container">
                    <div className="content">
                        <h1>Manage and delegate your governance tokens across every chain in <span className="gradient" onClick={toggleEasterEgg}>one click</span>.</h1>
                        <p className="lead">Unleash the power of the social networks surrounding governance tokens with the ability to harvest voting power - no coding needed.</p>

                        <div className="buttons">
                            <ConnectButton className="primary" />
                            <button className="primary secondary" type="submit">
                                <span className="content">Delegate to Charlie</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { Home }