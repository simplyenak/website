var S3_ORIGIN = "https://se-website-images.s3.nl-ams.scw.cloud";
var CDN_ORIGIN = "https://cdn.simplyenak.com";
var PAGES_ORIGIN = "https://website-40z.pages.dev";

// ── Static redirect map ──────────────────────────────────────────────
// Add new 301s here. Each entry is {source_path: target_path}.
// The Worker runs before Pages, so _redirects and Pages Functions
// don't fire on the custom domain. This is the only place redirects
// take effect for simplyenak.com.
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

  // ── Fetch from Pages origin ──
  var originUrl = new URL(url.pathname + url.search, PAGES_ORIGIN);
  var originRequest = new Request(originUrl.toString(), {
    method: request.method,
    headers: request.headers,
    body: ["GET", "HEAD"].includes(request.method) ? null : request.body,
    redirect: "manual"  // Don't follow Pages' redirects — pass them through
  });
  var response = await fetch(originRequest);

  // Pass through redirects from Pages
  if (response.status >= 300 && response.status < 400) {
    return response;
  }

  // Only rewrite HTML responses
  var contentType = response.headers.get("content-type") || "";
  if (contentType.indexOf("text/html") === -1) {
    return response;
  }

  // ── HTML transformations ──
  var html = await response.text();

  // Remove "in the media" section (press mentions strip on homepage)
  html = removeSection(html, "in the media");

  // Replace S3 origin URLs with CDN URLs
  html = html.replaceAll(S3_ORIGIN, CDN_ORIGIN);

  return new Response(html, {
    status: response.status,
    headers: response.headers
  });
}

function removeSection(html, marker) {
  var idx = html.indexOf(marker);
  if (idx === -1) return html;
  var sectionStart = html.lastIndexOf("<section", idx);
  if (sectionStart === -1) return html;
  var sectionEnd = html.indexOf("</section>", idx);
  if (sectionEnd === -1) return html;
  return html.slice(0, sectionStart) + html.slice(sectionEnd + "</section>".length);
}
