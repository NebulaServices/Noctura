import servers from "../bare.json";

export async function GET() {
  return new Response(JSON.stringify(servers.dev), {
    headers: { "Content-Type": "application/json" }
  });
}
