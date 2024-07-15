import '@/styles/globals.css'
import { Providers } from '@/components/providers';
import CssBaseline from '@mui/material/CssBaseline';
import { auth } from '@/lib/auth';
import MainLayout from '@/components/mainlayout';
import { Header } from '@/components/header';
import { AuthorProvider } from '@/components/studio/wrappers';
import { DecryptAuthorStudioCookie } from '@/lib/actions/studio';

export async function generateMetadata() {
  return {
    title: {
      template: `%s | ${process.env.APP_NAME}`,
      default: process.env.APP_NAME,
    },
    description: 'RadoxStream is a streaming platform for the RadoxRadio community.',
  }
};

export default async function RootLayout({ children, models }) {
  const session = await auth();
  let authorData = null;

  console.log(session, 'session');

  if (session && session.user) {
    authorData = await DecryptAuthorStudioCookie();
  }

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
          <AuthorProvider session={session} authorData={authorData}>
            <MainLayout session={session} >
              <Header lang='en' />
              <main className="mt-[54px]">
                {children}
              </main>
              {models}
            </MainLayout>
          </AuthorProvider>
        </Providers>
      </body>
    </html>
  )
};
