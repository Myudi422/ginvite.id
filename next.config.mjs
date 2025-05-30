// next.config.mjs
import WebpackObfuscator from 'webpack-obfuscator';
import path from 'path'; // Import modul 'path' menggunakan sintaks ESM

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
  experimental: {
    serverActions: {
      bodySizeLimit: '10MB',
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new WebpackObfuscator(
          {
            rotateStringArray: true,
            // Tambahkan opsi obfuscator lain sesuai kebutuhan Anda
          },
          ['./_next/static/chunks/**/*.js'], // Pola include untuk chunk JS Next.js
          [] // Pola exclude (opsional)
        )
      );
    }

    return config;
  },
};

export default nextConfig;