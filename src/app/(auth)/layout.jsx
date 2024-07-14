import '@/styles/globals.css'
import "https://rb-fonts-ravikantsaini047-dc0ad04cad6ed45f64763192ab88a4e9b16cc.gitlab.io/data/v2/css/rb-fonts.css";
import "https://rb-fonts-ravikantsaini047-dc0ad04cad6ed45f64763192ab88a4e9b16cc.gitlab.io/data/v2/css/toastify.css";

import { Providers } from '@/components/providers';
import CssBaseline from '@mui/material/CssBaseline';

export async function generateMetadata() {
    return {
        title: `Secure Auth System - ${process.env.APP_NAME}`,
        description: `A secure authentication system for ${process.env.APP_NAME}`,
    }
};

export default async function RootLayout({ children }) {

    return (
        <html lang='en' suppressHydrationWarning>
            <body className='dark:bg-dark bg-light'>
                <Providers>
                    <CssBaseline />
                    <rb-auth-body-wrapper>
                        {children}
                    </rb-auth-body-wrapper>
                </Providers>
            </body>
        </html>
    )
};