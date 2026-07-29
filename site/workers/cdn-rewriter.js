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
  "/stories/eating-durians": "/eating-durians/",
  "/pt/stories/eating-durians": "/eating-durians/",
  "/do-malaysians-speak-english": "/stories/do-malaysians-speak-english",
  "/ms/stories/chinese-dumpling-festival": "/stories/chinese-dumpling-festival",

  // ── Priority 3a — Renamed tours (727 imps/mo) ──
  "/tours/flavours-of-malaysia-off-the-beaten-track": "/tours/flavours-of-malaysia",
  "/tours/eat-drink-georgetown": "/tours/penang-street-food",
  "/tours/secrets-of-kl-nightlife-street-art-cocktails": "/tours/secrets-of-kl-nightlife-street-art-and-cocktails",
  "/tours/melaka-cultural-food-journey": "/tours/locations/food-tours-melaka",
  "/kuala-lumpur-food-tour": "/tours/kuala-lumpur-street-food",
  "/vegetarian-food-tours": "/tours/dietary/vegetarian-food-tours",

  // ── Priority 3b — Static/legal (77 imps/mo) ──
  "/terms-conditions": "/terms",
  "/privacy-policy": "/privacy",
  "/local-farming-partnerships": "/about",
  "/street-food-culture": "/stories/must-try-malaysian-street-food",
  "/why-we-care-about-sustainability": "/about",
  "/custom-tours/media": "/tours/tailored-tours",
  "/ms/stories/food-safety": "/stories/food-safety",
  "/ms/stories/must-try-malaysian-street-food": "/stories/must-try-malaysian-street-food",

  // ── Legacy redirects (existing) ──
  "/tours/eat-drink-george-town": "/tours/georgetown-night-food-durian",

  // ── Top-level pages → /stories/ (Google indexed w/o prefix) ──
  "/11-foods-to-try-during-hari-raya": "/stories/11-foods-to-try-during-hari-raya",
  "/chinese-dumpling-festival": "/stories/chinese-dumpling-festival",
  "/durian-guide-2026": "/stories/durian-guide-2026",
  "/food-safety": "/stories/food-safety",
  "/food-tours": "/stories/food-tours",
  "/gluten-free-guide-malaysia": "/stories/gluten-free-guide-malaysia",
  "/hidden-gems-in-kuala-lumpur": "/stories/hidden-gems-in-kuala-lumpur",
  "/kuala-lumpur-guide-malaysia": "/stories/kuala-lumpur-guide-malaysia",
  "/malaysian-herbs-and-spices": "/stories/malaysian-herbs-and-spices",
  "/must-try-malaysian-street-food": "/stories/must-try-malaysian-street-food",
  "/port-klang-to-kuala-lumpur": "/stories/port-klang-to-kuala-lumpur",
  "/rendang-daging": "/stories/rendang-daging",
  "/souvenirs-for-foodies": "/stories/souvenirs-for-foodies",
  "/spicy-food": "/stories/spicy-food",
  "/traveling-during-fasting-month": "/stories/traveling-during-fasting-month",
  "/vegan-guide-penang": "/stories/vegan-guide-penang",

  // ── Canonicalize trailing slash ──
  "/directions": "/directions/",
};

// Static file extensions that can be cached at the edge for 30 days
var CACHED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".css", ".js", ".ico", ".woff2", ".pdf", ".mp4", ".webm"];

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  var url = new URL(request.url);

  // ── Static assets — pass through immediately ──
  if (/\.(jpg|jpeg|png|webp|gif|svg|css|js|ico|woff2|pdf|mp4|webm)$/i.test(url.pathname)) {
    var originResponse = await fetch(new Request(new URL(url.pathname + url.search, PAGES_ORIGIN).toString(), {
      method: "GET",
      headers: request.headers,
      redirect: "manual"
    }));
    return addCaching(originResponse, url.pathname);
  }

  // ── Dynamic redirects (run before static map) ──

  // 1. Strip .html extension (legacy Strapi/AstroWind URLs — 313 404s)
  if (url.pathname.endsWith('.html')) {
    var cleaned = url.pathname.slice(0, -5);
    return Response.redirect('https://simplyenak.com' + cleaned + url.search, 301);
  }

  // 2. Static redirects ──
  var lookupPath = url.pathname.replace(/\/$/, '') || '/';
  var redirectTarget = REDIRECTS[lookupPath];
  if (redirectTarget) {
    return Response.redirect("https://simplyenak.com" + redirectTarget + url.search, 301);
  }

  // ── Skip non-page requests
  // Only HTML pages need rewriting. Static assets, images, JSON, API
  // calls — pass straight through without the Worker overhead.
  var accept = request.headers.get("accept") || "";
  var contentType = request.headers.get("content-type") || "";
  if (accept.indexOf("text/html") === -1 && contentType.indexOf("text/html") === -1) {
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
    method: request.method,
    headers: request.headers,
    body: ["GET", "HEAD"].includes(request.method) ? null : request.body,
    redirect: "manual"
  });
  var response = await fetch(originRequest);

  // Pass through redirects — they shouldn't be cached
  if (response.status >= 300 && response.status < 400) {
    return response;
  }

  // 3. Locale 404 fallback — if locale URL 404s, redirect to English
  // (152 404s: /ja/stories/X, /nl/tours/Y etc. — content exists in English only)
  if (response.status === 404) {
    var localeMatch = url.pathname.match(/^\/([a-z]{2})\/(stories|tours)\//);
    if (localeMatch) {
      var englishPath = '/' + localeMatch[2] + '/' + url.pathname.slice(localeMatch[0].length);
      return Response.redirect('https://simplyenak.com' + englishPath + url.search, 301);
    }
  }

  // 4. ?lang= query string 404s — strip query and redirect to English
  // (90 404s: /must-try-malaysian-street-food/?lang=ms etc.)
  if (response.status === 404 && url.search) {
    return Response.redirect('https://simplyenak.com' + url.pathname + url.search, 301);
  }

  // Non-HTML responses from this path also get caching
  var responseContentType = (response.headers.get("content-type") || "").toLowerCase();
  if (responseContentType.indexOf("text/html") === -1) {
    return addCaching(response, url.pathname);
  }

  // ── HTML transformations ──
  var html = await response.text();

  // Replace S3 origin URLs with CDN URLs
  // NOTE: This should be moved to a Cloudflare Transform Rule —
  // it's free, faster, and doesn't require a Worker invocation.
  var s3Regex = /https:\/\/se-website-images\.s3\.nl-ams\.scw\.cloud/g;
  var hasS3Urls = s3Regex.test(html);

  if (hasS3Urls) {
    html = html.replace(s3Regex, CDN_ROOT);
  }

  // Apply edge caching headers for all HTML responses
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
