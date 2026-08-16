var CDN_ORIGIN = "https://cdn.culinarytravelexperts.com";
var PAGES_ORIGIN = "https://culinary-travel-experts.pages.dev";
var CDN_ROOT = "https://cdn.culinarytravelexperts.com";
var STATIC_TTL = 2592000; // 30 days in seconds

// Static file extensions that can be cached at the edge for 30 days
var CACHED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".css", ".js", ".ico", ".woff2", ".pdf", ".mp4", ".webm"];

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  var url = new URL(request.url);

  // ── IndexNow key — pass through immediately ──
  if (url.pathname === '/indexnow-key.txt') {
    var keyResponse = await fetch(new Request(new URL(url.pathname, PAGES_ORIGIN).toString(), {
      method: "GET",
      headers: request.headers,
      redirect: "manual"
    }));
    return keyResponse;
  }

  // ── Static assets — pass through immediately ──
  if (/\.(jpg|jpeg|png|webp|gif|svg|css|js|ico|woff2|pdf|mp4|webm)$/i.test(url.pathname)) {
    var originResponse = await fetch(new Request(new URL(url.pathname + url.search, PAGES_ORIGIN).toString(), {
      method: "GET",
      headers: request.headers,
      redirect: "manual"
    }));
    return addCaching(originResponse, url.pathname);
  }

  // ── Skip non-page requests
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

  // Non-HTML responses from this path also get caching
  var responseContentType = (response.headers.get("content-type") || "").toLowerCase();
  if (responseContentType.indexOf("text/html") === -1) {
    return addCaching(response, url.pathname);
  }

  // ── HTML transformations ──
  var html = await response.text();

  // Replace S3 origin URLs with CDN URLs
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

// Add caching headers for static assets
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
