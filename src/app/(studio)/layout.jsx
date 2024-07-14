import '@/styles/globals.css'
import "https://rb-fonts-ravikantsaini047-dc0ad04cad6ed45f64763192ab88a4e9b16cc.gitlab.io/data/v2/css/rb-fonts.css";
import "https://rb-fonts-ravikantsaini047-dc0ad04cad6ed45f64763192ab88a4e9b16cc.gitlab.io/data/v2/css/toastify.css";

import { Providers } from '@/components/providers';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';

export function metadata() {
  return {
    title: `Creator Studio - ${process.env.APP_NAME}`,
    description: 'Creator Studio',
  }
};

export default function StudioLayout({ children, studio_models, models }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className='bg-light text-black !p-0 dark:text-white dark:bg-dark'>
        <Providers>
          <CssBaseline />
          <div className="">
            {children}
            {studio_models}
            {models}
          </div>
        </Providers>
      </body>
    </html>
  )
};