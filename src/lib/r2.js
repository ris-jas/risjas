import { S3Client } from "@aws-sdk/client-s3";

const requiredVars = [
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_ENDPOINT",
  "R2_BUCKET_NAME"
];

for (const key of requiredVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const normalizeEndpoint = (endpoint) => {
  const trimmed = endpoint.trim().replace(/\/+$/, "");
  const withProtocol =
    trimmed.startsWith("https://") || trimmed.startsWith("http://")
      ? trimmed
      : `https://${trimmed}`;
  return withProtocol.replace(/\/+$/, "");
};

export const r2BucketName = process.env.R2_BUCKET_NAME;
export const r2Endpoint = normalizeEndpoint(process.env.R2_ENDPOINT);

export const r2Client = new S3Client({
  region: "auto",
  endpoint: r2Endpoint,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
  }
});
