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

if (typeof window == 'object' && (!window.parent.location.href.includes('/~/uv/') && !window.parent.location.href.includes('games') || window.top == window)) {
    fetch(location.origin + '/js/inject.js?sw=ignore').then(async (res) => {
        const text = await res.text();
        const script = document.createElement('script');

        script.type = 'module';
        script.textContent = text;

        function load() {
            var div = document.createElement('div');
            div.style.display = "none";
            const shadow = div.attachShadow({ mode: "open" });
            shadow.append(script);

            if (self.frameElement && !self.frameElement.classList.contains('tab-frame')) self.frameElement.style.display = 'block';

            document.body.appendChild(div);
        }

        if (document.readyState == 'complete' || document.readyState == 'interactive') {
            load();
        } else {
            document.addEventListener('readystatechange', () => {
                if (document.readyState != 'complete' && document.readyState != 'interactive') return;

                load();
            });
        }
    });
}