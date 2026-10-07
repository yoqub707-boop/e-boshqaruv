/** @type {import('next').NextConfig} */
const nextConfig = {
  // Rasmlarni optimallashtirish
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
