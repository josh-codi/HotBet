/** @type {import('next').NextConfig} */
const nextConfig = {
    turbopack: {
        root: process.cwd(),
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.pinimg.com',
            },
            {
                protocol: 'https',
                hostname: 'media.api-sports.io',
            },
            {
                protocol: 'https',
                hostname: 'media-4.api-sports.io',
            },
        ],
    },
}

export default nextConfig
