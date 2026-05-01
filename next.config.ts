import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf-parse', '@xenova/transformers'],
  turbopack: {},
};

export default nextConfig;