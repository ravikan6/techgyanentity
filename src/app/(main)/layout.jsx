import '@/styles/globals.css'
import { Providers } from '@/components/providers';
import CssBaseline from '@mui/material/CssBaseline';
import { auth } from '@/lib/auth';
// import MainLayout from '@/components/mainlayout';
// import { Header } from '@/components/Header';

export async function generateMetadata() {
  return {
    title: process.env.APP_NAME,
    description: 'RadoxStream is a streaming platform for the RadoxRadio community.',
  }
};

export default async function RootLayout({ children, models }) {
  const session = await auth();

  console.log('RootLayout', session);
  return (
    <html lang='en' suppressHydrationWarning>
      <body className=' bg-white text-black !p-0 dark:text-white dark:bg-dark'>
        <Providers>
          <CssBaseline enableColorScheme />
          {/* <MainLayout session={session} >
            <Header lang='en' /> */}
          <main className="mt-[54px]">
            {children}
          </main>
          {/* {models} */}
          {/* </MainLayout> */}
        </Providers>
      </body>
    </html>
  )
};
