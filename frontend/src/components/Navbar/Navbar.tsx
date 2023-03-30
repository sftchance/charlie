import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useAccount } from 'wagmi';

import { ConnectButton, DisconnectButton} from '../'

import charlie from "../../assets/charlie.svg";

import "./Navbar.css"

const Navbar = () => {
    const { address } = useAccount()

    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="container">
            <nav className={`${collapsed ? "collapsed" : ""}`}>
                <Link to="/"><img src={charlie} alt="Charlie" /></Link>

                <div className="hamburger" onClick={() => setCollapsed(!collapsed)}>
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                </div>

                <div className="links">
                    {/* <Link to="/discover">Discover</Link> */}
                </div>

                <div className="links right">
                    {address && <Link to="account/">
                        <button className="primary">
                            <span className="content">
                                {address.slice(0, 6) + "..." + address.slice(-4)}
                            </span>
                        </button>
                    </Link>}

                    {address ? <DisconnectButton /> : <ConnectButton />}
                </div>
            </nav>
        </div>
    )
}

export { Navbar }