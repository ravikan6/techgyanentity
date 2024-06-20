'use client';
import React, { useState } from 'react'
import { RouterBackBtn } from '@/components/Buttons'
import { Dialog } from '@/components/rui/_components';
import { DialogContent, LinearProgress, Zoom } from '@mui/material';
import { Suspense } from 'react';
import { MainLogo } from '@/lib/client';

export const progressContext = React.createContext();

const StudioModelLayout = ({ children }) => {
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
            fullWidth
            maxWidth='md'
            scroll='paper'
            maxHeight='90vh'
            className='!min-h-[90vh]'
        >
            <progressContext.Provider value={{ inProgress, setInProgress }}>
                <div className='absolute top-0 left-0 w-full' >{inProgress && <LinearProgress color="accent" />}</div>
                <div className={`flex items-center bg-bgSP dark:bg-darkHead h-16 shadow-sm justify-between px-5 py-2`}>
                    <MainLogo />
                    <RouterBackBtn />
                </div>
                <DialogContent className='lg:min-h-[calc(100vh-(10vh+64px))] max-h-[calc(100vh-(10vh+64px))] overflow-y-auto'>
                    <Suspense fallback={() => setInProgress(true)}>
                        {children}
                    </Suspense>
                </DialogContent>
            </progressContext.Provider>
        </Dialog>
    )
}

export default StudioModelLayout;