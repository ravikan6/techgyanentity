'use client';
import React, { useState } from 'react'
import { RouterBackBtn } from '@/components/Buttons'
import { Dialog } from '@/components/rui/_components';
import { DialogContent, LinearProgress, Zoom } from '@mui/material';
import { Suspense } from 'react';
import { MainLogo } from '@/lib/client';

export const progressContext = React.createContext();

const SetupLayout = ({ children }) => {
  const [inProgress, setInProgress] = useState(false);
  const [title, setTitle] = useState('Setup');

  return (
    <Dialog
      open={true}
      sx={{
        backgroundColor: 'transparent',
      }}
      TransitionComponent={Zoom}
      aria-describedby="setup-modal-description"
      aria-labelledby="setup-modal-title"
    >
      <progressContext.Provider value={{ inProgress, setInProgress, setTitle }}>
        <div className='absolute top-0 left-0 w-full' >{inProgress && <LinearProgress color="accent" />}</div>
        <div className={`flex items-center bg-lightHead dark:bg-darkHead h-16 shadow-sm justify-between px-5 py-2`}>
          {/* <MainLogo /> */}
          <h2 id="setup-modal-title" className='text-lg font-bold'>{title}</h2>
          <RouterBackBtn />
        </div>
        <DialogContent className='min-h-96 min-w-96'>
          <Suspense fallback={() => setInProgress(true)}>
            {children}
          </Suspense>
        </DialogContent>
      </progressContext.Provider>
    </Dialog>
  )
}

export default SetupLayout;