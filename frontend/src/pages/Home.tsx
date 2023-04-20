import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { Navbar, EasterEgg } from "../components"

import "./Home.css"

const Home = () => {
    const navigate = useNavigate()

    const [easterEggFound, setEasterEggFound] = useState(false)

    const toggleEasterEgg = () => {
        setEasterEggFound(!easterEggFound)
    }

    return (
        <div className="home">
            <Navbar className="fixed" />

            <EasterEgg found={easterEggFound} toggle={toggleEasterEgg} />

            <div className="hero">
                <div className="content">
                    <img src="/white-logo-fancy.png" alt="Charlie Logo" className="logo" onClick={toggleEasterEgg} />

                    <div>
                        <h1>A single button for governance token delegation.</h1>
                        <p className="lead">Imagine if growing your delegation power in onchain governance was simple as pressing a button... Oh wait... you can right now!</p>

                        <div className="buttons">
                            <button onClick={() => { navigate('/account/') }}>Enter App</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { Home }