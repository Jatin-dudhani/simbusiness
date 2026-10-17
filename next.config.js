/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fakestoreapi.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/advance-tool',
        destination: '/tools',
        permanent: false,
      },
      {
        source: '/advancetool',
        destination: '/tools',
        permanent: false,
      },
      {
        source: '/advanced-tools',
        destination: '/tools',
        permanent: false,
      },
      {
        source: '/advanced-tool',
        destination: '/tools',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;