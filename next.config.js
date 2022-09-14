/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
module.exports = {
  images: {
    domains: ['platform-lookaside.fbsbx.com', 'mosaic.scdn.co', 'i.scdn.co'],
  }
}