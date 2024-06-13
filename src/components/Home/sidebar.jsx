'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, Skeleton } from '@mui/material';
import { usePathname } from 'next/navigation';
import { LuUserSquare2 } from 'react-icons/lu';
import React, { Suspense, useEffect, useState, memo, useMemo } from 'react';
import { GoHome, GoHomeFill } from 'react-icons/go';
import { HiOutlineUsers, HiUsers } from 'react-icons/hi';
import { BiChevronDown, BiChevronUp, BiSolidUserCircle, BiSolidUserRectangle } from 'react-icons/bi';
import { AiFillRead, AiOutlineLike, AiOutlineRead, AiTwotoneLike } from 'react-icons/ai';
import { MdDashboardCustomize, MdHistory, MdOutlineDashboardCustomize, MdOutlineHistory, MdOutlineSubscriptions, MdOutlineWhatshot, MdSubscriptions, MdWhatshot } from 'react-icons/md';
import { PiGameController, PiGameControllerFill } from 'react-icons/pi';
import { CiGlobe } from 'react-icons/ci';
import { FaGlobe } from 'react-icons/fa';
// import { get_USER_DATA } from '@/lib/fetchers';
import { Button, Tooltip } from '@/components/rui/_components';

const userMenu = [
    {
        name: 'Content studio',
        icon: MdOutlineDashboardCustomize,
        icon2: MdDashboardCustomize,
        link: '/studio'
    },
    {
        name: 'History',
        icon: MdOutlineHistory,
        icon2: MdHistory,
        link: '/history'
    },
    {
        name: 'Read later',
        icon: AiOutlineRead,
        icon2: AiFillRead,
        link: '/read-later'
    },
    {
        name: 'Liked content',
        icon: AiOutlineLike,
        icon2: AiTwotoneLike,
        link: '/list?list=liked'
    }
];

const staticMenu = [
    {
        name: 'Home',
        icon: GoHome,
        icon2: GoHomeFill,
        link: '/'
    },
    {
        name: 'Community',
        icon: HiOutlineUsers,
        icon2: HiUsers,
        link: '/r'
    },
    {
        name: 'Subscriptions',
        icon: MdOutlineSubscriptions,
        icon2: MdSubscriptions,
        link: '/subscriptions'
    },
];

const discoverMenu = [
    {
        name: 'Trending',
        icon: MdOutlineWhatshot,
        icon2: MdWhatshot,
        link: '/trending'
    },
    {
        name: 'Gaming',
        icon: PiGameController,
        icon2: PiGameControllerFill,
        link: '/gaming'
    },
    {
        name: 'Technology',
        icon: CiGlobe,
        icon2: FaGlobe,
        link: '/technology'
    },
    {
        name: 'Entertainment',
        icon: GoHome,
        icon2: GoHomeFill,
        link: '/entertainment'
    },
    {
        name: 'Sports',
        icon: HiOutlineUsers,
        icon2: HiUsers,
        link: '/sports'
    },
    {
        name: 'Music',
        icon: MdOutlineSubscriptions,
        icon2: MdSubscriptions,
        link: '/music'
    },
];

