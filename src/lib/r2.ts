import { S3Client } from "@aws-sdk/client-s3";

const normalizeEndpoint = (endpoint: string) => {
  const trimmed = endpoint.trim().replace(/\/+$/, "");
  const withProtocol =
    trimmed.startsWith("https://") || trimmed.startsWith("http://")
      ? trimmed
      : `https://${trimmed}`;
  return withProtocol.replace(/\/+$/, "");
};

const getRequiredEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const getR2BucketName = () => getRequiredEnv("R2_BUCKET_NAME");
export const getR2Endpoint = () => normalizeEndpoint(getRequiredEnv("R2_ENDPOINT"));

let r2Client: S3Client | null = null;

export const getR2Client = () => {
  if (r2Client) {
    return r2Client;
  }

  r2Client = new S3Client({
    region: "auto",
    endpoint: getR2Endpoint(),
    forcePathStyle: true,
    credentials: {
      accessKeyId: getRequiredEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: getRequiredEnv("R2_SECRET_ACCESS_KEY")
    }
  });

  return r2Client;
};
