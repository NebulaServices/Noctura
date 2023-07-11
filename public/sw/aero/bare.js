function genCache(url, method) {
  return btoa(btoa(url+method))
}

function getObj(url, headers, body, method) {
  url = String(url);
  url = new URL(url);

  var head = {
    'x-bare-headers': JSON.stringify(Object.fromEntries(splitHeaders(new Headers(headers)))),
    'x-bare-host': url.host,
    'x-bare-protocol': url.protocol,
    'x-bare-port': (url.protocol == 'https:' ? 443 : 80).toString(),
    'x-bare-path': url.pathname+url.search
  }

  return new Request(__aero$config.bare+'v2/?cache='+genCache(url.href, method), {
    credentials: 'omit',
    headers: head,
    method: method,
    body: body,
  })
}

async function makeBareRequest(url, req) {
  var { headers } = req,
    body;
  
  if (req.method !== 'GET' && req.method !== 'HEAD') body = await req.blob();

  var request = await fetch(getObj(url.href, getReqHeaders(Object.fromEntries(headers), req, url), body, req.method));

  return await createResponse(request);
}

async function createResponse(req) {

  var blob = await req.blob();

  if ([204, 101, 205, 304].indexOf(parseInt(req.headers.get('x-bare-status')))!==-1) blob = null;
  
  return new Response(blob, {
    headers: new Headers(JSON.parse(joinHeaders(req.headers).get('x-bare-headers'))||{}),
    status: req.headers.get('x-bare-status'),
    statusText: req.headers.get('x-bare-status-text'),
  });
}