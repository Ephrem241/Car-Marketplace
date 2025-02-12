/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "res.firebasestorage.googleapis.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
