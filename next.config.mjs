/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizeCss: false,
  },
};

export default nextConfig;
