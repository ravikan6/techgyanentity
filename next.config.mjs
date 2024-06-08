/** @type {import('next').NextConfig} */
const nextConfig = {
    env:
    {
        APP_URL: 'https://www.raviblog.tech',
        NEXTAUTH_URL: 'https://humble-space-xylophone-qjg54vww9j93xqjw-3000.app.github.dev/',
        NEXTAUTH_SECRET: '3X4b7KUq8vUMo6WzXVOkeJeuqLCanZTnhnyM8cCRL6o=',
        COOKIE_SECRET: 'Fo1cKMrsO3GHyq/fUsGROUoJ3pQMeXe1pEcTYeZBrIOFm7GJSQy2QH0K9UwysE3AjtU3Q0wDN7+ZNeeaYvw98txGPV73tdvaQcMaULJWuxIH3z2avWae2qjdC8GqRUJ28ByBGUq/cMBkJsn4ducJbH4Wq//w+fHD1ATJYrC8x7JBf7Muzl908NpHYALH5iomL07ATxYUIaE4qAWc6UEno5wyFTZKMXk6IvIDBwrI8PEZZNU=',
        NEXT_PUBLIC_COOKIE_SECRET: 'Fo1cKMrsO3GHyq/fUsGROUoJ3pQMeXe1pEcTYeZBrIOFm7GJSQy2QH0K9UwysE3AjtU3Q0wDN7+ZNeeaYvw98txGPV73tdvaQcMaULJWuxIH3z2avWae2qjdC8GqRUJ28ByBGUq/cMBkJsn4ducJbH4Wq//w+fHD1ATJYrC8x7JBf7Muzl908NpHYALH5iomL07ATxYUIaE4qAWc6UEno5wyFTZKMXk6IvIDBwrI8PEZZNU=',
        API_TOKEN: '04e7d03de02eb93c144c1b8f4d608d0149a5144e79ee755240dcc43a5e0fe1214de8a6c8c035d82e8235b24c7b33681567ad1f14aee84dadf0be990840935f5b76ee869abf691660f846f4274b44208f17333f38970a796f7e4cb62ddece4174a81345556ce78bb2aa4fa43190eacc16156e1f8e391f1360f11c25e28b1d5fbe',
        API_URL: 'https://server.raviblog.tech', // @deprecated : use API_URL_V2
        API_URL_V2: 'https://platform.raviblog.tech',
        API_TOKEN_V2: 'Hacker 5e6593103def48699acdfc5c28b81a2fa9e63fc41b7c49d4a2627b373a3dddcfd6881a0150ca460ead11dadffc9d02d8',
        MEDIA_URL: 'https://media.raviblog.tech',
        GOOGLE_CLIENT_ID: '735233162323-08gs3se21le3l3pb0rn8rq1uv57fgg4l.apps.googleusercontent.com',
        GOOGLE_CLIENT_SECRET: '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',
        AUTH0_CLIENT_ID: 'HcJaMefXTZpxEi5Q8pE3pZQFTtVr7WVr',
        AUTH0_CLIENT_SECRET: 'gkuosCn7qCl3GOWW61R3ArtizF_OSqve7M-8El_snSodJWl2M3a7AhzVogfuorj2',
        AUTH0_DOMAIN: 'https://raviblog.us.auth0.com',
    }
};

export default nextConfig;
