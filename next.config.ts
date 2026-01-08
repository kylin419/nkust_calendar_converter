/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // 忽略伺服器端不需要的二進制依賴
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
};

export default nextConfig;