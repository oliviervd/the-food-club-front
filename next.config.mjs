const nextConfig = {
    reactStrictMode: true,
    i18n: {
        locales: ['en'],
        defaultLocale: 'en',
        localeDetection: false, // 👈 prevents redirect to /en
    },
}

export default nextConfig