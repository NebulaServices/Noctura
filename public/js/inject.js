const dom = new DOMParser().parseFromString('', 'text/html');

var container = document.createElement('div');
container.id = 'noctura-menu';

container.innerHTML = `
<button onclick="location.reload()">Reload</button>
<button onclick="document.body.requestFullscreen()">Fullscreen</button>
${window.parent !== window ? '<button onclick="">Close</button>' : ''}
<button id="noctura-close-menu">Close Menu</button>

<input id="noctura-nav-input" value="${location.pathname.includes('/~/aero/') ? new Function('return __aero$meta.href')() : new Function('return this.location.href')()}">
`

container.querySelector('#noctura-close-menu').onclick = function() {
    container.style.display = 'none';
}

container.querySelector('#noctura-nav-input').onkeydown = function(e) {
    if (e.key == 'Enter') {
        location.pathname.includes('/~/aero/') ? new Function(`return this.location.href = "/~/aero/${encodeURIComponent(this.value)}"`)() : new Function(`return this.location.href = "${this.value}"`)()
        new Function(`return this.location.href = "${this.value}"`)();
    }

    return e;
}

var style = document.createElement('style');

style.innerHTML = `
#noctura-menu {
    position: fixed;
    top: 0;
    left: 50%;
    height: min-content;
    padding: 5px 10px;
    border-radius: 5px;
    background-color: var(--primary-bg-color);
    color: var(--font-color);
    transform: translate(-50%, 0);
    z-index: 99999;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 5px;
    font-family: sans-serif;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
}

#noctura-nav-input {
    border: none;
    outline: none;
    background-color: var(--settings-1);
    color: var(--font-color);
    padding: 5px 10px;
    border-radius: 5px;
    transition: 0.1s ease-in-out;
    font-family: sans-serif;
    font-size: 12px;
}

#noctura-menu button {
    border: none;
    outline: none;
    background-color: transparent;
    color: var(--font-color);
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 5px;
    transition: 0.1s ease-in-out;
}

#noctura-menu button:hover {
    background-color: var(--settings-3);
    color: #000000;
}
`;

container.appendChild(style);

// make the container draggable

var x1 = 0, y1 = 0, x2 = 0, y2 = 0, drag = false;

container.addEventListener('mousedown', function(e) {
    if (e.target.tagName == 'INPUT' || e.target.tagName == 'BUTTON') return;

    e.preventDefault();

    x2 = e.clientX;
    y2 = e.clientY;

    drag = true;
});

document.addEventListener('mousemove', function(e) {
    if (drag) {
        e.preventDefault();

        x1 = x2 - e.clientX;
        y1 = y2 - e.clientY;
        x2 = e.clientX;
        y2 = e.clientY;

        if ((container.offsetTop - y1) < 0) return;
        if ((container.offsetLeft - x1) < 0) return;

        if ((container.offsetTop - y1) > window.innerHeight) return;
        if ((container.offsetLeft - x1) > window.innerWidth) return;

        container.style.top = (container.offsetTop - y1) + 'px';
        container.style.left = (container.offsetLeft - x1) + 'px';
    }
});

document.addEventListener('mouseup', function(e) {
    drag = false;
});

document.body.appendChild(container);