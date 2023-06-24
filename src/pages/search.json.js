export async function get(req) {
    const param = req.url.searchParams.get('q');
    try {
        const request = await fetch(`http://api.duckduckgo.com/ac?q=${encodeURIComponent(decodeURIComponent(param) || '')}&format=json`);

        return {
            body: await request.text(),
        };
    } catch {
        return {body: JSON.stringify([])};
    }
}