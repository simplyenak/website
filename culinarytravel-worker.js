var PAGES = "https://culinary-travel-experts.pages.dev";

addEventListener("fetch", function(event) {
  event.respondWith(handleRequest(event.request));
});

// Thin passthrough proxy. The Astro build already emits correct per-page
// canonical, OG, twitter, and JSON-LD tags, so no head injection here.
// We only preserve the origin status code (a dropped status turned every
// 404 into a soft-200, Aug 2026) and forward non-HTML untouched.
function handleRequest(request) {
  var url = new URL(request.url);
  return fetch(new Request(new URL(url.pathname + url.search, PAGES).toString(), {
    method: "GET", headers: request.headers, redirect: "manual"
  })).then(function(res) {
    var ct = res.headers.get("content-type") || "";
    if (ct.indexOf("text/html") === -1) return res;
    return res.text().then(function(html) {
      return new Response(html, { status: res.status, headers: { "content-type": "text/html; charset=utf-8" } });
    });
  });
}
