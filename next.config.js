/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'upload.wikimedia.org',
      'www.edigitalagency.com.au',
      'www.noaa.gov',
      'www.qrcode-monkey.com',
      'pbs.twimg.com',
      'mms.businesswire.com',
    ],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
