import { useState } from 'react'

import { Link } from 'react-router-dom'

import { useNavbar } from '../../hooks';

import "./Navbar.css"

const Navbar = ({ className = "" }: { className?: string }) => {
    const { links } = useNavbar(undefined);

    const [collapsed, setCollapsed] = useState(false);

    return <nav className={`${collapsed ? "collapsed" : ""} ${className}`}>
        <Link to="/">
            <img src={className === "" ? "/black-logo-word.png" : "/white-logo-word.png"}
                alt="Charlie" />
        </Link>

        <div className="hamburger" onClick={() => setCollapsed(!collapsed)}>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
        </div>

        <div className="links right">{links}</div>
    </nav>
}

export { Navbar }