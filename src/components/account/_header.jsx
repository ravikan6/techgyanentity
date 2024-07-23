import React from 'react';
import { Skeleton } from '@mui/material';
import { auth } from '@/lib/auth';
import { ManinLogo } from '../header';
import { SearchBar } from '../Home/head';
import { UserProfileModel } from '../Home/_profile-model';

const AccountHeader = async () => {
    const session = await auth();

    return (
        <>
            <header className='w-full fixed z-[999] max-w-full top-0 left-0 '>
                <div className="min-h-[54px] max-h-[54px] overflow-hidden bg-light/85 dark:bg-dark/45 backdrop-blur-2xl border-b-slate-200 dark:border-b-slate-700 ">
                    <div id="header" className='px-5'>
                        <div className='min-h-[54px] max-h-[54px] flex justify-between m-auto'>
                            <div className='flex justify-start items-center logo w-3/12'>
                                <ManinLogo className='ml-4' />
                            </div>
                            <div className='justify-center hidden md:flex items-center w-3/12'>
                                <SearchBar />
                            </div>
                            <div className='flex space-x-3 md:space-x-6 justify-end items-center w-1/2 md:w-3/12'>
                                {session?.user ? (
                                    <>
                                        <div className="">
                                            {<UserProfileModel user={{ user: session?.user }} />}
                                        </div>
                                    </>
                                ) : (
                                    <Skeleton variant="circular" width={35} height={35} animation='wave' />
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

export default AccountHeader;