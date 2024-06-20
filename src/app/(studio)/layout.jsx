import '@/styles/globals.css'
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