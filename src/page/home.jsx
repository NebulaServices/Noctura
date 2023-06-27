import './style/style.css'
import './style/index.css'
<<<<<<< HEAD

export default function Index(props) {
    return (
        <div className="home">
            <div className="top-banner"></div>

            <div className="home-container">
=======
import '../components/switch.css';

import { useEffect, useState } from 'react';

export default function Index(props) {
    const prefixes = {
        'Ultraviolet': 'uv',
        'Dynamic': 'dynamic',
        'Rammerhead': 'rh'
    }

    const [onLine, setOnLine] = useState(true);
    const [server, setServer] = useState(null);

    useEffect(() => {
        if (typeof navigator !== 'undefined') {
            setOnLine(navigator.onLine);

            window.addEventListener('online', () => {
                setOnLine(true);
            });

            window.addEventListener('offline', () => {
                setOnLine(false);
            });
        }

        if (window.requestBare && !window.pinging) {
            window.pinging = true;
            setInterval(function() {requestBare(true)}, 1500);
        }

        addEventListener('click', function(e) {
            if (recursive(document.getElementsByClassName('switch-btn')[1]).includes(e.target)) return;
        
            const switchBtn = document.getElementsByClassName('switch-btn')[1];
        
            if (switchBtn.style.display == 'block') {
                switchBtn.style.opacity = '0';
                setTimeout(function() {
                    switchBtn.style.display = 'none';
                }, 100);
            }
        });

        if (window.server) {
            setServer(window.server[0]);
        }
    }, []);

    const toggleSwitchBtn = (e) => {
        const switchBtn = document.getElementsByClassName('switch-btn')[1];

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

    const submit = (e) => {
        e.preventDefault();

        const input = document.querySelector('.home-input');
        const results = document.querySelector('.home-results');

        if (!input.value) return;

        results.innerHTML = '';

        let url;

        if (input.value.match(/^https?:\/\//g)) {
            url = input.value;
        } else {
            url = 'https://www.google.com/search?q=' + encodeURIComponent(input.value);
        }

        var prefix = props.cookie.split('; ').map(e=>e.split('=')).find(e=>e[0]=='astro-proxy') ? prefixes[props.cookie.split('; ').map(e=>e.split('=')).find(e=>e[0]=='astro-proxy')[1]] : prefixes['Ultraviolet'];

        location.href = `/~/${prefix}/` + encodeURIComponent(url);
    }

    const switchServer = (e) => {
        e.preventDefault();

        const server = e.target.getAttribute('value');

        e.target.parentNode.style.opacity = '0';

        document.querySelector('.server-indicator-value').childNodes[1].textContent = 'Connecting ';
        document.querySelector('.server-indicator-value').classList.remove('connected');
        document.querySelectorAll('.server-name')[0].innerText = server.split('.')[0].toUpperCase();

        if (window.connectBare) {
            window.connectBare(server).then(() => {
                document.querySelector('.server-indicator-value').childNodes[1].textContent = 'Connected ';
                document.querySelector('.server-indicator-value').classList.add('connected');
                
                localStorage.server = server;
            }).catch(() => {
                document.querySelector('.server-indicator-value').childNodes[1].textContent = 'Disconnected ';
            });
        }

        document.cookie = 'astro-bare='+server+'; expires=Fri, 31 Dec 9999 23:59:59 GMT'
    
        setTimeout(function() {
            e.target.parentNode.style.display = 'none';
        }, 100);
    }

    return (
        <div className="home" suppressHydrationWarning>
            <div className="top-banner" />

            <form onSubmit={submit} className="home-container">
>>>>>>> 3ed04a5d1242389e78f1850286d0af5740bf3da7
                <h1>Noctura</h1>
                <input className="home-input" placeholder="Enter URL or Search Query"/>

                <div className="home-results"></div>
<<<<<<< HEAD
            </div>

            <div className="home-footer">
                <span className="server-indicator">
                    Server:
                    <span className={"server-indicator-value"}><span className="indicator-dot"></span>Connecting...<span className="server-name"></span></span>
                </span>
            </div>
            <script src="/js/omnibox.js"></script>
=======
            </form>

            <div className="home-footer">
                <div className="switch-btn-container">
                    <div className="switch-btn-current" onClick={toggleSwitchBtn}>
                        <span className="server-indicator">
                            Server:
                            <span suppressHydrationWarning className={"server-indicator-value" + (onLine ? server ? ' connected' : '' : '')}><span suppressHydrationWarning className="indicator-dot"></span>{onLine ? server ? 'Connected ' : 'Connecting...' : 'Offline'}<span suppressHydrationWarning className="server-name">{server ? server.split('.')[0].toUpperCase() : ''}</span></span>
                        </span>
                    </div>
                    <div className="switch-btn open-up" style={{background: props.background || '#000'}}>
                        {
                            [
                                'tomp.app',
                                'us-east.noctura.tech',
                                'us-west.noctura.tech',
                                'eu-central.noctura.tech'
                            ].map(e=>{
                                return <a id={"server-" + e.split('.')[0]} key={e} onClick={switchServer} className="modify-split-a" value={e}>{e.split('.')[0].split('-').map(e=>e.split('').map((e,i)=>i==0?e.toUpperCase():e).join('')).join(' ')} <span className="server-ping">0ms</span></a>
                            })
                        }
                    </div>
                </div>
            </div>

            <script src="/js/omnibox.js" />
>>>>>>> 3ed04a5d1242389e78f1850286d0af5740bf3da7
        </div>
    )
} 