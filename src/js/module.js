const modules = await caches.open('astro-modules');

for await (let { url } of await modules.keys()) {
    const module = await modules.match(url);
    const blob = await module.blob();
    const blobURL = URL.createObjectURL(blob, { type: 'application/javascript' });

    let script = document.createElement('script');
    script.type = 'module';
    script.src = blobURL;
    script.async = '';

    document.head.appendChild(script);
}