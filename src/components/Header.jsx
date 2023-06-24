import React, { useState, useEffect } from 'react';
import Link from './Link';
import Hamburger from './Burger';
import '../header.css';
import './switch.css';

const routes = [
    { id: 1, title: 'Search', path: '/' },
    { id: 2, title: 'Artificial Intelligence', path: '/ai' },
    { id: 3, title: 'Games', path: '/games' },
    { id: 4, title: 'Media', path: '/media' },
    { id: 5, title: 'Console', path: '/console' },
    { id: 6, title: 'Settings', path: '/settings' },
];

const Header = (props) => {
  let cookie;

  try {
    cookie = props.cookie.split('; ').find(row => row.startsWith('astro-proxy')).split('=')[1];
  } catch {
    cookie = null;
  }

  let hovered = false;

  const { data: url } = props;
  const [currentLocation, setCurrentLocation] = useState(routes.find(route => route.path == url.pathname));

  const [currentDate, setCurrentDate] = useState(null);

  useEffect(() => {
    if (url.pathname) setCurrentLocation(routes.find(route => route.path == url.pathname));

    setCurrentDate(new Date().getTime());

    addEventListener('click', function(e) {
        if (recursive(document.getElementsByClassName('switch-btn')[0]).includes(e.target)) return;
    
        const switchBtn = document.getElementsByClassName('switch-btn')[0];
    
        if (switchBtn.style.display == 'block') {
            switchBtn.style.opacity = '0';
            setTimeout(function() {
                switchBtn.style.display = 'none';
            }, 100);
        }
      });
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

  const toggleSwitchBtn = (e) => {
    const switchBtn = document.getElementsByClassName('switch-btn')[0];

    if (switchBtn.style.display == 'block') {
        switchBtn.style.opacity = '0';
        setTimeout(function() {
            switchBtn.style.display = 'none';
        }, 100);
    } else {
        switchBtn.style.display = 'block';
        requestAnimationFrame(() => {
            switchBtn.style.opacity = '1';
        });
    }

    return e.stopPropagation();
  }
  
  const switchProxy = (e) => {
    const proxy = e.target.getAttribute('value');

    document.cookie = `astro-proxy=${proxy}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;

    e.target.parentNode.style.opacity = '0';

    document.querySelector('.switch-btn-current img').src = '/' + proxy + '.png';

    setTimeout(function() {
        e.target.parentNode.style.display = 'none';
    }, 100);

    return;
  }

  const recursive = (el) => {
    var arr = [];
    
    function iterate(el) {
        if (el.childNodes) el.childNodes.forEach(e=>(arr.push(e), iterate(e)));

        return;
    }

    arr.push(el);

    iterate(el)

    return arr;
  }

  return (
    <div className="header">
        <div className="top">
            <div className="top-left">
                <Link href="/"><img src="/favicon.ico" className="nav-icon" alt="logo" /></Link>
                <hr className="nav-slash" />
                <Link target="_blank" href="https://titaniumnetwork.org"><img src="/tn.png" className="tn-icon" alt="logo" /></Link>

                <div className="switch-btn-container">
                    <div className="switch-btn-current" onClick={toggleSwitchBtn}><img src={cookie ? '/' + cookie + '.png' : '/Dynamic.png'} /></div>
                    <div className="switch-btn" style={{background: props.background || '#000'}}>
                        <a onClick={switchProxy} value="Dynamic"><img src="/Dynamic.png" className="nav-switch-img" /> Dynamic</a>
                        <a onClick={switchProxy} value="Ultraviolet"><img src="/Ultraviolet.png" className="nav-switch-img" /> Ultraviolet</a>
                        <a onClick={switchProxy} value="Rammerhead"><img src="/Rammerhead.png" className="nav-switch-img" /> Rammerhead</a>
                    </div>
                </div>
            </div>
            
            <div className="top-right">
                <Link className="feedback-btn" href="mailto:akane@noctura.tech">
                    <span className="nav-btn-title">Feedback</span>
                </Link>

                <Link className="extra-btn" href="https://discord.gg/unblock">
                    <span className="nav-btn-title">Discord</span>
                </Link>

                <Link className="extra-btn" href="/changelog">
                    <span className="nav-btn-title">Changelog</span>
                </Link>

                <Link className="extra-btn" href="/docs">
                    <span className="nav-btn-title">Docs</span>
                </Link>

                <Hamburger>
                    <Link href="https://classroom.google.com" onClick={(e) => e.preventDefault() || typeof window !== 'undefined' && window.location.replace('https://classroom.google.com')} className="hamburger-link" target="_self">Panic</Link>
                    <Link href="/other" className="hamburger-link">Other</Link>
                    <input style={{width: 200}} placeholder="placeholder" />
                </Hamburger>
            </div>
        </div>
        
        {/* some1 fix the google classroom / panic button should replace the current tab but it uh; doesn't */} 

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
            <div className="nav-time">
            <span className="nav-time-text clock-text">{currentDate ? new Date(currentDate).toLocaleTimeString() : `${new Date().getHours()}:${new Date().getMinutes()}:00 PM`}</span>
                <span className="nav-time-text date-text">{new Date().toLocaleDateString()}</span>
            </div>
        </div>
    </div>
  );
};

export default Header;