const MainSidebar = (props) => {
    const path = usePathname();
    const session = props?.session;
    const isSmall = props?.variant === 'permanent' && !props?.open;
    const [userData, setUserData] = useState(null);
    const [channelData, setchannelData] = useState(null);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        // if (session && session?.user?.id) {
        //     const fetchUserData = async () => {
        //         const data = await get_USER_DATA(session?.user?.username);
        //         if (data && data?.data?.UserData?.edges[0]?.node) setUserData(data?.data?.UserData?.edges[0]?.node);
        //     }
        //     fetchUserData();
        // }
    }, [session]);

    const UserChannels = () => {
        const isPathMatching2 = false;
        const Channels = userData?.channels?.edges;
        const [showMore, setShowMore] = useState(false);

        return (
            <>
                <rb-channel-menu class='block w-full'>
                    <div className='mb-3 w-full cheltenham text-sm'>
                        <h3 className='truncate text-gray-800 dark:text-gray-100 '>Your Channels</h3>
                    </div>
                    <rb-channel-list class='block mb-2 relative w-full rounded-xl py-2 bg-lightHead dark:bg-darkHead'>
                        {Channels ?
                            <>
                                {Channels?.length > 0 ? <div className="relative w-full">
                                    <div >
                                        {Channels.map((item, index) => {
                                            return (
                                                <div key={index} className="flex items-center">
                                                    <div className={`flex items-center ${isSmall ? 'justify-center' : 'w-full'}`}>
                                                        <Tooltip title={item?.node?.name} placement="right" slotProps={{
                                                            popper: {
                                                                modifiers: [
                                                                    {
                                                                        name: 'offset',
                                                                        options: {
                                                                            offset: [0, 20],
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        }}>
                                                            <Link href={`/${process.env.CHANNEL_URL_PREFIX}/@${item?.node?.handle}`} className={`h-10 backdrop-blur-xl transition-colors w-full ${isPathMatching2 ? 'bg-accentLight/20 dark:bg-accentDark/20' : 'bg-transparent'}`}>
                                                                <Button sx={{ borderRadius: 0 }} className={`${isSmall ? '' : ''}`} fullWidth={!isSmall} >
                                                                    <div className={`flex py-0.5 ${isSmall ? '' : 'px-2'} w-full space-x-7 items-center`}>
                                                                        <Avatar width={20} height={20} className="h-5 w-5 rounded-full uppercase text-xs overflow-hidden" src={item?.node?.logo + '/?rounded=true'} alt={item?.node?.name} ></Avatar>
                                                                        {!isSmall && <span className="text-base dark:text-gray-100 text-gray-800 font-semibold">{item?.node?.name}</span>}
                                                                    </div>
                                                                </Button>
                                                            </Link>
                                                        </Tooltip>
                                                    </div>
                                                </div>)
                                        })}
                                    </div>
                                </div> : <>
                                    <div className='px-3 my-2 text-slate-600 dark:text-gray-300 text-xs text-center'>
                                        You haven't created any channels yet.
                                        <Link href={`/setup/channel`} className='text-accent dark:text-accentDark underline'>Create a channel</Link>

                                    </div>
                                </>}
                            </>
                            : <>
                                {MenuSkeleton(5)}
                            </>}

                        {Channels?.length > 5 && <>
                            <div className='h-4'>
                                <div onClick={() => setShowMore(!showMore)} className={` transition-all left-1/2 -translate-x-1/2 absolute -bottom-3 rounded-full bg-slate-200 dark:bg-zinc-800`}>
                                    <Button sx={{ borderRadius: 100 }} >
                                        <div className="flex px-2 w-full space-x-1 items-center">
                                            {showMore ? <BiChevronUp className="w-3 text-black dark:text-white h-3" /> : <BiChevronDown className="w-3 dark:text-gray-200 text-gray-700 h-3" />}
                                            <span className="text-xs dark:text-gray-100 text-gray-800 truncate">{showMore ? 'Show less' : 'Show More'}</span>
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </>}
                    </rb-channel-list>
                </rb-channel-menu>
            </>
        );
    }

    const UserCommunities = () => {
        const isPathMatching2 = path === '/feed/you';
        const Communities = userData?.communities?.edges;
        const [showMore, setShowMore] = useState(false);

        return (
            <>
                <rb-community-menu class='block w-full'>
                    <div className='mb-3 w-full cheltenham text-sm'>
                        <h3 className='truncate text-gray-800 dark:text-gray-100 '>Your Communities</h3>
                    </div>
                    <rb-community-list class='block relative mb-2 w-full rounded-lg py-2 bg-lightHead dark:bg-darkHead'>
                        {Communities ?
                            <> {Communities?.length > 0 ? <div className="relative w-full">
                                {Communities.map((item, index) => {
                                    return (
                                        <div key={index} className="flex w-full items-center">
                                            <div className="flex w-full items-center">
                                                <Tooltip title={item?.node?.name} placement="right" arrow slotProps={{
                                                    popper: {
                                                        modifiers: [
                                                            {
                                                                name: 'offset',
                                                                options: {
                                                                    offset: [0, 20],
                                                                },
                                                            },
                                                        ],
                                                    },
                                                }}>
                                                    <Link href={`/${process.env.COMMUNITY_URL_PREFIX}/${item?.node?.handle}`} className={`h-10 backdrop-blur-xl transition-colors w-full ${isPathMatching2 ? 'bg-accentLight/20 dark:bg-accentDark/20' : 'bg-transparent'}`}>
                                                        <Button sx={{ borderRadius: 0 }} fullWidth >
                                                            <div className="flex py-0.5 px-2 w-full space-x-7 items-center">
                                                                <Avatar width={20} height={20} className="h-5 w-5 rounded-full text-xs overflow-hidden" src={item?.node?.avatar + '/?rounded=true'} alt={item?.node?.name} />
                                                                <span className="text-base dark:text-gray-100 text-gray-800 font-semibold line-clamp-1 truncate">{item?.node?.name}</span>
                                                            </div>
                                                        </Button>
                                                    </Link>
                                                </Tooltip>
                                            </div>
                                        </div>)
                                })}
                            </div> :
                                <>
                                    <div className='px-3 my-2 text-slate-600 dark:text-gray-300 text-xs text-center'>
                                        You haven't created any communities yet.
                                        <Link href={`/setup/community`} className='text-accent dark:text-accentDark underline'>Create a Community</Link>
                                    </div>
                                </>
                            } </> : <> {MenuSkeleton(5)} </>
                        }

                        {Communities?.length > 5 && <>
                            <div className='h-4'>
                                <div onClick={() => setShowMore(!showMore)} className={` transition-all left-1/2 -translate-x-1/2 absolute -bottom-3 rounded-full bg-slate-200 dark:bg-zinc-800`}>
                                    <Button sx={{ borderRadius: 100 }} >
                                        <div className="flex px-2 w-full space-x-1 items-center">
                                            {showMore ? <BiChevronUp className="w-3 text-black dark:text-white h-3" /> : <BiChevronDown className="w-3 dark:text-gray-200 text-gray-700 h-3" />}
                                            <span className="text-xs dark:text-gray-100 text-gray-800 truncate">{showMore ? 'Show less' : 'Show More'}</span>
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </>}
                    </rb-community-list>
                </rb-community-menu>
            </>
        );
    }

    const UserMenu = () => {
        return (
            <>
                <div className="flex w-full items-center">
                    {session?.user ? <Link href={userData ? `/@${session?.user?.username}` : '#'} className={MenuBtnStyle(`/@${session?.user?.username}`)}>
                        <Button fullWidth >
                            <div className="flex py-0.5 px-2 w-full justify-start space-x-7 items-center">
                                <>{session?.user?.picture ? <Image className='rounded' src={`${session?.user?.picture}`} alt={session?.user?.username} width={20} height={20} /> : false ? <BiSolidUserRectangle className="w-5 text-black dark:text-white h-5" /> : <LuUserSquare2 className="w-5 dark:text-gray-200 text-gray-700 h-5" />}
                                    <span className="text-base line-clamp-1 truncate dark:text-gray-100 text-gray-800 font-semibold">@{session?.user?.username}</span></>
                            </div>
                        </Button>
                    </Link> : <>{MenuSkeleton(1)}</>}
                </div>
                <div className="w-full transition-all h-auto duration-500">
                    {userMenu.slice(0, showMore ? userMenu.length : 3).map((menu, index) => (
                        <MenuItem key={index} menu={menu} path={path} isSmall={isSmall} />
                    ))}
                </div>
                <div onClick={() => setTimeout(() => setShowMore(!showMore), 200)} className={`mb-0.5 h-10 max-w-[204px] transition-all duration-500 w-full rounded-xl bg-transparent`}>
                    <Button fullWidth >
                        <div className="flex py-0.5 px-2 w-full space-x-7 items-center">
                            {showMore ? <BiChevronUp className="w-5 text-black dark:text-white h-5" /> : <BiChevronDown className="w-5 dark:text-gray-200 text-gray-700 h-5" />}
                            <span className="text-base dark:text-gray-100 text-gray-800 font-semibold truncate">{showMore ? 'Show less' : 'Show more'}</span>
                        </div>
                    </Button>
                </div>
            </>
        );
    }

    const SubscriptionMenu = () => {
        const [showMore, setShowMore] = useState(false);
        let FirstFollowings = [];
        if (channelData && channelData.followings && channelData.followings.data) {
            FirstFollowings = channelData.followings.data.slice(0, 8);
        }
        return (
            <>
                <div className='mb-2 karnak font-semibold tracking-[1px]'>
                    <div className='truncate'>Subscriptions</div>
                </div>
                {FirstFollowings.map((item, index) => (
                    <div key={index} className="flex w-full items-center">
                        <Link href={`/@${item?.handle}`} className={`h-10 rounded-t-xl  backdrop-blur-2xl transition-colors w-full `}>
                            <Button fullWidth >
                                <div className="flex py-0.5 px-2 w-full space-x-7 items-center">
                                    <Image width={20} height={20} className="h-5 w-5 rounded-md" src={item.logo?.url} alt="user" />
                                    <span className="text-base dark:text-gray-100 text-gray-800 font-semibold">{item?.name}</span>
                                </div>
                            </Button>
                        </Link>
                    </div>
                ))
                }
                <span className='w-full border-slate-300 dark:border-zinc-700 border-b my-2 h-0.5' ></span>
            </>
        )

    };

    const NavBorder = () => {
        return (
            <span className='w-full border-slate-300 dark:border-zinc-700 border-b my-2 h-0.5' ></span>
        )
    }

    const MenuBtnStyle = (link) => {
        return `mb-0.5 h-10 max-w-[204px] transition-colors w-full ${(path === link) ? 'bg-lightButton dark:bg-darkButton rounded-full' : ''}`
    }

    return (
        <>
            <div className='w-full'>
                <div className="flex flex-col p-3 items-start">
                    {staticMenu.map((menu, index) => (
                        <MenuItem key={index} menu={menu} path={path} isSmall={isSmall} />
                    ))}
                    <NavBorder />
                    {(!session && !session?.user?.id) &&
                        <>
                            <Suspense fallback={<div>Loading...</div>}>
                                <NonLoggedBox path={path} />
                            </Suspense>
                        </>
                    }
                    {(session && session?.user?.id) &&
                        <>
                            <UserMenu />
                            <NavBorder />
                            <UserChannels />
                            <span className='w-full border-slate-200 dark:border-zinc-800 border-b my-2 h-0.5' ></span>
                            <UserCommunities />
                            <NavBorder />
                        </>
                    }
                    {/* <SubscriptionMenu /> */}
                    <div className='w-full mb-10'>
                        <div className='mb-2 karnak font-semibold tracking-[1px]'>
                            <span className='truncate'>Explore</span>
                        </div>
                        <div className='w-full'>
                            {discoverMenu.map((menu, index) => (
                                <MenuItem key={index} menu={menu} path={path} isSmall={isSmall} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const MenuItem = ({ menu, path, isSmall }) => {
    const MenuBtnStyle = (link) => {
        return `mb-0.5 h-10 max-w-[204px] transition-all w-full ${(path === link) ? 'bg-lightButton dark:bg-darkButton rounded-full' : ''}`
    }

    return (
        <div className={MenuBtnStyle(menu.link)} >
            <Tooltip title={menu.name} placement="right" slotProps={{
                popper: {
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 20],
                            },
                        },
                    ],
                },
            }}>
                <Link href={menu.link} >
                    <Button fullWidth={isSmall ? false : true} >
                        <div className="flex py-0.5 px-2 w-full space-x-7 items-center">
                            {(path === menu.link) ? <menu.icon2 className="w-5 dark:text-white text-black h-5 min-w-5 min-h-5" /> : <menu.icon className="w-5 dark:text-gray-200 text-gray-700 h-5 min-w-5 min-h-5" />}
                            <span className={`text-base ${isSmall && 'w-0'} dark:text-gray-100 text-gray-800 font-semibold truncate`}>{menu.name}</span>
                        </div>
                    </Button>
                </Link>
            </Tooltip>
        </div>
    )
};

const SmallSidebar = (props) => {
    const path = usePathname();
    const session = props.session;

    return (
        <div className="flex flex-col justify-center items-center">
            {staticMenu.map((menu, index) => (
                <div key={index} className={`flex flex-col overflow-hidden justify-center items-center !rounded-lg transition-colors w-16 ${(path === menu.link) ? 'bg-lightButton dark:bg-darkButton' : ''}`}>
                    <Button className='!p-0 !rounded-lg !w-16'>
                        <Link href={menu.link} className="px-1 py-4 flex w-10 flex-col justify-center items-center">
                            {(path === menu.link) ? <menu.icon2 className="w-5 dark:text-white text-black h-5" /> : <menu.icon className="w-5 dark:text-gray-200 text-gray-700 h-5" />}
                            <div className="text-xs w-16 truncate">{menu.name}</div>
                        </Link>
                    </Button>
                </div>
            ))}
        </div>
    );
}

const NonLoggedBox = ({ path }) => {
    const staticMenu = [
        {
            name: 'Content studio',
            icon: MdOutlineDashboardCustomize,
            icon2: MdDashboardCustomize,
            link: '/studio'
        },
        {
            name: 'History',
            icon: MdOutlineHistory,
            icon2: MdHistory,
            link: '/history'
        },
    ];
    return (
        <>
            {staticMenu.map((menu, index) => (
                <MenuItem key={index} menu={menu} path={path} />
            ))}
            <div className='rounded-xl mt-2 bg-slate-100 dark:bg-slate-800 overflow-hidden'>
                <div className={`bg-[url('/static/images/rb-signin-light-box-1603847734787-9e8a3f3e9d60.avif')] dark:bg-[url('/static/images/rb-signin-dark-box-1655835584195-1839b9cdf2ae.avif')]`}>
                    <div className="flex flex-col backdrop-blur-md bg-white/30 dark:bg-dark/30 p-2 items-center justify-center space-y-4">
                        <p className="text-xs cheltenham text-center text-slate-700 dark:text-slate-100">
                            Join us! Sign in to like and comment on articles, vote & answer community posts, subscribe to channels, join communities, and follow other users.
                        </p>
                        <Button
                            variant='outlined'
                            color="accent"
                            className="dark:hover:!bg-gray-50 hover:!bg-dark hover:!text-white dark:hover:!text-stone-900 !rounded-full !font-bold !py-1 !px-4"
                        >
                            <BiSolidUserCircle className='w-5 h-5 mr-2' />
                            <span className='mt-0.5'>Sign In</span>
                        </Button>
                    </div>
                </div>
            </div>
            <span className='w-full border-slate-300 dark:border-zinc-700 border-b my-2 h-0.5' ></span>
        </>
    );
}

const MenuSkeleton = (count) => {
    return Array.from({ length: count }, (_, index) => (
        <div key={index} className={`!py-2 !pl-4 !pr-2 !flex !space-x-7 items-center !max-w-[204px] w-full`}>
            <Skeleton variant="circular" className='!w-5 !h-5' width={20} height={20} animation='wave' />
            <Skeleton variant="text" className='!w-[calc(100%-52px)]' height={20} animation='wave' />
        </div>
    ));
}

export { MainSidebar, SmallSidebar };
