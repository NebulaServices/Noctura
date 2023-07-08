import { getRuntime } from "@astrojs/cloudflare/runtime";

export function getEnv(request: Request, metaEnv: ImportMetaEnv, name: string) {
    const env = import.meta.env.PROD
        ? getRuntime<ImportMetaEnv>(request).env
        : metaEnv;

    if (!env[name])
        throw new Error(`Missing environment variable "${name}"`);

    return env[name];
}
