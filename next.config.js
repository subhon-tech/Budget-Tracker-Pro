/** @type {import('next').NextConfig} */
// Force reload for Prisma schema changes
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
}

module.exports = nextConfig
