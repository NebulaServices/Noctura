import servers from "../bare.json";

export async function get({ params, request }) {
  return {
    body: JSON.stringify(servers.dev)
  };
}
