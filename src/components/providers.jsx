'use client'
import { CssVarsProvider, getInitColorSchemeScript } from '@mui/material/styles';
import { ThemeProvider as NextTheme } from 'next-themes'
import { SessionProvider } from "next-auth/react"
// import { ToastContainer } from 'react-toastify';
// import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import CssBaseline from '@mui/material/CssBaseline';
import mui from '@/styles/mui';

export function Providers({ session, children }) {

  const color = 'var(--rb-palette-accent-main)';
  const height = '1.7px';
  //   const styles = `
  //   #nprogress {
  //     pointer-events: none;
  //   }

  //   #nprogress .bar {
  //     background: ${color};
  //     position: fixed;
  //     z-index: 1031;
  //     top: 0;
  //     left: 0;
  //     width: 100%;
  //     height: ${height};
  //   }

  //   /* Fancy blur effect */
  //   #nprogress .peg {
  //     display: block;
  //     position: absolute;
  //     right: 0px;
  //     width: 100px;
  //     height: 100%;
  //     box-shadow: 0 0 10px ${color}, 0 0 5px ${color};
  //     opacity: 1.0;
  //     -webkit-transform: rotate(3deg) translate(0px, -4px);
  //     -ms-transform: rotate(3deg) translate(0px, -4px);
  //     transform: rotate(3deg) translate(0px, -4px);
  //   }

  //   /* Remove these to get rid of the spinner */
  //   #nprogress .spinner {
  //     display: block;
  //     position: fixed;
  //     z-index: 1031;
  //     top: 15px;
  //     right: 15px;
  //   }

  //   #nprogress .spinner-icon {
  //     width: 18px;
  //     height: 18px;
  //     box-sizing: border-box;
  //     border: solid 2px transparent;
  //     border-top-color: ${color};
  //     border-left-color: ${color};
  //     border-radius: 50%;
  //     -webkit-animation: nprogress-spinner 400ms linear infinite;
  //     animation: nprogress-spinner 400ms linear infinite;
  //   }

  //   .nprogress-custom-parent {
  //     overflow: hidden;
  //     position: relative;
  //   }

  //   .nprogress-custom-parent #nprogress .spinner,
  //   .nprogress-custom-parent #nprogress .bar {
  //     position: absolute;
  //   }

  //   @-webkit-keyframes nprogress-spinner {
  //     0%   { -webkit-transform: rotate(0deg); }
  //     100% { -webkit-transform: rotate(360deg); }
  //   }

  //   @keyframes nprogress-spinner {
  //     0%   { transform: rotate(0deg); }
  //     100% { transform: rotate(360deg); }
  //   }
  // `;

  return (
    <SessionProvider session={session}>
      <CssVarsProvider disableTransitionOnChange theme={mui} defaultMode='system'>
        {getInitColorSchemeScript({
          defaultMode: 'system'
        })}
        <CssBaseline />
        <NextTheme disableTransitionOnChange attribute="class">
          {children}
          {/* <ProgressBar style={styles} options={{ showSpinner: false }} /> */}
          {/* <ToastContainer toastClassName={'rb_toast'} icon={false} limit={2} position='bottom-left' draggable autoClose={4000} /> */}
        </NextTheme>
      </CssVarsProvider>
    </SessionProvider>
  );
}
