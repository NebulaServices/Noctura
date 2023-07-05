self.__dynamic$config = {
  prefix: '/~/dynamic/',
  encoding: 'plain',
  mode: 'production', // development: zero caching, no minification, production: speed-oriented
  bare: {
    version: 3,
    path: 'https://tomp.app/',
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