import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_BASE_API: process.env.NEXT_BASE_API,
  },
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.artiversehub.ai',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.cdn.famobi.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'games.cdn.famobi.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  productionBrowserSourceMaps: false,
};

export default withNextIntl(nextConfig);
