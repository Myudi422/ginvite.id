// next.config.mjs
import WebpackObfuscator from 'webpack-obfuscator';
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  swcMinify: true,
  compress: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '10MB',
    },
  },
  webpack: (config, { isServer, dev }) => {
    // DISABLED: WebpackObfuscator causes chunk loading errors in production
    // if (!isServer && !dev) { // Hanya terapkan obfuscator saat build produksi (bukan server dan bukan development)
    //   config.plugins.push(
    //     new WebpackObfuscator(
    //       {
    //         rotateStringArray: true,
    //         // Tambahkan opsi obfuscator lain sesuai kebutuhan Anda untuk produksi
    //       },
    //       ['./_next/static/chunks/**/*.js'],
    //       []
    //     )
    //   );
    // }

    return config;
  },
};

export default nextConfig;