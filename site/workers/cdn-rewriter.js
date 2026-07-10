var CDN_ORIGIN = "https://cdn.simplyenak.com";
var PAGES_ORIGIN = "https://website-40z.pages.dev";
var CDN_ROOT = "https://cdn.simplyenak.com";

// ── Static redirect map ──────────────────────────────────────────────
// This is the single source of truth for 301s on simplyenak.com.
// The site _redirects file and Pages Functions don't fire because
// this Worker catches requests first — put all redirects here.
var REDIRECTS = {
  "/tours/eat-drink-george-town": "/tours/georgetown-night-food-durian",
  "/tours/eat-drink-george-town/": "/tours/georgetown-night-food-durian",
};

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  var url = new URL(request.url);

  // ── Static redirects ──
  var redirectTarget = REDIRECTS[url.pathname];
  if (redirectTarget) {
    return Response.redirect("https://simplyenak.com" + redirectTarget, 301);
  }

  // ── Skip non-page requests early ──
  // Only HTML pages need rewriting. Pass everything else straight
  // through to Pages without the Worker overhead.
  var method = request.method;
  var accept = request.headers.get("accept") || "";
  if (accept.indexOf("text/html") === -1 && method === "GET") {
    return fetch(new Request(new URL(url.pathname + url.search, PAGES_ORIGIN).toString(), {
      method: "GET",
      headers: request.headers,
      redirect: "manual"
    }));
  }

  // ── Fetch from Pages origin ──
  var originUrl = new URL(url.pathname + url.search, PAGES_ORIGIN);
  var originRequest = new Request(originUrl.toString(), {
    method: method,
    headers: request.headers,
    body: ["GET", "HEAD"].includes(method) ? null : request.body,
    redirect: "manual"
  });
  var response = await fetch(originRequest);

  // Pass through redirects and non-HTML responses unchanged
  var contentType = (response.headers.get("content-type") || "").toLowerCase();
  if (response.status >= 300 && response.status < 400 || contentType.indexOf("text/html") === -1) {
    return response;
  }

  // ── HTML transformations ──
  var html = await response.text();

  // Replace S3 origin URLs with CDN URLs
  var didReplace = false;
  html = html.replace(/https:\/\/se-website-images\.s3\.nl-ams\.scw\.cloud/g, CDN_ROOT);
  if (html.indexOf(CDN_ROOT) >= 0) didReplace = true;

  if (!didReplace && html.indexOf("S3_ORIGIN") === -1) {
    // No changes needed — return original response
    return response;
  }

  return new Response(html, {
    status: response.status,
    headers: response.headers
  });
}
