/** @type {import('next').NextConfig} */
const nextConfig = {
    env:
    {
        APP_URL: 'http://localhost:3000',
        APP_NAME: 'Techgyan Entity',
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "raviblog",
        NEXT_PUBLIC_CLOUDINARY_API_KEY: "762153554883525",

        AUTH_GOOGLE_ID: '735233162323-08gs3se21le3l3pb0rn8rq1uv57fgg4l.apps.googleusercontent.com',
        AUTH_AUTH0_ID: 'HcJaMefXTZpxEi5Q8pE3pZQFTtVr7WVr',
        STUDIO_URL_PREFIX: 'studio',
        NEXT_PUBLIC_STUDIO_NAME: 'Content Studio',
        NEXT_PUBLIC_STUDIO_PATH: 'studio',
        MODAL_BLUR: 'false',
    },
    experimental: {
        instrumentationHook: true,
        urlImports: [],
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'www.raviblog.tech',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'www.gstatic.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'www.google.com',
                pathname: '**',
            },
        ],
    },
    reactStrictMode: false,
};

export default nextConfig;
