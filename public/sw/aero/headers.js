function getReqHeaders(headers, request, meta) {
  const { referrer } = request;

  headers['origin'] = `${meta.protocol}//${meta.host}`;
  headers['Host'] = meta.host;

  for (var header of Object.keys(headers).filter(e=>e.startsWith('sec-'))) {
    delete headers[header];
  }

  if (referrer) {
      try {
          var unwritten = decodeURL(referrer)

          headers['referer'] = unwritten;
      } catch {
          headers['referer'] = meta.href;
      }
  } else headers['referer'] = meta.href;

  return (headers);
}

function reqResHeaders(headers, request, meta) {
  
}

const MAX_HEADER_VALUE = 3072;

function splitHeaders(headers) {
	const output = new Headers(headers);

	if (headers.has('x-bare-headers')) {
		const value = headers.get('x-bare-headers');

		if (value.length > MAX_HEADER_VALUE) {
			output.delete('x-bare-headers');

			let split = 0;

			for (let i = 0; i < value.length; i += MAX_HEADER_VALUE) {
				const part = value.slice(i, i + MAX_HEADER_VALUE);

				const id = split++;
				output.set(`x-bare-headers-${id}`, `;${part}`);
			}
		}
	}

	return output;
}

function joinHeaders(headers) {
	const output = new Headers(headers);

	const prefix = 'x-bare-headers';

	if (headers.has(`${prefix}-0`)) {
		const join = [];

		for (const [header, value] of headers) {
			if (!header.startsWith(prefix)) {
				continue;
			}

			if (!value.startsWith(';')) {
				throw new Error('400');
			}

			const id = parseInt(header.slice(prefix.length + 1));

			join[id] = value.slice(1);

			output.delete(header);
		}

		output.set(prefix, join.join(''));
	}

	return output;
}