/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    trailingSlash: false,
    experimental: {
        turbopack: {
            root: __dirname
        }
    }
};

export default nextConfig;