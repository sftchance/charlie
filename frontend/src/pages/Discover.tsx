import "./Discover.css"

const Discover = () => {
    // TODO: a list of 8 people with 2 sponsored spots.
    const delegates = []
    // TODO: 50 most recent successful delegations through Charlie.
    const recent = []

    return (
        <div className="recent">
            <div className="hero">
                <div className="container">
                    <div className="content">
                        <h1>Dive into the latest activity inside the <span>Charlie</span> ecosystem.</h1>

                        <h2>Top delegates</h2>
                        
                        <h2>Recent Ecosystem Activity</h2>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { Discover }