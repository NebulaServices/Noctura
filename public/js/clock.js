const time = document.querySelector('.clock-text');
const date = document.querySelector('.date-text');

if (date && time) {
    setInterval(function() {
        date.innerText = new Date().toLocaleDateString();
        time.innerText = new Date().toLocaleTimeString();
    }, 1000);
}

addEventListener('flamethrower:router:end', function() {
    const time = document.querySelector('.clock-text');
    const date = document.querySelector('.date-text');

    if (date && time) {
        setInterval(function() {
            date.innerText = new Date().toLocaleDateString();
            time.innerText = new Date().toLocaleTimeString();
        }, 1000);
    }
});