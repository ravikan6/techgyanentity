'use client';
import React, { useState } from 'react'
import { RouterBackBtn } from '@/components/Buttons'
import { Dialog } from '@/components/rui/_components';
import { DialogContent, LinearProgress, Zoom } from '@mui/material';
import { Suspense } from 'react';
import { MainLogo } from '@/lib/client';

export const progressContext = React.createContext();

const ModelsLayout = ({ children }) => {
  const [inProgress, setInProgress] = useState(false);

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
      <progressContext.Provider value={{ inProgress, setInProgress }}>
        <div className='absolute top-0 left-0 w-full' >{inProgress && <LinearProgress color="accent" />}</div>
        <div className={`flex items-center bg-lightHead dark:bg-darkHead h-16 shadow-sm justify-between px-5 py-2`}>
          <MainLogo />
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

export default ModelsLayout;