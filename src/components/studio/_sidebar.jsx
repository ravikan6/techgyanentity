'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, Skeleton } from '@mui/material';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState, useMemo, useContext } from 'react';
import { MdAnalytics, MdAttachMoney, MdDashboardCustomize, MdFeedback, MdOutlineAnalytics, MdOutlineAttachMoney, MdOutlineDashboardCustomize, MdOutlineFeedback, MdOutlineSettings, MdOutlineVideoLibrary, MdSettings, MdVideoLibrary, } from 'react-icons/md';
import { Button, Tooltip } from '@/components/rui/_components';
import { TbExternalLinkOff } from "react-icons/tb";
import { useSession } from 'next-auth/react';
import { StudioContext } from '@/lib/context';
import { RiSettingsFill, RiSettingsLine } from 'react-icons/ri';
import { ArrowBack } from '@mui/icons-material';

const mainMenu = [
    {
        name: 'Dashboard',
        icon: MdOutlineDashboardCustomize,
        icon2: MdDashboardCustomize,
        link: `/${process.env.STUDIO_URL_PREFIX}/dashboard`
    },
    {
        name: 'Content',
        icon: MdOutlineVideoLibrary,
        icon2: MdVideoLibrary,
        link: `/${process.env.STUDIO_URL_PREFIX}/content`
    },
    {
        name: 'Analytics',
        icon: MdOutlineAnalytics,
        icon2: MdAnalytics,
        link: `/${process.env.STUDIO_URL_PREFIX}/analytics`
    },
    {
        name: 'Monetization',
        icon: MdOutlineAttachMoney,
        icon2: MdAttachMoney,
        link: `/${process.env.STUDIO_URL_PREFIX}/monetization`
    },
    {
        name: 'Personalization',
        icon: RiSettingsLine,
        icon2: RiSettingsFill,
        link: `/${process.env.STUDIO_URL_PREFIX}/edit`
    },
];

const postMenu = (url) => [
    {
        name: 'Edit',
        icon: MdSettings,
        icon2: MdOutlineSettings,
        link: `${url}/edit`
    },
    {
        name: 'Settings',
        icon: MdSettings,
        icon2: MdOutlineSettings,
        link: `${url}/settings`
    },
]

