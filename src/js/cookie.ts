import Cookies from "js-cookie";

(globalThis as unknown as { Cookies: typeof Cookies }).Cookies = Cookies;

export default Cookies;
