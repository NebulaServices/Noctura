let bareServer = 'tomp.app';

importScripts('/sw/uv/uv.bundle.js');
importScripts('/sw/uv/uv.config.js');
importScripts('/sw/uv/uv.sw.js');

importScripts('/sw/dynamic/dynamic.config.js');
importScripts('/sw/dynamic/dynamic.worker.js');

addEventListener('install', async function(event) {
    event.waitUntil(self.skipWaiting());

    const cache = await caches.open("astro-scripts");

    cache.keys().then(async keys => {
        for (var { url } of keys) {
            const res = await cache.match(url);
            const body = await res.text();

            (0, eval)(`let moduleID = "${url.split('/').pop().split('.')[0]}";\n` + body);
        }
    });
});

addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim());
});

const p = new Promise(async (res) => {
    const cache = await caches.open('astro-data');

    if (await cache.match('/bare.txt')) {
        bareServer = await (await cache.match('/bare.txt')).text();
    }

    try {
        const req = await fetch('http://' + bareServer.replace(/\/$/, '') + '/', {redirect: 'follow'});

        //console.log('bare server', bareServer)

        self.__uv$config.bare = req.url;
        self.__dynamic$config.bare.path = req.url;
        console.log(req.url);
    } catch(e) {console.log(e)};

    self.dynamic = new Dynamic(self.__dynamic$config);
    self.uv = new UVServiceWorker(self.__uv$config);

    res(await caches.open('astro-cache'));
});

addEventListener('fetch', function(event) {
    event.respondWith((async function() {
        const cache = await p;

        if (await cache.match(event.request.url)) return await cache.match(event.request.url);

        if (event.request.url.endsWith('?sw=ignore')) return await fetch(event.request);

        if (event.request.url.startsWith(location.origin + '/~/uv/')) {
            return await self.uv.fetch(event);
        }

        if (await self.dynamic.route(event)) {
            return await self.dynamic.fetch(event);
        }

        if (event.request.destination === "font" || event.request.url.startsWith(location.origin + '/icons/games/')) {
            var res;
            const req = await cache.match(event.request.url) || (res = await fetch(event.request), await cache.put(event.request.url, res.clone()), res);

            return req;
        }

        return await fetch(event.request);
    })());
});