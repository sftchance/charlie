import { useState } from 'react'

import { Link } from 'react-router-dom'

import { useNavbar } from '../../hooks';

import charlie from "../../assets/charlie.svg";

import "./Navbar.css"

const Navbar = () => {
    const { links } = useNavbar(undefined);

    const [collapsed, setCollapsed] = useState(false);

    return <nav className={`${collapsed ? "collapsed" : ""}`}>
        <Link to="/"><img src={charlie} alt="Charlie" /></Link>

        <div className="hamburger" onClick={() => setCollapsed(!collapsed)}>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
        </div>

        <div className="links right">{links}</div>
    </nav>
}

export { Navbar }