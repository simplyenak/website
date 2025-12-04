export default [
  "strapi::logger",
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "img-src": [
            "'self'",
            "data:",
            "blob:",
            "market-assets.strapi.io",
            "se-website-images.s3.nl-ams.scw.cloud",
          ],
          "media-src": [
            "'self'",
            "data:",
            "blob:",
            "market-assets.strapi.io",
            "se-website-images.s3.nl-ams.scw.cloud",
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::query",
  {
    name: "strapi::body",
    config: {
      formLimit: "500mb",
      jsonLimit: "500mb",
      textLimit: "500mb",
      formidable: {
        maxFileSize: 500 * 1024 * 1024,
        maxFields: 1000,
        maxFieldsSize: 500 * 1024 * 1024,
      },
    },
  },
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
