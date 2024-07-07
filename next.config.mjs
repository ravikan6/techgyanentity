/** @type {import('next').NextConfig} */
const nextConfig = {
    env:
    {
        APP_URL: 'http://localhost:3000',
        APP_NAME: 'Techgyan Entity',
        // NEXTAUTH_URL: 'http://localhost:3000',
        NEXTAUTH_SECRET: '3X4b7KUq8vUMo6WzXVOkeJeuqLCanZTnhnyM8cCRL6o=',
        COOKIE_SECRET: 'Fo1cKMrsO3GHyq/fUsGROUoJ3pQMeXe1pEcTYeZBrIOFm7GJSQy2QH0K9UwysE3AjtU3Q0wDN7+ZNeeaYvw98txGPV73tdvaQcMaULJWuxIH3z2avWae2qjdC8GqRUJ28ByBGUq/cMBkJsn4ducJbH4Wq//w+fHD1ATJYrC8x7JBf7Muzl908NpHYALH5iomL07ATxYUIaE4qAWc6UEno5wyFTZKMXk6IvIDBwrI8PEZZNU=',
        NEXT_PUBLIC_COOKIE_SECRET: 'Fo1cKMrsO3GHyq/fUsGROUoJ3pQMeXe1pEcTYeZBrIOFm7GJSQy2QH0K9UwysE3AjtU3Q0wDN7+ZNeeaYvw98txGPV73tdvaQcMaULJWuxIH3z2avWae2qjdC8GqRUJ28ByBGUq/cMBkJsn4ducJbH4Wq//w+fHD1ATJYrC8x7JBf7Muzl908NpHYALH5iomL07ATxYUIaE4qAWc6UEno5wyFTZKMXk6IvIDBwrI8PEZZNU=',
        PASSWORD_PEPPER: "eLeqr/RyKyCKQUKNDznxMBqcikz9oYk9AxqK6SLyM7M=",
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "raviblog",
        NEXT_PUBLIC_CLOUDINARY_API_KEY: "762153554883525",
        CLOUDINARY_API_SECRET: "p4EUJbAwKVU9qKad_DjWrFCqTmY",
        // NEXT_PUBLIC_CLOUDINARY_SECURE_DISTRIBUTION: "<Your Secure Distribution / CNAME>",
        // NEXT_PUBLIC_CLOUDINARY_PRIVATE_CDN: "true",
        CLOUDINARY_URL: "cloudinary://762153554883525:p4EUJbAwKVU9qKad_DjWrFCqTmY@raviblog",

        AUTH_GOOGLE_ID: '735233162323-08gs3se21le3l3pb0rn8rq1uv57fgg4l.apps.googleusercontent.com',
        AUTH_GOOGLE_SECRET: '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',
        AUTH_AUTH0_ID: 'HcJaMefXTZpxEi5Q8pE3pZQFTtVr7WVr',
        AUTH_AUTH0_SECRET: 'gkuosCn7qCl3GOWW61R3ArtizF_OSqve7M-8El_snSodJWl2M3a7AhzVogfuorj2',
        AUTH_AUTH0_DOMAIN: 'https://raviblog.us.auth0.com',
        STUDIO_URL_PREFIX: 'studio',
        NEXT_PUBLIC_STUDIO_NAME: 'Content Studio',
        NEXT_PUBLIC_STUDIO_PATH: 'studio',
        MODAL_BLUR: 'false',
    },
    experimental: {
        instrumentationHook: true,
    },
    images: {
        loader: 'custom',
        loaderFile: './src/lib/NextImage.jsx',
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
