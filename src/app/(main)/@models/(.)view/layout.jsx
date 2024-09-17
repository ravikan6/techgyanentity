'use client';
import React, { useState } from 'react'
import { RouterBackBtn } from '@/components/Buttons'
import { Dialog } from '@/components/rui/_components';
import { DialogContent, LinearProgress, useMediaQuery, Zoom } from '@mui/material';
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { SwipeableDrawer } from '@/components/rui';

export const progressContext = React.createContext();

const SetupLayout = ({ children }) => {
    const [inProgress, setInProgress] = useState(false);
    const router = useRouter();
    let q = useMediaQuery('(max-width:768px)');

    return (
        q ? <SwipeableDrawer
            open={true}
            onClose={
                () => {
                    router.back();
                }
            }
        >
            <progressContext.Provider value={{ inProgress, setInProgress }}>
                <div className='absolute top-0 left-0 w-full' >{inProgress && <LinearProgress color="accent" />}</div>
                <div className='absolute top-1 right-1'>
                    <RouterBackBtn />
                </div>
                <div className='min-h-full w-full pt-10'>
                    <Suspense fallback={() => setInProgress(true)}>
                        {children}
                    </Suspense>
                </div>
            </progressContext.Provider>
        </SwipeableDrawer>
            : <Dialog
                open={true}
                sx={{
                    backgroundColor: 'transparent',
                    borderRadius: '4px',
                    padding: '0px',
                    '& .MuiPaper-root': {
                        borderRadius: '8px',
                    }
                }}
                // TransitionComponent={Zoom}
                aria-describedby="setup-modal-description"
                aria-labelledby="setup-modal-title"
                maxWidth='lg'
                onClose={
                    () => {
                        router.back();
                    }
                }
            >
                <progressContext.Provider value={{ inProgress, setInProgress }}>
                    <div className='absolute top-0 left-0 w-full' >{inProgress && <LinearProgress color="accent" />}</div>
                    <div className='absolute top-1 right-1'>
                        <RouterBackBtn />
                    </div>
                    <div className='min-w-[768px] max-h-[calc(100%-100px)]  min-h-[calc(100%-100px)] '>
                        <Suspense fallback={() => setInProgress(true)}>
                            {children}
                        </Suspense>
                    </div>
                </progressContext.Provider>
            </Dialog>
    )
}

export default SetupLayout;