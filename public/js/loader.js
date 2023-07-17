const theme = localStorage.getItem('theme') || 'amoled';
document.documentElement.dataset.theme = theme;
if (theme == "custom") {
    document.querySelector('style#dynamic-style').innerHTML = `[data-theme="custom"] {${['primary-bg-color', 'secondary-bg-color', 'settings-1', 'settings-2', 'settings-3', 'font-color', 'primary-text-color', 'nav-btn-color-darker', 'nav-btn-color'].map(e=>localStorage.getItem(e) ? `--${e}: ${localStorage.getItem(e) + ' !important'}` : '').join(';')}}`;
}

caches.open('astro-modules').then(async modules => {
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
});