import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NotificationBtn, SgBtn } from '@/components/Buttons';
import { Skeleton } from '@mui/material';
import { NavMenu } from '@/components/Home/_profile-model';
import { auth } from '@/lib/auth';
import { StudioServiceSelecterMenu } from '../_profile';
import { WriteMenu } from './_menu';


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
                <div className="min-h-[54px] max-h-[54px] overflow-hidden bg-light/85 dark:bg-dark/45 backdrop-blur-2xl border-b-slate-200 dark:border-b-slate-700 ">
                    <div id="header" className='px-5 max-w-5xl mx-auto'>
                        <div className='min-h-[54px] max-h-[54px] flex justify-between m-auto'>
                            <div className='flex justify-start items-center logo w-3/12'>
                                <ManinLogo />
                            </div>
                            <div className='flex space-x-3 md:space-x-6 justify-end items-center w-1/2 md:w-3/12'>
                                {session?.user ? (
                                    <>
                                        <div className="">
                                            <NotificationBtn />
                                        </div>
                                        {session?.user?.id ? (
                                            <>
                                                <div>
                                                    <WriteMenu />
                                                </div>
                                                <div className="">
                                                    <StudioServiceSelecterMenu session={session} />
                                                </div>
                                            </>
                                        ) : (
                                            <Skeleton variant="circular" width={35} height={35} animation='wave' />
                                        )}
                                    </>
                                ) :
                                    (
                                        <>
                                            <div className='mr-4'>
                                                <NavMenu />
                                            </div>
                                            <SgBtn />
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </header >
        </>
    );
}

export { WriteHeader };