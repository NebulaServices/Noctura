self.__uv$config = {
    prefix: '/~/uv/',
    bare: '/bare/',
    encodeUrl: Ultraviolet.codec.plain.encode,
    decodeUrl: Ultraviolet.codec.plain.decode,
    handler: '/sw/uv/uv.handler.js',
    client: '/sw/uv/uv.client.js',
    bundle: '/sw/uv/uv.bundle.js',
    config: '/sw/uv/uv.config.js',
    sw: '/sw/uv/uv.sw.js',
};

if (typeof window == 'object') {
    fetch(location.origin + '/js/inject.js?sw=ignore').then(async (res) => {
        const text = await res.text();
        const script = document.createElement('script');

        script.textContent = text;

        function load() {
            const shadow = document.createDocumentFragment();
            shadow.appendChild(script);

            document.body.appendChild(shadow);
        }

        if (document.readyState == 'interactive' || document.readyState == 'complete') {
            load();
        } else {
        document.addEventListener('DOMContentLoaded', () => {
            load();
        });
        }
    });
}