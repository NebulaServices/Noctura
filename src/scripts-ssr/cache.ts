export const SECONDS = 1;
export const MINUTES = 60 * SECONDS;
export const HOURS = 60 * MINUTES;
export const DAYS = 24 * HOURS;

export function cache<R extends { headers: Headers; }>(res: R, seconds: number): R {
    if (import.meta.env.PROD)
        res.headers.set(
            "Cache-Control",
            `public, max-age=${seconds}, s-maxage=${seconds}`
        );

    return res;
}
