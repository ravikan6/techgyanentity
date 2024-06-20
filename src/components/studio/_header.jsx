import { CreateBtn, DrawerBtn, NotificationBtn, SgBtn } from '@/components/Buttons';
import { Skeleton } from '@mui/material';
import { NavMenu } from '@/components/Home/_profile-model';
import { BiSearchAlt } from 'react-icons/bi';
import { StudioServiceSelecterMenu } from './_profile';

import { auth } from '@/lib/auth';
import { MainLogo } from '../header';

export const SearchBar = () => {
    return (
        <div className="relative flex items-center">
            <input
                type="text"
                className="md:w-[350px] w-5 border rounded-full border-accentLight dark:border-accentDark bg-light dark:bg-dark h-9 px-5 pr-16 text-sm focus:outline-none"
                placeholder="Search from your studio..."
            />
            <button type="submit" className="absolute right-0 top-0 mt-1 mr-4">
                <BiSearchAlt className="text-gray-600 h-4 w-4 fill-current" />
            </button>
        </div>
    );
};

/**
 * Renders the header component with logo, navigation, search bar, and user profile information.
 * @async
 * @function
 * @param {Object} props - The props object.
 * @returns {JSX.Element} - The JSX element of the header component.
 */
const StudioHeader = async () => {
    const session = await auth();;

    return (
        <>
            <header className='w-full dark:bg-darkHead bg-lightHead fixed z-[999] max-w-full top-0 left-0 px-5'>
                <div className="min-h-[54px] max-h-[54px] overflow-hidden">
                    <div id="header" className='w-full bg-opacity-0 backdrop-blur-3xl border-b-slate-200 dark:border-b-slate-700 '>
                        <div className='min-h-[54px] max-h-[54px] flex justify-between m-auto'>
                            <div className='flex justify-start items-center logo'>
                                <DrawerBtn />
                                <p className="fill-accentLight dark:fill-accentDark/60 hidden"></p>
                                <p className="fill-black dark:fill-gray-100 hidden"></p>
                                <MainLogo className={'ml-4'} />
                            </div>
                            <div className='justify-center hidden md:flex items-center'>
                                <SearchBar />
                            </div>
                            <div className='flex space-x-2 md:space-x-6 justify-end items-center'>
                                {session?.user ? (
                                    <>
                                        <div className="">
                                            <CreateBtn />
                                        </div>
                                        <div className="">
                                            <NotificationBtn />
                                        </div>
                                        {session?.user?.id ? (
                                            <>
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

export { StudioHeader };