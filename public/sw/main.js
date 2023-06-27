let bareServer = 'us-east.noctura.tech';

importScripts('/sw/uv/uv.bundle.js');
importScripts('/sw/uv/uv.config.js');
importScripts('/sw/uv/uv.sw.js');

importScripts('/sw/dynamic/dynamic.config.js');
importScripts('/sw/dynamic/dynamic.worker.js');

addEventListener('install', async function(event) {
    event.waitUntil(self.skipWaiting());
});

addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim());
});

const p = new Promise(async (res) => {
    const cache = await caches.open('astro-data');

    if (await cache.match('/bare.txt')) {
        bareServer = await (await cache.match('/bare.txt')).text();
    }

    self.__uv$config.bare = `https://${bareServer}`;
    self.__dynamic$config.bare.path = `https://${bareServer}`;

    self.dynamic = new Dynamic(self.__dynamic$config);
    self.uv = new UVServiceWorker(self.__uv$config);

    res(true);
});

addEventListener('fetch', function(event) {
    event.respondWith((async function() {
        await p;

        if (event.request.url.startsWith(location.origin + '/~/uv/')) {
            return await self.uv.fetch(event);
        }

        if (event.request.url.startsWith(location.origin + '/~/dynamic/')) {
            return await self.dynamic.fetch(event);
        }

        return await fetch(event.request);
    })());
});