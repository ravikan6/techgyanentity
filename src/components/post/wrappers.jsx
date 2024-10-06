'use client';
import React, { useState } from 'react'
import { Dialog } from '@/components/rui/_components';
import { LinearProgress, useMediaQuery, Slide } from '@mui/material';
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { SwipeableDrawer } from '@/components/rui';

export const progressContext = React.createContext();

const ViewLayoutWrapper = ({ children }) => {
    const [inProgress, setInProgress] = useState(false);
    const router = useRouter();
    let q = useMediaQuery('(max-width:528px)');

    return (
        q ? <SwipeableDrawer
            open={true}
            showClose={false}
            anchor='bottom'
            addPd={false}
            onClose={
                () => {
                    router.back();
                }
            }
            sx={{
                '& .MuiDrawer-paper': {
                    borderRadius: '8px 8px 0 0',
                    maxHeight: 'calc(100% - 40px)',
                    width: '100%',
                }
            }}
        >
            <progressContext.Provider value={{ inProgress, setInProgress }}>
                <div className='absolute top-0 left-0 w-full' >{inProgress && <LinearProgress color="accent" />}</div>
                <div className='min-h-full w-full'>
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
                TransitionComponent={Slide}
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
                    {/* <div className='absolute -top-4 -right-4 z-[99999]'>
                        <RouterBackBtn />
                    </div> */}
                    <div className='min-w-[calc(100vw-80px)] min-h-[calc(100vh-80px)] min-[850px]:min-w-[768px] min-[850px]:h-[480px] min-[850px]:w-[768px] min-[850px]:min-h-[480px] lg:min-w-[928px] lg:min-h-[580px] lg:w-[928px] lg:h-[580px] '>
                        <Suspense fallback={() => setInProgress(true)}>
                            {children}
                        </Suspense>
                    </div>
                </progressContext.Provider>
            </Dialog>
    )
}

export { ViewLayoutWrapper };