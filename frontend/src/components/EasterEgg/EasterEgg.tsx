import "./EasterEgg.css"

const EasterEgg = ({ found, toggle }: { found: boolean, toggle: () => void }) => {
    const quotes = [
        "Don't be a spectator, be a player in the game of decentralization.",
        "Your vote is your voice, use it wisely",
        "Don't let your tokens gather dust, put them to work!",
        "Together we can change the world, one token at a time.",
        "Don't be a silent partner, use your tokens to shape the future of the network.",
        "Be the change you want to see in the world, use your tokens to vote for it.",
        "Don't let the future be decided by others, make your voice heard with your tokens.",
    ]

    const quote = quotes[Math.floor(Math.random() * quotes.length)]

    const twitter = `https://twitter.com/intent/tweet?text="${quote}%0A-%20%40trycharlie%20%0A%0AHead%20over%20to%20https%3A%2F%2Ftrycharlie.xyz%20to%20manage%20all%20your%20governance%20tokens%20in%20one%20place%20and%20help%20make%20web3%20decentralized%20once%20and%20for%20all%21`

    return (
        <div
            className={`easteregg ${found === true ? "found" : ""}`}
            onClick={toggle}
        >
            <p className="tag">You've found an easter egg!</p>

            <div className="container">
                <h1><span>"</span>{quote}<span>"</span></h1>
                <h4>- ChapGPT (<em>maybe</em>)</h4>

                <a href={twitter} target="_blank" rel="noreferrer">
                    <button className="twitter">
                        <span>Share on Twitter</span>
                    </button>
                </a>

                <hr />

                <h2>Seriously though... Dormant voting power in decentralized governance is a big deal.</h2>
                <p className="lead">There are way too many governance tokens sitting idle; not being used to vote or delegate. With Charlie, we can make our ecosystem healthier and more secure by improving the level of decentralization.</p>

                <p className="lead">In recent law cases, it has been a primary point of focus that governance is often not truly decentralized; Especially not in DAOs and DeFi.</p>

                <p className="lead">Help secure the "future of France" by making sure your governance tokens are being put to use! When you've checked on yours, tell your friends to do the same. We can make a difference together.</p>
            </div>
        </div>
    )
}

export { EasterEgg }