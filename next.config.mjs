/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-684856b0babe49e28b4af89f6cc8b560.r2.dev',
        port: '',
        pathname: '/**', // Allows all images from this domain
      },
    ],
  },
};

export default nextConfig;