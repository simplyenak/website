/**
 * Cloudflare Worker: nous-proxy (Service Worker format)
 * Reverse proxy for nous-research inference API.
 * Routes through Cloudflare's network to bypass server IP ban (CF Error 1010).
 */

var UPSTREAM = "https://inference-api.nousresearch.com";

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  // Health check
  if (url.pathname === "/__health") {
    return new Response(JSON.stringify({ status: "ok", upstream: UPSTREAM }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Build upstream URL
  const upstream = new URL(url.pathname + url.search, UPSTREAM);

  // Clone request, forward to upstream
  const headers = new Headers(request.headers);
  // Remove headers that could cause issues
  headers.delete("cf-connecting-ip");
  headers.delete("cf-ipcountry");
  headers.delete("cf-ray");
  headers.delete("cf-visitor");
  headers.delete("x-forwarded-for");
  headers.delete("x-forwarded-proto");
  headers.delete("x-real-ip");

  const upstreamReq = new Request(upstream, {
    method: request.method,
    headers: headers,
    body: request.method !== "GET" && request.method !== "HEAD" ? request.body : null,
    redirect: "follow",
  });

  try {
    const response = await fetch(upstreamReq);

    // Return response with CORS headers for Omniroute
    const respHeaders = new Headers(response.headers);
    respHeaders.set("Access-Control-Allow-Origin", "*");
    respHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    respHeaders.set("Access-Control-Allow-Headers", "Authorization, Content-Type");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: respHeaders,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}
