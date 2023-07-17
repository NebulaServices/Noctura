const theme = localStorage.getItem('theme') || 'amoled';
document.documentElement.dataset.theme = theme;
if (theme == "custom") {
    document.querySelector('style#dynamic-style').innerHTML = `[data-theme="custom"] {${['primary-bg-color', 'secondary-bg-color', 'settings-1', 'settings-2', 'settings-3', 'font-color', 'primary-text-color', 'nav-btn-color-darker', 'nav-btn-color'].map(e=>localStorage.getItem(e) ? `--${e}: ${localStorage.getItem(e) + ' !important'}` : '').join(';')}}`;
}

if ('serviceWorker' in navigator) {
    window.registerSW = () => new Promise(e=>navigator.serviceWorker.getRegistrations().then(async function(registrations) {
        for await (let registration of registrations) {
            await registration.unregister();
        }

        if (!navigator.serviceWorker.controller) await navigator.serviceWorker.register('/sw.js', { scope: '/', module: true, updateViaCache: 'none' })
            .then(function(registration) {
                console.log('Registration successful, scope is:', registration.scope);
            })
            .catch(function(error) {
                console.log('Service worker registration failed, error:', error);
            });

        if (!navigator.serviceWorker.controller) await navigator.serviceWorker.register('/aero.js', { scope: '/~/aero', module: true, updateViaCache: 'none' })
            .then(function(registration) {
                console.log('Registration successful, scope is:', registration.scope);
            })
            .catch(function(error) {
                console.log('Service worker registration failed, error:', error);
            });

        e();
    }));

    if (!navigator.serviceWorker.controller) registerSW();
}