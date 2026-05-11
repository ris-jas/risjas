const normalizeEndpoint = (endpoint = "") => {
  const trimmed = endpoint.trim().replace(/\/+$/, "");
  if (!trimmed) return "";
  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const getR2Pattern = () => {
  const normalized = normalizeEndpoint(process.env.R2_ENDPOINT);
  if (!normalized) return [];

  try {
    const { protocol, hostname, port } = new URL(normalized);
    return [
      {
        protocol: protocol.replace(":", ""),
        hostname,
        ...(port ? { port } : {})
      }
    ];
  } catch {
    return [];
  }
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      },
      {
        protocol: "https",
        hostname: "risjas.com"
      },
      ...getR2Pattern()
    ]
  }
};

export default nextConfig;
