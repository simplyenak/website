var PAGES = "https://culinary-travel-experts.pages.dev";

addEventListener("fetch", function(event) {
  event.respondWith(handleRequest(event.request));
});

function handleRequest(request) {
  var url = new URL(request.url);
  return fetch(new Request(new URL(url.pathname + url.search, PAGES).toString(), {
    method: "GET", headers: request.headers, redirect: "manual"
  })).then(function(res) {
    var ct = res.headers.get("content-type") || "";
    if (ct.indexOf("text/html") === -1) return res;

    return res.text().then(function(html) {
      html = html.replace("</head>",
        '<link rel="canonical" href="https://culinarytravelexperts.com">\n' +
        '<meta property="og:title" content="Culinary Travel Experts \u2014 Food Travel Ground Partner in Malaysia &amp; Southeast Asia">\n' +
        '<meta property="og:description" content="Operational expertise, FAM trip resources, and destination guides for travel agents, DMCs, and hotels. 15 years in the field.">\n' +
        '<meta property="og:image" content="https://culinarytravelexperts.com/assets/og-image.jpg">\n' +
        '<meta property="og:url" content="https://culinarytravelexperts.com">\n' +
        '<meta property="og:type" content="website">\n' +
        '<meta property="og:site_name" content="Culinary Travel Experts">\n' +
        '<meta name="twitter:card" content="summary_large_image">\n' +
        '<meta name="twitter:title" content="Culinary Travel Experts \u2014 Food Travel Ground Partner in Malaysia &amp; Southeast Asia">\n' +
        '<meta name="twitter:description" content="Operational expertise, FAM trip resources, and destination guides for travel agents, DMCs, and hotels.">\n' +
        '<meta name="twitter:image" content="https://culinarytravelexperts.com/assets/og-image.jpg">\n' +
        '<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","@id":"https://culinarytravelexperts.com/#organization","name":"Culinary Travel Experts","url":"https://culinarytravelexperts.com","description":"Operational expertise, FAM trip resources, and destination guides for travel agents, DMCs, and hotels. 15 years in the field.","parentOrganization":{"@type":"Organization","name":"Simply Enak","url":"https://simplyenak.com"}}</scr' + 'ipt>\n' +
        '<style>[class*=card-grid-]{display:grid}</style>\n' +
        '</head>');

      html = html.replace('<a href="/about/">About</a>',
        '<a href="/insights/">Insights</a>\n      <a href="/about/">About</a>');

      html = html.replace('<span class="hero-label">For Travel Professionals</span>',
        '<span class="hero-label">For Travel Professionals</span>\n' +
        '    <div class="hero-insights" style="margin-top:1.5rem;display:flex;gap:0.75rem;flex-wrap:wrap">\n' +
        '      <a href="/insights/" style="background:rgba(255,255,255,0.12);color:inherit;padding:0.5rem 1rem;border-radius:6px;font-size:0.875rem;border:1px solid rgba(255,255,255,0.2)">\u2192 Trade Insights: 15 years of operational knowledge</a>\n' +
        '    </div>');

      html = html.replace(/simplyenak\.my/g, "simplyenak.com");
      html = html.replace("Culinary Travel Experts. All rights reserved.", "Local Culinary Travel Experiences Sdn. Bhd.");
      html = html.replace(/unforgettable/gi, "remarkable");

      return new Response(html, { status: res.status, headers: { "content-type": "text/html; charset=utf-8" } });
    });
  });
}
