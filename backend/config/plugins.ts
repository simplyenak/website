module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: "aws-s3",
      providerOptions: {
        s3Options: {
          credentials: {
            accessKeyId: env("SCALEWAY_ACCESS_KEY_ID"),
            secretAccessKey: env("SCALEWAY_ACCESS_SECRET"),
          },
          region: env("SCALEWAY_REGION"),
          endpoint: env("SCALEWAY_ENDPOINT"),
          params: {
            Bucket: env("SCALEWAY_BUCKET"),
          },
          httpOptions: {
            timeout: 600000,
            connectTimeout: 600000,
          },
        },
      },
      actionOptions: {
        upload: {
          sizeLimit: 500 * 1024 * 1024,
        },
        uploadStream: {
          sizeLimit: 500 * 1024 * 1024,
        },
      },
    },
  },
});
