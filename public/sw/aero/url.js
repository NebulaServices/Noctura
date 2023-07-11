function __aero$encodeURL(url, meta) {
  if (!url) return url;
  url = new String(url);
  if (url.indexOf(__aero$config.scope)!==-1) return url;
  if (url.match(/^(#|about:|data:|mailto:)/g)) return url;

  url = (new String(url).toString())

  return location.origin+__aero$config.scope+encodeURIComponent(new URL(url, meta.href).href);
}

function __aero$decodeURL(url) {
  if (!url) return url;

  url = new String(url);

  var index = url.indexOf(__aero$config.scope);

  if (index == -1) {
    throw new Error('bad URL');
  }

  url = decodeURIComponent(url).slice(index + __aero$config.scope.length)
    .replace('https://', 'https:/')
    .replace('https:/', 'https://');

  return new URL(url);
}