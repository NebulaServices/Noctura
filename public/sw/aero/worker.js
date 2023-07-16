importScripts('/sw/aero/config.js');
importScripts('/sw/aero/url.js');
importScripts('/sw/aero/headers.js');
importScripts('/sw/aero/bare.js');
importScripts('/sw/aero/css.js');

self.addEventListener('install', (e) => {
  e.waitUntil(skipWaiting());
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

var assetURL = ['/sw/aero/url.js?', '/sw/aero/config.js?', '/sw/aero/client/el.js?', '/sw/aero/client/element.js?', '/sw/aero/client/eval.js?', '/sw/aero/client/http.js', '/sw/aero/client/ws.js'].map(e=>location.origin+e);

function query(req) {
  return new URLSearchParams(new URL(req.referrer).search).get('__aero$referrer');
}

const p = new Promise(res => {
  caches.open('astro-data').then(cache => {
    cache.match('/bare.txt').then(async file => {
      var text = file ? await file.text() : '';

      try {
        const req = await fetch('http://' + text.replace(/\/$/, '') + '/', {redirect: 'follow'});
        __aero$config.bare = req.url;
      } catch {}

      res();
    })
  })
});

async function fetchEvent({ request }) {
  try {
    await p;

    if (request.url.endsWith('?sw=ignore')) return await fetch(request);
  
    if (assetURL.find(e=>request.url.startsWith(e))) return fetch(request);
  
    /*if (request.referrer!==location.origin+'/'&&request.referrer.startsWith(location.origin+__aero$config.scope)) {
      var parse = new URLSearchParams(new URL(request.url).search);
      var requrl = new URL(request.url).href.replace(new URL(request.url).search, '');
      
      if ((!parse.get('__aero$referrer'))&&(request.destination=='script'||request.destination=='worker'||request.destination=='style')) { 
        parse.append('__aero$referrer', btoa(request.referrer));
        
        return new Response('', {
          status: 301,
          headers: {
            location: decodeURIComponent(requrl+(parse.toString().startsWith('?')?parse.toString():'?'+parse.toString())),
          }
        });
      }
    }*/
  
    var rUrl = request.url;
    
    var referrer = ''
    
    try {
      referrer = __aero$decodeURL(request.referrer);
      if (request.referrer==location.origin+'/') referrer = '';
    } catch(_) {};
  
    if (!request.url.startsWith(location.origin+__aero$config.scope)) rUrl = __aero$encodeURL(request.url.replace(location.origin, ''), referrer);
      
    var url = new URL(__aero$decodeURL(rUrl).href.replace(/^http:/i, 'https:'));//new URL(__aero$decodeURL(rUrl).href.split('&__aero$referrer=')[0].split('?__aero$referrer=')[0]);

    if (url.protocol!=='https:'&&url.protocol!=='http:') return fetch(request);
    
    var bareResponse = await makeBareRequest(url, request);

    bareResponse.headers.delete('Content-Security-Policy');
    bareResponse.headers.delete('X-Frame-Options');
  
    var resHeaders = Object.fromEntries(bareResponse.headers);
  
    for (var header in resHeaders) {
      if (header.toLowerCase()=='location') {
  
        resHeaders[header] = __aero$encodeURL(resHeaders[header], url);
      }
    }
  
    if (request.destination=='document' || request.destination == 'iframe') {
      if (bareResponse.headers.get('content-type').startsWith('text/html')) {
        var a = await bareResponse.text();
        /*a = `
          <script src="/config.js?${Math.floor(Math.random() * (999999 - 100000) + 100000)}" aero-core=1></script>
          <script src="/url.js?${Math.floor(Math.random() * (999999 - 100000) + 100000)}" aero-core=1></script>
          <script src="/client/el.js?${Math.floor(Math.random() * (999999 - 100000) + 100000)}" aero-core=1></script>
          <script src="/client/http.js?${Math.floor(Math.random() * (999999 - 100000) + 100000)}" aero-core=1></script>
          <script src="/client/ws.js?${Math.floor(Math.random() * (999999 - 100000) + 100000)}" aero-core=1></script>
          <script src="/client/eval.js?${Math.floor(Math.random() * (999999 - 100000) + 100000)}" aero-core=1></script>
  
          ${a}
  
          <script src="/client/element.js?${Math.floor(Math.random() * (999999 - 100000) + 100000)}" aero-core=1></script>
        `;*/

        a = `
          <script src="/sw/aero/config.js?" aero-core=1></script>
          <script src="/sw/aero/url.js?" aero-core=1></script>
          <script src="/sw/aero/client/el.js?" aero-core=1></script>
          <script src="/sw/aero/client/http.js?" aero-core=1></script>
          <script src="/sw/aero/client/ws.js?" aero-core=1></script>
          <script src="/sw/aero/client/eval.js?" aero-core=1></script>
  
          ${a}
  
          <script src="/sw/aero/client/element.js?" aero-core=1></script>
        `;
        
        return new Response(a, {
          status: bareResponse.status,
          statusText: bareResponse.statusText,
          headers: new Headers(resHeaders),
        });
      };
  
      if (request.destination=='script'||request.destination=='worker') {
        var a = await bareResponse.text();
        a = a.replace(/location/gmi, '__aero$location').replace(/postMessage/gmi, '__aero$postMessage');
  
        return new Response(a, {
          status: bareResponse.status,
          statusText: bareResponse.statusText,
          headers: new Headers(resHeaders),
        });
      }
  
      if (request.destination=='style') {
        var a = await bareResponse.text();
        a = rewriteCss(a, url);
        return new Response(a, {
          status: bareResponse.status,
          statusText: bareResponse.statusText,
          headers: new Headers(resHeaders),
        });
      }
    }
  
    if (request.headers.get('accept') === 'text/event-stream') {
        resHeaders['content-type'] = 'text/event-stream'
    };
  
    var bareText = await bareResponse.blob();
  
    if ([204, 101, 205, 304].indexOf(bareResponse.status)!==-1) bareText = null;
    
    return new Response(bareText, {
      status: bareResponse.status,
      statusText: bareResponse.statusText,
      headers: new Headers(resHeaders),
    });
  } catch(e) {
    return new Response(e, {status: 500});
  }
}

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetchEvent(event)
  )
})