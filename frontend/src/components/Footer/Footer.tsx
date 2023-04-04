import { Link } from 'react-router-dom'

import charlie from '../../assets/charlie.svg'

import "./Footer.css"

const Footer = () => {
    return (
        <>
            <footer>
                <Link to="/"><img src={charlie} alt="Charlie logo" /></Link>
                <p>Harnessing the power of governance tokens across all chains to decentralize your favorite organizations.</p>
            </footer>

            <div className="copyright">
                <p>Charlie © 2023</p>
                <p>Made by <a href="https://twitter.com/nftchance" target="_blank" rel="noreferrer">🟠 CHANCE</a></p>
            </div>
        </>
    )
}

export { Footer }