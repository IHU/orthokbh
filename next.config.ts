import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV !== 'production';

const nextConfig: NextConfig = {
    trailingSlash: false,
    images: {
        unoptimized: isDev,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
             {
                protocol: 'https',
                hostname: 'placehold.co',
            },
            {
                protocol: 'https',
                hostname: '**.unsplash.com',
            },
            {
                protocol: "https",
                hostname: "picsum.photos",
            },
            {
                protocol: "https",
                hostname: "localhost",
                port: "44352",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "onecms.dk",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "cms.uslu.dk",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "flowbite.s3.amazonaws.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "pagedone.io",
                pathname: "/**",
            }
        ],
    },
}

module.exports = nextConfig
