var __aero$websockets = [];

const valid_chars = "!#$%&'*+-.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ^_`abcdefghijklmnopqrstuvwxyz|~";
const reserved_chars = "%";

function encode_protocol(protocol) {
	protocol = protocol.toString();

	let result = '';
	
	for(let i = 0; i < protocol.length; i++){
		const char = protocol[i];

		if(valid_chars.includes(char) && !reserved_chars.includes(char)){
			result += char;
		}else{
			const code = char.charCodeAt();
			result += '%' + code.toString(16).padStart(2, 0);
		}
	}

	return result;
}

function decode_protocol(protocol) {
	if(typeof protocol != 'string')throw new TypeError('protocol must be a string');

	let result = '';
	
	for(let i = 0; i < protocol.length; i++){
		const char = protocol[i];
		
		if(char == '%'){
			const code = parseInt(protocol.slice(i + 1, i + 3), 16);
			const decoded = String.fromCharCode(code);
			
			result += decoded;
			i += 2;
		}else{
			result += char;
		}
	}

	return result;
}

window.WebSocket = new Proxy(window.WebSocket, {
    construct(e, [o, t]) {
      
        const url = new URL(o);

        var WsId = Math.floor(Math.random() * (999999 - 100000) + 100000);

        __aero$websockets.push([WsId, url]);
      
        const r = {
            remote: {
                host: url.hostname,
                port: url.port || (url.protocol === 'wss:' ? '443' : '80'),
                path: url.pathname + url.search,
                protocol: url.protocol
            },
            headers: {
                Host: url.host,
                Origin: __aero$meta.origin,
                Pragma: "no-cache",
                "Cache-Control": "no-cache",
                Upgrade: "websocket",
                Connection: "Upgrade"
            },
            forward_headers: ["accept-encoding", "accept-language", "sec-websocket-extensions", "sec-websocket-key", "sec-websocket-version"]
        };        
      
        var socket = Reflect.construct(e, [ window.location.origin.replace('http', 'ws') + "/bare/v1/?id="+WsId, [  'bare', encode_protocol(JSON.stringify(r)) ] ]);

        var listener = function(e) {
          __aero$websockets.splice(__aero$websockets.findIndex(e=>e[0]==WsId), 1)
        }

        socket.addEventListener('close', listener);
        socket.addEventListener('error', listener);

        return socket;
    }
})

var wsUrl = Object.getOwnPropertyDescriptor(window.WebSocket.prototype, 'url');

Object.defineProperty(window.WebSocket.prototype, 'url', {
  get() {
    var url = wsUrl.get.call(this);
    try {
      var param = new URLSearchParams(new URL(url).search).get('id');
      if (param) {
        return String(__aero$websockets.find(e=>e[0]==parseInt(param))[1])
      }
      return url;
    } catch(e) {
      return url;
    }
  },
  set() {
    return false;
  }
});