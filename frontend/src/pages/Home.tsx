import { useState } from "react"

import { ConnectButton, EasterEgg } from "../components"

import "./Home.css"

const Home = () => {
    const [easterEggFound, setEasterEggFound] = useState(false)

    const toggleEasterEgg = () => {
        setEasterEggFound(!easterEggFound)
    }

    return (
        <div className="home">
            <EasterEgg found={easterEggFound} toggle={toggleEasterEgg} />

            <div className="hero">
                <div className="content">
                    <h1>Transform Your Social Influence into Delegation Power with <span className="gradient" onClick={toggleEasterEgg}>one click</span>.</h1>
                    <p className="lead">Unleash the power of the social networks surrounding governance tokens with the ability to harvest voting power - no coding needed.</p>

                    <div className="buttons">
                        <ConnectButton />

                        <button className="primary secondary" type="submit">
                            <span className="content">Delegate to Charlie</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { Home }