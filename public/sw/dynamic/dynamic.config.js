self.__dynamic$config = {
  prefix: '/~/dynamic/',
  encoding: 'plain',
  mode: 'production', // development: zero caching, no minification, production: speed-oriented
  bare: {
    version: 3,
    path: '/bare/',
  },
  tab: {
    title: 'Service',
    icon: null,
    ua: null,
  },
  assets: {
    prefix: '/sw/dynamic/',
    files: {
      handler: 'dynamic.handler.js',
      client: 'dynamic.client.js',
      worker: 'dynamic.worker.js',
      config: 'dynamic.config.js',
      inject: null,
    }
  },
  block: [
    //"www.google.com",
  ]
};

if (typeof window == 'object' && (!window.parent.location.href.includes('/~/dynamic/') || window.top == window)) {
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