import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CreateBtn, DrawerBtn, NotificationBtn, SgBtn } from '@/components/Buttons';
import { SearchBar } from "./Home/head";
// import { get_SECTION_logo } from '@/lib/fetchers';
import { Skeleton } from '@mui/material';
import { NavMenu, UserProfileModel } from './Home/_profile-model';
import { auth } from '@/lib/auth';
import { StudioServiceSelecterMenu } from './studio/_profile';

const ManinLogo = async ({ className }) => {
    // const data = await get_SECTION_logo();
    // const sectionData = data?.data?.uiBrand;

    return (
        <Link className={`${className} font-extrabold cheltenham-small min-w-32 capitalize italic text-accent dark:text-secondaryDark line-clamp-1`} href={'/'}>
            <span className="fill-accentLight dark:fill-accentDark/60 hidden" />
            <span className="fill-black dark:fill-gray-100 hidden" />
            Techgyan Entity
            {/* {(!sectionData?.logoSvg) ? (
                sectionData?.brandLogo && <Image
                    alt={sectionData?.title}
                    src={process.env.MEDIA_URL_V2 + sectionData?.brandLogo}
                    width={120}
                    height={40}
                />
            ) : (
                <div dangerouslySetInnerHTML={{ __html: sectionData?.logoSvg }}></div>
            )} */}
        </Link>
    )
}

/**
 * Renders the header component with logo, navigation, search bar, and user profile information.
 * @async
 * @function
 * @param {Object} props - The props object.
 * @returns {JSX.Element} - The JSX element of the header component.
 */
const Header = async () => {
    const session = await auth();

    return (
        <>
            <header className='w-full fixed z-[999] max-w-full top-0 left-0 '>
                <div className="min-h-[54px] max-h-[54px] overflow-hidden bg-light/85 dark:bg-dark/45 backdrop-blur-2xl border-b-slate-200 dark:border-b-slate-700 ">
                    <div id="header" className='px-3 sm:px-5'>
                        <div className='min-h-[54px] max-h-[54px] flex justify-between m-auto'>
                            <div className='flex justify-start items-center logo w-3/12'>
                                <DrawerBtn />
                                <ManinLogo className='ml-4' />
                            </div>
                            <div className='justify-center hidden md:flex items-center w-3/12'>
                                <SearchBar />
                            </div>
                            <div className='flex space-x-3 md:space-x-6 justify-end items-center w-1/2 md:w-3/12'>
                                {!session?.user ? (
                                    <>
                                        <div className='mr-4'>
                                            <NavMenu />
                                        </div>
                                        <SgBtn />
                                    </>
                                ) : (
                                    session?.user?.id ? (
                                        <>
                                            <div className="">
                                                <CreateBtn classes={'bg-accent dark:bg-accentDarker'} iconColor='#fff' />
                                            </div>
                                            <div className="">
                                                <NotificationBtn classes={'border border-solid border-secondary dark:border-secondaryDark'} />
                                            </div>
                                            <div className="">
                                                {(session?.user?.creators?.length > 0) ? (<StudioServiceSelecterMenu session={session} />) : (<UserProfileModel user={{ user: session?.user }} />)}
                                            </div>
                                        </>
                                    ) : (
                                        <Skeleton variant="circular" width={35} height={35} animation='wave' />
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header >
        </>
    );
}

export const VariantPersistent = () => {
    return (
        <>
            <style id='r_tt' >{`
                .rb_tt {
                    display: none !important;
                }
             `}</style>
            <div id="_drawer#"></div>
        </>
    )
}

export { Header, ManinLogo, ManinLogo as MainLogo };