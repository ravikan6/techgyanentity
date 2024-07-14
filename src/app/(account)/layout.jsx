import '@/styles/globals.css'
import { Providers } from '@/components/providers';
import CssBaseline from '@mui/material/CssBaseline';
import { auth } from '@/lib/auth';
import MainLayout from '@/components/mainlayout';
import { Header } from '@/components/header';

export async function generateMetadata() {
    return {
        title: {
            template: `%s | ${process.env.APP_NAME}`,
            default: `${process.env.APP_NAME} Account`,
        },
        description: 'Here you can manage your account settings and preferences. You can also view your subscription status and billing information.',
    }
};

export default async function RootLayout({ children, models }) {
    const session = await auth();

    return (
        <html lang='en' suppressHydrationWarning>
            <head>
                <link
                    rel="prefetch"
                    href="https://rb-fonts-ravikantsaini047-dc0ad04cad6ed45f64763192ab88a4e9b16cc.gitlab.io/data/v2/css/rb-fonts.css"
                    as="style"
                />
                <link
                    rel="prefetch"
                    href="https://rb-fonts-ravikantsaini047-dc0ad04cad6ed45f64763192ab88a4e9b16cc.gitlab.io/data/v2/css/toastify.css"
                    as="style"
                />
                <link
                    rel="stylesheet"
                    href="https://rb-fonts-ravikantsaini047-dc0ad04cad6ed45f64763192ab88a4e9b16cc.gitlab.io/data/v2/css/rb-fonts.css"
                />
                <link
                    rel="stylesheet"
                    href="https://rb-fonts-ravikantsaini047-dc0ad04cad6ed45f64763192ab88a4e9b16cc.gitlab.io/data/v2/css/toastify.css"
                />
            </head>
            <body className='bg-light text-black !p-0 dark:text-white dark:bg-dark'>
                <Providers>
                    <CssBaseline enableColorScheme />
                    <Header lang='en' />
                    <main className="mt-[54px] p-5 mx-auto max-w-4xl">
                        {children}
                    </main>
                    {/* {models} */}
                </Providers>
            </body>
        </html>
    )
};
