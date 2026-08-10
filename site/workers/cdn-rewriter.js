var CDN_ORIGIN = "https://cdn.simplyenak.com";
var PAGES_ORIGIN = "https://website-40z.pages.dev";
var CDN_ROOT = "https://cdn.simplyenak.com";
var STATIC_TTL = 2592000; // 30 days in seconds
var HTML_CACHE_TTL = 300; // seconds — AI systems fetch pages in real time; short edge TTL keeps HTML fast without staleness

// ── Static redirect map ──────────────────────────────────────────────
// This is the single source of truth for 301s on simplyenak.com.
// The site _redirects file and Pages Functions don't fire because
// this Worker catches requests first — put all redirects here.
var REDIRECTS = {
  // ── Priority 1 — Stories with existing live targets (7,334 imps/mo) ──
  "/stories/eating-durians": "/stories/eating-durians/",
  "/pt/stories/eating-durians": "/stories/eating-durians/",
  "/do-malaysians-speak-english": "/stories/do-malaysians-speak-english",
  "/ms/stories/chinese-dumpling-festival": "/stories/chinese-dumpling-festival",

  // ── Priority 3a — Renamed tours (727 imps/mo) ──
  "/tours/flavours-of-malaysia-off-the-beaten-track": "/tours/flavours-of-malaysia",
  "/tours/eat-drink-georgetown": "/tours/penang-street-food",
  "/tours/secrets-of-kl-nightlife-street-art-cocktails": "/tours/secrets-of-kl-nightlife-street-art-and-cocktails",
  "/tours/melaka-cultural-food-journey": "/tours/locations/food-tours-melaka",
  "/kuala-lumpur-food-tour": "/tours/kuala-lumpur-street-food",
  "/vegetarian-food-tours": "/tours/dietary/vegetarian-food-tours",

  // ── Depth restructure: dietary/food → dietary/food-tours/ ──
  "/tours/dietary/vegetarian-food": "/tours/dietary/vegetarian-food-tours/",
  "/tours/dietary/vegetarian-food/": "/tours/dietary/vegetarian-food-tours/",
  "/tours/dietary/halal-food": "/tours/dietary/halal-food-tours/",
  "/tours/dietary/halal-food/": "/tours/dietary/halal-food-tours/",
  "/tours/dietary/vegan-food": "/tours/dietary/vegan-food-tours/",
  "/tours/dietary/vegan-food/": "/tours/dietary/vegan-food-tours/",
  "/tours/dietary/gluten-free-food": "/tours/dietary/gluten-free-food-tours/",
  "/tours/dietary/gluten-free-food/": "/tours/dietary/gluten-free-food-tours/",
  "/tours/dietary/jain-food": "/tours/dietary/jain-food-tours/",
  "/tours/dietary/jain-food/": "/tours/dietary/jain-food-tours/",

  // ── Priority 3b — Static/legal (77 imps/mo) ──
  "/terms-conditions": "/terms",
  "/privacy-policy": "/privacy",
  "/local-farming-partnerships": "/about",
  "/street-food-culture": "/stories/must-try-malaysian-street-food",
  "/why-we-care-about-sustainability": "/about",
  "/custom-tours/media": "/tours/tailored-tours",
  "/ms/stories/food-safety": "/stories/food-safety",
  "/ms/stories/must-try-malaysian-street-food": "/stories/must-try-malaysian-street-food",

  // ── Redirect story slugs to tours (content lives on tour pages) ──
  "/stories/flavours-of-malaysia-off-the-beaten-track": "/tours/flavours-of-malaysia",
  "/stories/eat-drink-georgetown": "/tours/penang-street-food",
  "/stories/secrets-of-kl-nightlife": "/tours/secrets-of-kl-nightlife-street-art-and-cocktails",
  "/stories/melaka-cultural-food-journey": "/stories/food-tours-melaka",

  // ── Food-tours → /tours index ──
  "/food-tours": "/tours",
  "/food-tours/": "/tours",
  "/tours/eat-drink-george-town": "/tours/penang-street-food",

  // ── Top-level pages → /stories/ (Google indexed w/o prefix) ──
  "/11-foods-to-try-during-hari-raya": "/stories/11-foods-to-try-during-hari-raya",
  "/chinese-dumpling-festival": "/stories/chinese-dumpling-festival",
  "/durian-guide-2026": "/stories/durian-guide-2026",
  "/food-safety": "/stories/food-safety",
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

  // ── Nested/malformed URLs from 404 categorization ──
  "/11-foods-to-try-during-hari-raya/custom-tours": "/stories/11-foods-to-try-during-hari-raya",
  "/11-foods-to-try-during-hari-raya/stories": "/stories/11-foods-to-try-during-hari-raya",
  "/11-foods-to-try-during-hari-raya/tours": "/stories/11-foods-to-try-during-hari-raya",
  "/chinese-dumpling-festival/": "/stories/chinese-dumpling-festival",
  "/dog-meat/": "/stories/dog-meat",
  "/dog-meat/custom-tours": "/stories/dog-meat",
  "/dog-meat/stories": "/stories/dog-meat",
  "/dog-meat/tours": "/stories/dog-meat",
  "/eating-durians/custom-tours": "/stories/eating-durians",
  "/eating-durians/tours": "/stories/eating-durians",
  "/food-safety/custom-tours": "/stories/food-safety",
  "/food-safety/tours": "/stories/food-safety",
  "/eat-drink-georgetown": "/tours/penang-street-food",
  "/eat-drink-georgetown/": "/tours/penang-street-food",
  "/eat-drink-george-town": "/tours/penang-street-food",
  "/eat-drink-george-town/": "/tours/penang-street-food",
  "/secrets-of-kl-nightlife": "/tours/secrets-of-kl-nightlife-street-art-and-cocktails",
  "/secrets-of-kl-nightlife/": "/tours/secrets-of-kl-nightlife-street-art-and-cocktails",
  "/flavours-of-malaysia-off-the-beaten-track": "/tours/flavours-of-malaysia",
  "/flavours-of-malaysia-off-the-beaten-track/": "/tours/flavours-of-malaysia",
  "/melaka-cultural-food-journey": "/stories/melaka-cultural-food-journey",
  "/melaka-cultural-food-journey/": "/stories/melaka-cultural-food-journey",
  "/hidden-gems-in-kuala-lumpur/": "/stories/hidden-gems-in-kuala-lumpur",
  "/kuala-lumpur-food-tour/stories": "/stories/kuala-lumpur-food-tour",
  "/malaysian-herbs-and-spices/custom-tours": "/stories/malaysian-herbs-and-spices",
  "/malaysian-herbs-and-spices/stories": "/stories/malaysian-herbs-and-spices",
  "/malaysian-herbs-and-spices/tours": "/stories/malaysian-herbs-and-spices",
  "/must-try-malaysian-street-food/": "/stories/must-try-malaysian-street-food",
  "/must-try-malaysian-street-food/stories": "/stories/must-try-malaysian-street-food",
  "/must-try-malaysian-street-food/tours": "/stories/must-try-malaysian-street-food",
  "/port-klang-to-kuala-lumpur/": "/stories/port-klang-to-kuala-lumpur",
  "/rendang-daging/": "/stories/rendang-daging",
  "/rendang-daging/custom-tours": "/stories/rendang-daging",
  "/rendang-daging/stories": "/stories/rendang-daging",
  "/rendang-daging/tours": "/stories/rendang-daging",
  "/souvenirs-for-foodies/": "/stories/souvenirs-for-foodies",
  "/spicy-food/": "/stories/spicy-food",
  "/spicy-food//1000": "/stories/spicy-food",
  "/spicy-food/1000": "/stories/spicy-food",
  "/spicy-food/stories": "/stories/spicy-food",
  "/spicy-food/tours": "/stories/spicy-food",

  // ── Canonicalize trailing slash ──
  "/directions": "/directions/",

  // ── Priority 4 — Root-level story pages (Google indexed without /stories/ prefix) ──
  "/families-guide-kuala-lumpur": "/stories/families-guide-kuala-lumpur",
  "/food-guide-chow-kit": "/stories/food-guide-chow-kit",
  "/wedding-groups-guide-kuala-lumpur": "/stories/wedding-groups-guide-kuala-lumpur",
  "/street-food-guide-kuala-lumpur": "/stories/street-food-guide-kuala-lumpur",
  "/heritage-guide-penang": "/stories/heritage-guide-penang",
  "/little-india-food-tour-guide-penang": "/stories/little-india-food-tour-guide-penang",
  "/johor-bahru-local-food-guide": "/stories/johor-bahru-local-food-guide",
  "/for-couples-guide-kuala-lumpur": "/stories/for-couples-guide-kuala-lumpur",
  "/market-tours-guide-penang": "/stories/market-tours-guide-penang",
  "/jain-guide-kuala-lumpur": "/stories/jain-guide-kuala-lumpur",
  "/melaka-guide-malaysia": "/stories/melaka-guide-malaysia",
  "/halal-guide-kuala-lumpur": "/stories/halal-guide-kuala-lumpur",
  "/traditional-pahang-food": "/stories/traditional-pahang-food",
  "/night-guide-kuala-lumpur": "/stories/night-guide-kuala-lumpur",
  "/malaysian-herbs-and-spices": "/stories/malaysian-herbs-and-spices",
  "/gluten-free-guide-malaysia": "/stories/gluten-free-guide-malaysia",
  "/vegan-guide-penang": "/stories/vegan-guide-penang",

  // ── Priority 5 — Trailing slash canonicalization for stories ──
  "/11-foods-to-try-during-hari-raya/": "/stories/11-foods-to-try-during-hari-raya/",
  "/chinese-dumpling-festival/": "/stories/chinese-dumpling-festival/",
  "/eating-durians/": "/stories/eating-durians/",
  "/do-malaysians-speak-english/": "/stories/do-malaysians-speak-english/",
  "/dog-meat/": "/stories/dog-meat/",
  "/food-safety/": "/stories/food-safety/",
  "/hidden-gems-in-kuala-lumpur/": "/stories/hidden-gems-in-kuala-lumpur/",
  "/malaysian-herbs-and-spices/": "/stories/malaysian-herbs-and-spices/",
  "/must-try-malaysian-street-food/": "/stories/must-try-malaysian-street-food/",
  "/port-klang-to-kuala-lumpur/": "/stories/port-klang-to-kuala-lumpur/",
  "/rendang-daging/": "/stories/rendang-daging/",
  "/souvenirs-for-foodies/": "/stories/souvenirs-for-foodies/",
  "/spicy-food/": "/stories/spicy-food/",
  "/traveling-during-fasting-month/": "/stories/traveling-during-fasting-month/",

  // ── Priority 6 — Blog prefix → Stories ──
  "/blog/johor-bahru-local-food-guide": "/stories/johor-bahru-local-food-guide",
  "/blog/malaysian-chefs-local-cuisine": "/stories/malaysian-chefs-local-cuisine",

  // ── Priority 7 — Tag/category pages (redirect to English) ──
  "/de/tag/culture": "/tag/culture",
  "/de/tag/hari-raya": "/tag/hari-raya",
  "/de/tag/ramadan": "/tag/ramadan",
  "/de/tag/shopping": "/tag/shopping",
  "/de/tag/souvenirs": "/tag/souvenirs",
  "/de/tag/vegan": "/tag/vegan",
  "/de/category/food-culture-guides": "/category/food-culture-guides",
  "/es/tag/culture": "/tag/culture",
  "/es/tag/food-safety": "/tag/food-safety",
  "/es/tag/hari-raya": "/tag/hari-raya",
  "/es/tag/ramadan": "/tag/ramadan",
  "/es/tag/shopping": "/tag/shopping",
  "/es/tag/souvenirs": "/tag/souvenirs",
  "/es/tag/vegan": "/tag/vegan",
  "/es/category/food-culture-guides": "/category/food-culture-guides",
  "/fr/tag/hari-raya": "/tag/hari-raya",
  "/fr/tag/ramadan": "/tag/ramadan",
  "/fr/tag/shopping": "/tag/shopping",
  "/fr/tag/souvenirs": "/tag/souvenirs",
  "/fr/tag/vegan": "/tag/vegan",
  "/fr/category/food-culture-guides": "/category/food-culture-guides",
  "/ja/tag/culture": "/tag/culture",
  "/ja/tag/hari-raya": "/tag/hari-raya",
  "/ja/tag/ramadan": "/tag/ramadan",
  "/ja/tag/souvenirs": "/tag/souvenirs",
  "/ms/tag/culture": "/tag/culture",
  "/ms/tag/shopping": "/tag/shopping",
  "/ms/tag/souvenirs": "/tag/souvenirs",
  "/ms/tag/vegan": "/tag/vegan",
  "/nl/tag/culture": "/tag/culture",
  "/nl/tag/hari-raya": "/tag/hari-raya",
  "/nl/tag/ramadan": "/tag/ramadan",
  "/nl/tag/shopping": "/tag/shopping",
  "/nl/tag/souvenirs": "/tag/souvenirs",
  "/nl/tag/vegan": "/tag/vegan",
  "/nl/category/food-culture-guides": "/category/food-culture-guides",
  "/pt/tag/culture": "/tag/culture",
  "/pt/tag/food-safety": "/tag/food-safety",
  "/pt/tag/hari-raya": "/tag/hari-raya",
  "/pt/tag/ramadan": "/tag/ramadan",
  "/pt/tag/shopping": "/tag/shopping",
  "/pt/tag/souvenirs": "/tag/souvenirs",
  "/ru/tag/culture": "/tag/culture",
  "/ru/tag/hari-raya": "/tag/hari-raya",
  "/ru/tag/ramadan": "/tag/ramadan",
  "/ru/tag/shopping": "/tag/shopping",
  "/ru/tag/souvenirs": "/tag/souvenirs",
  "/zh/tag/culture": "/tag/culture",
  "/zh/tag/hari-raya": "/tag/hari-raya",
  "/zh/tag/ramadan": "/tag/ramadan",
  "/zh/tag/shopping": "/tag/shopping",
  "/zh/tag/souvenirs": "/tag/souvenirs",

  // ── Priority 8 — Locale story pages without /stories/ prefix ──
  "/de/families-guide-kuala-lumpur": "/de/stories/families-guide-kuala-lumpur",
  "/de/vegetarian-guide-kuala-lumpur": "/de/stories/vegetarian-guide-kuala-lumpur",
  "/es/food-guide-chow-kit": "/es/stories/food-guide-chow-kit",
  "/es/street-food-guide-kuala-lumpur": "/es/stories/street-food-guide-kuala-lumpur",
  "/fr/families-guide-kuala-lumpur": "/fr/stories/families-guide-kuala-lumpur",
  "/fr/street-food-guide-kuala-lumpur": "/fr/stories/street-food-guide-kuala-lumpur",
  "/fr/wedding-groups-guide-kuala-lumpur": "/fr/stories/wedding-groups-guide-kuala-lumpur",
  "/ms/eating-durians": "/ms/stories/eating-durians",
  "/ms/families-guide-kuala-lumpur": "/ms/stories/families-guide-kuala-lumpur",
  "/nl/families-guide-kuala-lumpur": "/nl/stories/families-guide-kuala-lumpur",
  "/ru/families-guide-kuala-lumpur": "/ru/stories/families-guide-kuala-lumpur",
  "/zh/families-guide-kuala-lumpur": "/zh/stories/families-guide-kuala-lumpur",
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
  // 2. Strip ?lang=en (English = default locale, duplicate content)
  // 174 GSC "Alternative page with proper canonical tag" entries
  if (url.searchParams.get('lang') === 'en') {
    url.searchParams.delete('lang');
    return Response.redirect('https://simplyenak.com' + url.pathname + (url.search || ''), 301);
  }

  // 3. Static redirects ──
  var redirectTarget = REDIRECTS[url.pathname];
  if (redirectTarget) {
    return Response.redirect("https://simplyenak.com" + redirectTarget + url.search, 301);
  }

  // 4. Dynamic redirects — pattern-based fixes for remaining 404s ──

  // 4a. Remove duplicate path segments: /tours/tours/... → /tours/...
  if (url.pathname.indexOf('/tours/tours/') === 0 || url.pathname === '/tours/tours') {
    var newPath = url.pathname.replace('/tours/tours', '/tours');
    return Response.redirect("https://simplyenak.com" + newPath + url.search, 301);
  }
  // 4b. Remove duplicate path segments: /stories/stories/... → /stories/...
  if (url.pathname.indexOf('/stories/stories/') === 0 || url.pathname === '/stories/stories') {
    var newPath2 = url.pathname.replace('/stories/stories', '/stories');
    return Response.redirect("https://simplyenak.com" + newPath2 + url.search, 301);
  }
  // 4c. Locale prefix without /stories/ or /tours/ → add /stories/
  // e.g., /de/vegetarian-guide-kuala-lumpur → /de/stories/vegetarian-guide-kuala-lumpur
  var localePrefixMatch = url.pathname.match(/^\/([a-z]{2})\/([^\/]+)$/);
  if (localePrefixMatch) {
    var localeCode = localePrefixMatch[1];
    var slug = localePrefixMatch[2];
    // Skip known non-story paths
    if (localeCode !== 'en' && slug !== 'tours' && slug !== 'stories' && slug !== 'contact' &&
        slug !== 'about' && slug !== 'privacy' && slug !== 'terms' && slug !== 'faq' &&
        slug !== 'directions' && slug !== 'how-it-works' && slug !== 'how-to-prepare') {
      return Response.redirect("https://simplyenak.com" + url.pathname.replace('/' + localeCode + '/', '/' + localeCode + '/stories/') + url.search, 301);
    }
  }
  // 4d. /tours/dietary/XXX/ (trailing slash) → /tours/dietary/XXX (no slash)
  var dietaryMatch = url.pathname.match(/^\/tours\/dietary\/([^\/]+)\/$/);
  if (dietaryMatch) {
    return Response.redirect("https://simplyenak.com" + url.pathname.slice(0, -1) + url.search, 301);
  }
  // 4e. /tours/locations/ (trailing slash) → /tours/locations (no slash)
  if (url.pathname === '/tours/locations/') {
    return Response.redirect("https://simplyenak.com/tours/locations" + url.search, 301);
  }
  // 4f. Remove known suffixes: /custom-tours, /stories, /tours from story/tour paths
  var suffixPatterns = [
    ['/custom-tours', ''],
    ['/stories', ''],
    ['/tours', ''],
    ['/facebook', ''],
    ['/instagram', ''],
    ['/contact', ''],
    ['/privacy-policy', '/privacy'],
    ['/terms-conditions', '/terms'],
    ['/about', ''],
    ['/media', ''],
    ['/index.html', '']
  ];
  for (var i = 0; i < suffixPatterns.length; i++) {
    var suffix = suffixPatterns[i][0];
    var replacement = suffixPatterns[i][1];
    if (url.pathname.endsWith(suffix) && url.pathname !== suffix) {
      var base = url.pathname.slice(0, -suffix.length);
      if (base.length > 0) {
        return Response.redirect("https://simplyenak.com" + base + replacement + url.search, 301);
      }
    }
  }
  // 4g. /blog/ prefix → /stories/ prefix
  if (url.pathname.indexOf('/blog/') === 0) {
    return Response.redirect("https://simplyenak.com" + url.pathname.replace('/blog/', '/stories/'), 301);
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
  // NOTE: the origin subrequest is edge-cached via cf.cacheTtl below (free-plan safe;
  // the Workers Cache API is paid-plan only and throws 1101 on free zones).
  var originUrl = new URL(url.pathname + url.search, PAGES_ORIGIN);
  var originRequest = new Request(originUrl.toString(), {
    method: request.method,
    headers: request.headers,
    body: ["GET", "HEAD"].includes(request.method) ? null : request.body,
    redirect: "manual"
  });
  var response = await fetch(originRequest, {
    // Best-effort edge caching of the origin subrequest (5 min).
    // NOTE: verified 2026-08-05 via diagnostic worker — cf.cacheTtl/cacheEverything
    // are a NO-OP on this free zone (subrequest cf-cache-status stays "none").
    // Harmless to keep: engages automatically if the zone ever gets a Cache Rule
    // (dashboard, Caching → Cache Rules) or a plan upgrade. Real HTML edge
    // caching on free requires a dashboard Cache Rule — no API token has
    // Zone Settings Edit permission.
    cf: { cacheEverything: true, cacheTtl: HTML_CACHE_TTL }
  });

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
  newHeaders.set("cache-control", "public, s-maxage=" + HTML_CACHE_TTL + ", max-age=0, must-revalidate");

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