const StudioSidebar = (props) => {
    const path = usePathname();
    let session = props?.session;
    const usesession = useSession();
    if (usesession.data) {
        session = usesession?.data;
    }
    const open = props?.open;
    const context = useContext(StudioContext);
    const [currentData, setCurrentData] = useState();
    const [staticMenu, setStaticMenu] = useState(mainMenu);

    useMemo(() => {
        const page = context?.data?.page;
        if (page === 'p') {
            setCurrentData({ ...currentData, ...context?.data?.article, url: `/@${context?.data?.article?.author?.handle}/${context?.data?.article?.shortId}` });
            setStaticMenu(postMenu(`/${process.env.STUDIO_URL_PREFIX}/p/${context?.data?.article?.shortId}`));
        } else { setCurrentData({ ...currentData, ...context?.data?.data, url: `/author/@${context?.data?.data?.handle}` }); setStaticMenu(mainMenu); }
    }, [context]);

    const MenuBtnStyle = (link) => {
        return `mb-0.5 h-10 max-w-[204px] transition-colors w-full rounded-full ${(path === link) ? 'bg-lightButton dark:bg-darkButton' : ''}`
    }

    const bottomMenu = [
        {
            name: 'Settings',
            icon: MdSettings,
            icon2: MdOutlineSettings,
            link: `/${process.env.STUDIO_URL_PREFIX}/settings`
        },
        {
            name: 'Send feedback',
            icon: MdFeedback,
            icon2: MdOutlineFeedback,
            link: '#'
        },
    ];

    return (
        <>
            <div className='w-full transition-all dark:bg-darkHead bg-lightHead'>
                <div className="flex w-full flex-col h-[calc(100vh-54px)] items-start">
                    {(context?.data?.page === 'p') ? <PostBox url={currentData?.url} title={currentData?.title} image={currentData?.image} open={open} /> : <div className={`flex w-full px-3 items-center ${open ? 'h-40' : 'h-14'}`}>
                        <UserBox currentData={currentData} open={open} />
                    </div>}

                    <div className={`${open ? 'h-[calc(100vh-256px)]' : 'h-[calc(100vh-200px)]'} w-full px-1.5 min-h-10 overflow-hidden hover:overflow-y-auto`}>
                        <div className={`dark:bg-dark bg-light py-1 rounded-xl ${open ? 'w-full px-1.5' : 'flex flex-col items-center'} h-full overflow-hidden hover:overflow-y-auto`}>
                            {staticMenu.map((menu, index) => (
                                <div key={index} className={MenuBtnStyle(menu.link)} >
                                    <Link href={menu.link} >
                                        <Button fullWidth={open} >
                                            <div className={`flex ${open ? 'space-x-7 w-full py-0.5 px-2' : 'p-1'} items-center`}>
                                                {(path === menu.link) ? <menu.icon2 className="w-5 dark:text-white text-black h-5" /> : <menu.icon className="w-5 dark:text-gray-200 text-gray-700 h-5" />}
                                                {open && <span className="text-base dark:text-gray-100 text-gray-800 font-semibold truncate ">{menu.name}</span>}
                                            </div>
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={`h-20 w-full mt-3 mb-1 ${open && 'px-3'}`}>
                        <div className={`flex flex-col h-full w-full ${!open && 'items-center mx-auto'}`}>
                            {bottomMenu.map((menu, index) => (
                                <div key={index} className={MenuBtnStyle(menu.link)} >
                                    <Link href={menu.link} >
                                        <Button fullWidth={open} >
                                            <div className={`flex ${open ? 'space-x-7 w-full py-0.5 px-2' : 'p-1'} items-center`}>
                                                {(path === menu.link) ? <menu.icon className="w-5 dark:text-white text-black h-5" /> : <menu.icon2 className="w-5 dark:text-gray-200 text-gray-700 h-5" />}
                                                {open && <span className="text-base dark:text-gray-100 text-gray-800 font-semibold truncate ">{menu.name}</span>}
                                            </div>
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const PostBox = ({ url, title, image, open }) => {

    return (
        <>
            <div className="flex flex-col py-2 space-y-2 justify-center w-full items-center">

                <Button fullWidth={open} href={`/${process.env.STUDIO_URL_PREFIX}/content`} >
                    <div className={`flex ${open ? 'space-x-7 w-full py-0.5 px-2' : 'p-1'} items-center`}>
                        <ArrowBack className="w-5 dark:text-gray-200 text-gray-700 h-5" />
                        {open && <span className="text-base dark:text-gray-100 text-gray-800 font-semibold truncate ">Content</span>}
                    </div>
                </Button>

                <Link href={url} className={`${open ? '!w-[224px] !h-[127px]' : '!w-14 !h-8'} mx-auto rounded-full`}>
                    <Tooltip title='View on article page' placement='right'>
                        <div className='flex flex-col group justify-center items-center'>
                            <Image draggable={false} className={`${open ? '!w-[224px] !h-[127px] text-2xl' : '!w-14 !h-8 text-base'} font-semibold rounded-md`} alt={title || ''} src={image || ''} width={224} height={127} />
                            <div className={`hidden ${open ? '!w-[224px] cheltenham !h-[127px] text-base' : '!w-14 !h-8'} rounded-md justify-center items-center group-hover:flex absolute bg-dark/50`}>
                                <TbExternalLinkOff className={`${open ? 'w-6 h-6' : 'w-2 h-2'}`} />
                            </div>
                        </div>
                    </Tooltip>
                </Link>

                {open && <div className='flex mt-2 flex-col w-9/12 mx-auto items-center'>
                    <Tooltip title={title} placement='right'>
                        <h3 className='text-lg text-start truncate w-full dark:text-gray-100 text-gray-800 font-semibold'>{title}</h3>
                    </Tooltip>
                </div>}
            </div>
        </>
    )
}

const UserBox = ({ currentData, open }) => {
    return (
        <>
            <div className="flex flex-col py-2 justify-center w-full items-center">
                <Link href={currentData?.url} className={`${open ? 'w-[100px] h-[100px]' : 'w-8 h-8'} mx-auto rounded-full`}>
                    <Tooltip title='View' placement='bottom'>
                        <div className='flex flex-col group justify-center items-center'>
                            <Avatar draggable={false} className={`${open ? '!w-[100px] !h-[100px] text-2xl' : '!w-8 !h-8 text-base'} font-semibold rounded-full`} alt={currentData?.name || 'A'} src={currentData?.image} >{currentData?.name?.slice(0, 1)?.toUpperCase()}</Avatar>
                            <div className={`hidden ${open ? 'w-[100px] h-[100px]' : 'w-8 h-8'} rounded-full justify-center items-center group-hover:flex absolute bg-dark/50`}>
                                <TbExternalLinkOff className={`${open ? 'w-6 h-6' : 'w-2 h-2'}`} />
                            </div>
                        </div>
                    </Tooltip>
                </Link>

                {open && <div className='flex mt-2 flex-col w-9/12 mx-auto items-center'>
                    <Tooltip title={currentData?.name} placement='right'>
                        <h3 className='text-lg text-center truncate w-full dark:text-gray-100 text-gray-800 font-semibold'>{currentData?.name}</h3>
                    </Tooltip>
                </div>}
            </div>
        </>
    )
}


const MenuSkeleton = (count) => {
    return Array.from({ length: count }, (_, index) => (
        <div key={index} className={`!py-2 !pl-4 !pr-2 !flex !space-x-7 items-center !max-w-[204px] w-full`}>
            <Skeleton variant="circular" className='!w-5 !h-5' width={20} height={20} animation='wave' />
            <Skeleton variant="text" className='!w-[calc(100%-52px)]' height={20} animation='wave' />
        </div>
    ));
}

export { StudioSidebar };
