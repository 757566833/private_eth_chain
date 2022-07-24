/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      ...defaultPathMap,
      '/address/index': { page: '/address/[address]'},
      '/block/index': { page: '/block/[block]'},
      '/tx/index': { page: '/tx/[tx]' },
    }
  },
};