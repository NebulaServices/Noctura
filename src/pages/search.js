export async function get(req) {
    console.log(req.request.headers)
    const param = decodeURIComponent(req.url.pathname.split('=')[1]);

    try {
        const request = await fetch(`http://api.duckduckgo.com/ac?q=${encodeURIComponent(decodeURIComponent(param) || '')}&format=json`);

        return new Response(await request.text(), {headers: {'content-type': 'application/json'}});
    } catch {
        return new Response(JSON.stringify([]), {headers: {'content-type': 'application/json'}});
    }
}