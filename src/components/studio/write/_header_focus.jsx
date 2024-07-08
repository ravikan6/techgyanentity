import React from 'react';
import { NotificationBtn } from '@/components/Buttons';
import { Skeleton } from '@mui/material';
import { auth } from '@/lib/auth';
import { StudioServiceSelecterMenu } from '../_profile';
import { BackToContent, HeaderLoader, UpdateEditorArticle, WriteMenu } from '@/components/studio/write/_client';
import { ManinLogo } from '@/components/header';


/**
 * Renders the focusable header component with logo, navigation, and user profile information.
 * @async
 * @function
 * @param {Object} props - The props object.
 * @returns {JSX.Element} - The JSX element of the header component.
 */
const WriteHeader = async () => {
    const session = await auth();

    return (
        <>
            <header className='w-full fixed z-[999] max-w-full top-0 left-0 '>
                <div className="min-h-[54px] max-h-[54px] relative overflow-hidden bg-light/85 dark:bg-dark/45 backdrop-blur-2xl border-b-slate-200 dark:border-b-slate-700 ">
                    <div id="header" className='px-5 max-w-5xl mx-auto'>
                        <div className='min-h-[54px] max-h-[54px] flex justify-between m-auto'>
                            <div className='flex justify-start space-x-2 md:space-x-10 items-center logo w-3/12'>
                                <ManinLogo />
                                <BackToContent />
                            </div>
                            <div className='flex space-x-3 md:space-x-6 justify-end items-center w-1/2 md:w-3/12'>
                                {session?.user && session?.user?.id ? (
                                    <>
                                        <UpdateEditorArticle />
                                        <WriteMenu />
                                        <StudioServiceSelecterMenu session={session} canSwitchAuthor={false} />
                                    </>
                                ) : (
                                    <Skeleton variant="circular" width={35} height={35} animation='wave' />
                                )}
                            </div>
                        </div>
                    </div>
                    <HeaderLoader />
                </div>
            </header >
        </>
    );
}

export { WriteHeader };