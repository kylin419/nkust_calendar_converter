/** @type {import('next').NextConfig} */
const nextConfig = {
  // 針對 Turbopack 的配置
  experimental: {
    turbo: {
      resolveAlias: {
        canvas: "./empty.js",
      },
    },
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
};

export default nextConfig;
