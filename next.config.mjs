/** @type {import('next').NextConfig} */
const nextConfig = {
    env:
    {
        APP_URL: 'https://www.raviblog.tech',
        NEXTAUTH_URL: 'http://localhost:3000',
        NEXTAUTH_SECRET: '3X4b7KUq8vUMo6WzXVOkeJeuqLCanZTnhnyM8cCRL6o=',
        COOKIE_SECRET: 'Fo1cKMrsO3GHyq/fUsGROUoJ3pQMeXe1pEcTYeZBrIOFm7GJSQy2QH0K9UwysE3AjtU3Q0wDN7+ZNeeaYvw98txGPV73tdvaQcMaULJWuxIH3z2avWae2qjdC8GqRUJ28ByBGUq/cMBkJsn4ducJbH4Wq//w+fHD1ATJYrC8x7JBf7Muzl908NpHYALH5iomL07ATxYUIaE4qAWc6UEno5wyFTZKMXk6IvIDBwrI8PEZZNU=',
        NEXT_PUBLIC_COOKIE_SECRET: 'Fo1cKMrsO3GHyq/fUsGROUoJ3pQMeXe1pEcTYeZBrIOFm7GJSQy2QH0K9UwysE3AjtU3Q0wDN7+ZNeeaYvw98txGPV73tdvaQcMaULJWuxIH3z2avWae2qjdC8GqRUJ28ByBGUq/cMBkJsn4ducJbH4Wq//w+fHD1ATJYrC8x7JBf7Muzl908NpHYALH5iomL07ATxYUIaE4qAWc6UEno5wyFTZKMXk6IvIDBwrI8PEZZNU=',
        
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "raviblog",
        NEXT_PUBLIC_CLOUDINARY_API_KEY: "762153554883525",
        CLOUDINARY_API_SECRET: "p4EUJbAwKVU9qKad_DjWrFCqTmY",
        // NEXT_PUBLIC_CLOUDINARY_SECURE_DISTRIBUTION: "<Your Secure Distribution / CNAME>",
        // NEXT_PUBLIC_CLOUDINARY_PRIVATE_CDN: "true",
        CLOUDINARY_URL: "cloudinary://762153554883525:p4EUJbAwKVU9qKad_DjWrFCqTmY@raviblog",
        GOOGLE_CLIENT_ID: '735233162323-08gs3se21le3l3pb0rn8rq1uv57fgg4l.apps.googleusercontent.com',
        GOOGLE_CLIENT_SECRET: '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',
        AUTH0_CLIENT_ID: 'HcJaMefXTZpxEi5Q8pE3pZQFTtVr7WVr',
        AUTH0_CLIENT_SECRET: 'gkuosCn7qCl3GOWW61R3ArtizF_OSqve7M-8El_snSodJWl2M3a7AhzVogfuorj2',
        AUTH0_DOMAIN: 'https://raviblog.us.auth0.com',
        MONGO_URI: 'mongodb://ravikantsaini:Ravi%40saini%23hacker12@8.208.33.217:27017',
    },
    experimental: {
        instrumentationHook: true,
    },
};

export default nextConfig;
