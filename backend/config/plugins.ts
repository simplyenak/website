module.exports = ({ env }) => ({
  // ...
  upload: {
    config: {
      provider: "aws-s3",
      providerOptions: {
        s3Options: {
          credentials: {
            accessKeyId: env("SCALEWAY_ACCESS_KEY_ID"),
            secretAccessKey: env("SCALEWAY_ACCESS_SECRET"),
          },
          region: env("SCALEWAY_REGION"), // e.g "fr-par"
          endpoint: env("SCALEWAY_ENDPOINT"), // e.g. "https://s3.fr-par.scw.cloud"
          params: {
            Bucket: env("SCALEWAY_BUCKET"),
          },
        },
      },
      actionOptions: {
        upload: {
          sizeLimit: 300 * 1024 * 1024, // 300MB limit for videos
        },
      },
    },
  },
  // ...
});
