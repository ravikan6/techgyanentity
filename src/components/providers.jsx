'use client'
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { ThemeProvider as NextTheme } from 'next-themes'
import { SessionProvider } from "next-auth/react"
import { ToastContainer, Zoom } from 'react-toastify';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import CssBaseline from '@mui/material/CssBaseline';
import mui from '@/styles/mui';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import { ThemeProvider } from '@mui/material';
import {
  ApolloLink,
  HttpLink,
} from "@apollo/client";
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support";

function makeClient() {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || "https://techgyan.collegejaankaar.in/api/",
    credentials: 'include', // Ensure credentials are included
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
          new SSRMultipartLink({
            stripDefer: true,
          }),
          httpLink,
        ])
        : httpLink,
  });
}

export const Providers = ({ session, children }) => {

  const color = 'var(--rb-palette-button-main)';
  const height = '1.7px';
  const styles = `
    #nprogress {
      pointer-events: none;
    }

    #nprogress .bar {
      background: ${color};
      position: fixed;
      z-index: 1031;
      top: 0;
      left: 0;
      width: 100%;
      height: ${height};
    }

    /* Fancy blur effect */
    #nprogress .peg {
      display: block;
      position: absolute;
      right: 0px;
      width: 100px;
      height: 100%;
      box-shadow: 0 0 10px ${color}, 0 0 5px ${color};
      opacity: 1.0;
      -webkit-transform: rotate(3deg) translate(0px, -4px);
      -ms-transform: rotate(3deg) translate(0px, -4px);
      transform: rotate(3deg) translate(0px, -4px);
    }

    /* Remove these to get rid of the spinner */
    #nprogress .spinner {
      display: block;
      position: fixed;
      z-index: 1031;
      top: 15px;
      right: 15px;
    }

    #nprogress .spinner-icon {
      width: 18px;
      height: 18px;
      box-sizing: border-box;
      border: solid 2px transparent;
      border-top-color: ${color};
      border-left-color: ${color};
      border-radius: 50%;
      -webkit-animation: nprogress-spinner 400ms linear infinite;
      animation: nprogress-spinner 400ms linear infinite;
    }

    .nprogress-custom-parent {
      overflow: hidden;
      position: relative;
    }

    .nprogress-custom-parent #nprogress .spinner,
    .nprogress-custom-parent #nprogress .bar {
      position: absolute;
    }

    @-webkit-keyframes nprogress-spinner {
      0%   { -webkit-transform: rotate(0deg); }
      100% { -webkit-transform: rotate(360deg); }
    }

    @keyframes nprogress-spinner {
      0%   { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <ThemeProvider disableTransitionOnChange theme={mui} defaultMode='system'>
      <InitColorSchemeScript defaultMode='system' attribute="class" />
      <CssBaseline />
      {/* <AppRouterCacheProvider options={{ enableCssLayer: true, key: 'rb' }} > */}
      <NextTheme disableTransitionOnChange attribute="class">
        <ApolloNextAppProvider makeClient={makeClient} >
          <SessionProvider refetchWhenOffline={false} session={session}>
            {children}
            <ProgressBar style={styles} options={{ showSpinner: false, disableSameURL: true, memo: true }} />
            <ToastContainer stacked toastClassName={'rb_toast'} icon={false} limit={10} position='bottom-center' draggable autoClose={4000} hideProgressBar transition={Zoom} />
          </SessionProvider>
        </ApolloNextAppProvider>
      </NextTheme>
      {/* </AppRouterCacheProvider> */}
    </ThemeProvider>
  );
}
