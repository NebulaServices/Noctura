if (!window.__init) {
    window.__init = true;
    
    async function requestBare() {
        if (!document.querySelector('.server-name')) return;

        const req = await fetch('/bare.json');
        const bareServers = await req.json();
        const ping = {};

        if (!localStorage.getItem('server')) {
            bareServers.forEach(server => ping[server] = 0);

            for await (var endpoint of bareServers) {
                const start = new Date();
                const req = await fetch('https://' + endpoint);
                await req.json();

                ping[endpoint] = new Date() - start;
            }

            const values = Object.entries(ping).sort((a, b) => a[1] - b[1]);

            window.server = values[0];
            localStorage.server = values[0][0];

            document.cookie = 'astro-bare='+values[0][0]+'; expires=Fri, 31 Dec 9999 23:59:59 GMT';

            document.querySelector('.server-name').innerText = values[0][0].split('.')[0].toUpperCase();
            document.querySelector('.server-indicator-value').childNodes[1].textContent = 'Connected ';
            document.querySelector('.server-indicator-value').classList.add('connected');
        } else {
            window.server = [localStorage.server, 0];
            document.querySelector('.server-name').innerText = localStorage.server.split('.')[0].toUpperCase();
            document.querySelector('.server-indicator-value').childNodes[1].textContent = 'Connected ';
            document.querySelector('.server-indicator-value').classList.add('connected');
        }
    }
    
    if (navigator.onLine) await requestBare(); else document.querySelector('.server-indicator-value').childNodes[1].textContent = 'Offline';

    addEventListener('flamethrower:router:end', requestBare);
    addEventListener('flamethrower:router:fetch-progress', function(e) {
        if (e.detail.progress === 100) {
            setTimeout(function() {
                document.querySelector('.page-load-progress').style.display = 'block';
                if (e.detail.progress !== 100) document.querySelector('.page-load-progress').style.width = e.detail.progress + '%';

                setTimeout(function() {
                    document.querySelector('.page-load-progress').style.opacity = '0';

                    setTimeout(function() {
                        document.querySelector('.page-load-progress').style.display = 'none';
                        document.querySelector('.page-load-progress').style.opacity = '1';
                    }, 150);
                }, 100);
            }, 100)
        } else {
            document.querySelector('.page-load-progress').style.display = 'block';
            if (e.detail.progress !== 100) document.querySelector('.page-load-progress').style.width = e.detail.progress + '%';
        }
    });

    addEventListener('offline', function() {
        document.querySelector('.server-name').innerText = '';
        document.querySelector('.server-indicator-value').childNodes[1].textContent = 'Offline';
        document.querySelector('.server-indicator-value').classList.remove('connected');
    });

    addEventListener('online', function() {
        document.querySelector('.server-indicator-value').childNodes[1].textContent = 'Connecting...';
        requestBare();
    });
}