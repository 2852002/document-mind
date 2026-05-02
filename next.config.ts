/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pdf-parse', '@xenova/transformers'],
  turbopack: {},
};

module.exports = nextConfig;