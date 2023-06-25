if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw/main.js', { scope: '/', module: true })
        .then(function(registration) {
            console.log('Registration successful, scope is:', registration.scope);
        })
        .catch(function(error) {
            console.log('Service worker registration failed, error:', error);
        });
}