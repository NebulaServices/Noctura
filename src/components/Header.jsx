import React, { useState, useEffect } from 'react';
import Link from './Link';
import Hamburger from './Burger';
import '../header.css';

const routes = [
    { id: 1, title: 'Search', path: '/' },
    { id: 2, title: 'Artificial Intelligence', path: '/ai' },
    { id: 3, title: 'Games', path: '/games' },
    { id: 4, title: 'Media', path: '/media' },
    { id: 5, title: 'Console', path: '/console' },
    { id: 6, title: 'Settings', path: '/settings' },
];

const Header = (props) => {
  let hovered = false;

  const { data: url } = props;
  const [currentLocation, setCurrentLocation] = useState(routes.find(route => route.path == url.pathname));

  useEffect(() => {
    if (url.pathname) setCurrentLocation(routes.find(route => route.path == url.pathname));
  }, []);

  const onHover = (e) => {
    if (e.target.tagName !== 'A') return;
    
    const rect = e.target.getBoundingClientRect();

    document.getElementById('nav-move').style.width = (rect.width - 10) + 'px';
    document.getElementById('nav-move').style.height = (rect.height + 4) + 'px';

    requestAnimationFrame(() => {
        document.getElementById('nav-move').style.display = 'block';
        document.getElementById('nav-move').style.opacity = '1';
    });

    if (!hovered) {
        document.getElementById('nav-move').style.transition = `0`;
        document.getElementById('nav-move').style.opacity = '0';
        document.getElementById('nav-move').style.transition = `0.2s`;
    }

    document.getElementById('nav-move').style.left = `${rect.x - 14 + 5}px`;

    hovered = true;
  };

  const noHover = (e) => {
    if (e.target.tagName !== 'A') return;

    const rect = e.target.getBoundingClientRect();

    if (e.clientY >= rect.bottom || e.clientY <= rect.top) {
        hovered = false;
        document.getElementById('nav-move').style.opacity = '0';
        setTimeout(function() {
            document.getElementById('nav-move').style.display = 'none';
        }, 200);
    }
  };

  return (
    <div className="header">
        <div className="top">
            <div className="top-left">
                <Link href="/"><img src="/favicon.ico" className="nav-icon" alt="logo" /></Link>
                <hr className="nav-slash" />
                <Link target="_blank" href="https://titaniumnetwork.org"><img src="/tn.png" className="tn-icon" alt="logo" /></Link>
            </div>
            
            <div className="top-right">
                <Link className="feedback-btn" href="/feedback">
                    <span className="nav-btn-title">Feedback</span>
                </Link>

                <Link className="extra-btn" href="https://discord.gg/unblock">
                    <span className="nav-btn-title">Discord</span>
                </Link>

                <Link className="extra-btn" href="/changelog">
                    <span className="nav-btn-title">Changelog</span>
                </Link>

                <Link className="extra-btn" href="/support">
                    <span className="nav-btn-title">Support</span>
                </Link>

                <Link className="extra-btn" href="/docs">
                    <span className="nav-btn-title">Docs</span>
                </Link>

                <Hamburger>
                    <Link href="/help" className="hamburger-link">Help</Link>
                    <Link href="/veer" className="hamburger-link">Other</Link>
                    <input style={{width: 200}} placeholder="placeholder" />
                </Hamburger>
            </div>
        </div>

        <div className="bottom">
            <div className="nav-btns">
                <div id="nav-move" className="nav-move"></div>
                {routes.map((route) => (
                    <Link
                        className={`nav-btn ${currentLocation && currentLocation.id == route.id ? 'active' : ''}`}
                        key={route.id}
                        href={route.path}
                        onMouseOver={onHover}
                        onMouseLeave={noHover}
                    >
                        <span className="nav-btn-title">{route.title}</span>
                    </Link>
                ))}
            </div>
        </div>
    </div>
  );
};

export default Header;
