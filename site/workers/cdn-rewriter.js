var CDN_ORIGIN = "https://cdn.simplyenak.com";
var PAGES_ORIGIN = "https://website-40z.pages.dev";
var CDN_ROOT = "https://cdn.simplyenak.com";
var STATIC_TTL = 2592000; // 30 days in seconds

// ── Static redirect map ──────────────────────────────────────────────
// This is the single source of truth for 301s on simplyenak.com.
// The site _redirects file and Pages Functions don't fire because
// this Worker catches requests first — put all redirects here.
var REDIRECTS = {
  // ── Priority 1 — Stories with existing live targets (7,334 imps/mo) ──
  "/eating-durians": "/stories/eating-durians",
  "/eating-durians/": "/stories/eating-durians",
  "/pt/stories/eating-durians/": "/stories/eating-durians",
  "/do-malaysians-speak-english": "/stories/do-malaysians-speak-english",
  "/do-malaysians-speak-english/": "/stories/do-malaysians-speak-english",
  "/ms/stories/chinese-dumpling-festival/": "/stories/chinese-dumpling-festival",

  // ── Priority 3a — Renamed tours (727 imps/mo) ──
  "/tours/flavours-of-malaysia-off-the-beaten-track": "/tours/flavours-of-malaysia",
  "/tours/flavours-of-malaysia-off-the-beaten-track/": "/tours/flavours-of-malaysia",
  "/tours/eat-drink-georgetown": "/tours/penang-street-food",
  "/tours/eat-drink-georgetown/": "/tours/penang-street-food",
  "/tours/secrets-of-kl-nightlife-street-art-cocktails": "/tours/secrets-of-kl-nightlife-street-art-and-cocktails",
  "/tours/secrets-of-kl-nightlife-street-art-cocktails/": "/tours/secrets-of-kl-nightlife-street-art-and-cocktails",
  "/tours/melaka-cultural-food-journey": "/tours/locations/food-tours-melaka",
  "/kuala-lumpur-food-tour": "/tours/kuala-lumpur-street-food",
  "/kuala-lumpur-food-tour/": "/tours/kuala-lumpur-street-food",
  "/vegetarian-food-tours": "/tours/dietary/vegetarian-food-tours",
  "/vegetarian-food-tours/": "/tours/dietary/vegetarian-food-tours",

  // ── Priority 3b — Static/legal (77 imps/mo) ──
  "/terms-conditions": "/terms",
  "/terms-conditions/": "/terms",
  "/privacy-policy": "/privacy",
  "/privacy-policy/": "/privacy",
  "/local-farming-partnerships": "/about",
  "/local-farming-partnerships/": "/about",
  "/street-food-culture": "/stories/must-try-malaysian-street-food",
  "/street-food-culture/": "/stories/must-try-malaysian-street-food",
  "/why-we-care-about-sustainability": "/about",
  "/why-we-care-about-sustainability/": "/about",
  "/custom-tours/media": "/tours/tailored-tours",
  "/custom-tours/media/": "/tours/tailored-tours",
  "/ms/stories/food-safety": "/stories/food-safety",
  "/ms/stories/food-safety/": "/stories/food-safety",
  "/ms/stories/must-try-malaysian-street-food": "/stories/must-try-malaysian-street-food",
  "/ms/stories/must-try-malaysian-street-food/": "/stories/must-try-malaysian-street-food",

  // ── Legacy redirects (existing) ──
  "/tours/eat-drink-george-town": "/tours/georgetown-night-food-durian",
  "/tours/eat-drink-george-town/": "/tours/georgetown-night-food-durian",
};

// Static file extensions that can be cached at the edge for 30 days
var CACHED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".css", ".js", ".ico", ".woff2", ".pdf", ".mp4", ".webm"];

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
    var originResponse = await fetch(new Request(new URL(url.pathname + url.search, PAGES_ORIGIN).toString(), {
      method: "GET",
      headers: request.headers,
      redirect: "manual"
    }));
    return addCaching(originResponse, url.pathname);
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

  // Pass through redirects — they shouldn't be cached
  if (response.status >= 300 && response.status < 400) {
    return response;
  }

  // Non-HTML responses from this path also get caching
  var contentType = (response.headers.get("content-type") || "").toLowerCase();
  if (contentType.indexOf("text/html") === -1) {
    return addCaching(response, url.pathname);
  }

  // ── HTML transformations ──
  var html = await response.text();

  // Replace S3 origin URLs with CDN URLs
  var didReplace = false;
  html = html.replace(/https:\/\/se-website-images\.s3\.nl-ams\.scw\.cloud/g, CDN_ROOT);
  if (html.indexOf(CDN_ROOT) >= 0) didReplace = true;

  if (!didReplace && html.indexOf("S3_ORIGIN") == -1) {
    // No changes needed — return with edge caching
    var noChangeHeaders = new Headers(response.headers);
    noChangeHeaders.set("cache-control", "public, s-maxage=300, max-age=0, must-revalidate");
    return new Response(html, {
      status: response.status,
      headers: noChangeHeaders
    });
  }

  // HTML pages: cache for 5 minutes at the edge (for revalidation)
  var newHeaders = new Headers(response.headers);
  newHeaders.set("cache-control", "public, s-maxage=300, max-age=0, must-revalidate");

  return new Response(html, {
    status: response.status,
    headers: newHeaders
  });
}

// Add caching headers for static assets (images, CSS, JS, etc.)
// Only cache successful (200) responses. 404s and errors pass through.
function addCaching(response, path) {
  if (response.status !== 200) return response;

  var shouldCache = false;
  for (var i = 0; i < CACHED_EXTENSIONS.length; i++) {
    if (path.indexOf(CACHED_EXTENSIONS[i], path.length - CACHED_EXTENSIONS[i].length) !== -1) {
      shouldCache = true;
      break;
    }
  }
  if (!shouldCache) return response;

  var newHeaders = new Headers(response.headers);
  newHeaders.set("cache-control", "public, s-maxage=" + STATIC_TTL + ", immutable, max-age=" + STATIC_TTL);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}
