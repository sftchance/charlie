import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi';

import { ConnectButton, DisconnectButton } from '../'

import charlie from "../../assets/charlie.svg";

import "./Navbar.css"

const Navbar = () => {
    const { address } = useAccount()

    return (
        <div className="container">
            <nav>
                <Link to="/"><img src={charlie} alt="Charlie" /></Link>

                <div className="links">
                    <Link to="/recent">Recent</Link>
                </div>

                <div className="links right">
                    {address && <Link to="account/">
                        <button>
                            {address.slice(0, 6) + "..." + address.slice(-4)}
                        </button>
                    </Link>}

                    {address ? <DisconnectButton /> : <ConnectButton />}
                </div>
            </nav>
        </div>
    )
}

export { Navbar }