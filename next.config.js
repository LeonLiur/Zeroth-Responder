/** @type {import('next').NextConfig} */
const path = require('path')

nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}

module.exports = nextConfig
