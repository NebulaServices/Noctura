self.__dynamic$config = {
  prefix: '/~/dynamic/',
  encoding: 'plain',
  mode: 'production', // development: zero caching, no minification, production: speed-oriented
  bare: {
    version: 2,
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