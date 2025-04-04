/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/**",
      },
      {
        protocol: "https",
        hostname: "res.firebasestorage.googleapis.com",
        pathname: "/v0/b/**",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
        pathname: "**",
      },
    ],
    minimumCacheTTL: 60, // Cache images for 60 seconds
    formats: ["image/avif", "image/webp"], // Optimize image loading
  },
  webpack: (config, { isServer }) => {
    // Add path alias
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": "/src",
    };

    // Add existing rules
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|webp)$/i,
      type: "asset/resource",
    });

    if (!isServer) {
      config.watchOptions = {
        aggregateTimeout: 300,
        poll: 1000,
      };
      config.optimization.splitChunks = {
        chunks: "all",
        maxInitialRequests: 25,
        minSize: 20000,
      };
    }

    return config;
  },
  experimental: {
    scrollRestoration: true,
  },
};

export default nextConfig;
