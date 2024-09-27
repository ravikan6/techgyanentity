'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, Skeleton } from '@mui/material';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState, useMemo, useContext } from 'react';
import { MdAnalytics, MdAttachMoney, MdDashboardCustomize, MdFeedback, MdOutlineAnalytics, MdOutlineAttachMoney, MdOutlineDashboardCustomize, MdOutlineFeedback, MdOutlineSettings, MdOutlineVideoLibrary, MdSettings, MdVideoLibrary, MdDraw, MdOutlineDraw, MdCopyright } from 'react-icons/md';
import { Button, Tooltip } from '@/components/rui';
import { TbExternalLinkOff } from "react-icons/tb";
import { useSession } from 'next-auth/react';
import { StudioContext } from '@/lib/context';
import { RiSettingsFill, RiSettingsLine, RiArticleFill, RiArticleLine } from 'react-icons/ri';
import { ArrowBack } from '@mui/icons-material';
import { BiCommentDetail, BiSolidCommentDetail } from 'react-icons/bi';
import { PiCopyrightFill } from 'react-icons/pi';
import { imgUrl } from '@/lib/helpers';
import { ArticleImage } from '../post/_client';

const mainMenu = [
    {
        name: 'Dashboard',
        icon: MdOutlineDashboardCustomize,
        icon2: MdDashboardCustomize,
        link: `/${process.env.STUDIO_URL_PREFIX}/dashboard`,
        tip: 'View the dashboard'
    },
    {
        name: 'Content',
        icon: MdOutlineVideoLibrary,
        icon2: MdVideoLibrary,
        link: `/${process.env.STUDIO_URL_PREFIX}/content`,
        tip: 'Manage content'
    },
    {
        name: 'Analytics',
        icon: MdOutlineAnalytics,
        icon2: MdAnalytics,
        link: `/${process.env.STUDIO_URL_PREFIX}/analytics`,
        tip: 'View analytics'
    },
    {
        name: 'Monetization',
        icon: MdOutlineAttachMoney,
        icon2: MdAttachMoney,
        link: `/${process.env.STUDIO_URL_PREFIX}/monetization`,
        tip: 'Manage monetization'
    },
    {
        name: 'Customization',
        icon: RiSettingsLine,
        icon2: RiSettingsFill,
        link: `/${process.env.STUDIO_URL_PREFIX}/edit`,
        tip: 'Customize settings'
    },
];

const postMenu = (url) => [
    {
        name: 'Details',
        icon: RiArticleLine,
        icon2: RiArticleFill,
        link: `${url}/edit`,
        tip: 'View article details'
    },
    {
        name: 'Analytics',
        icon: MdOutlineAnalytics,
        icon2: MdAnalytics,
        link: `${url}/analytics`,
        tip: 'View article analytics'
    },
    {
        name: 'Editor',
        icon: MdOutlineDraw,
        icon2: MdDraw,
        link: `${url}/editor`,
        tip: 'Access article editor'
    },
    {
        name: 'Comments',
        icon: BiCommentDetail,
        icon2: BiSolidCommentDetail,
        link: `${url}/comments`,
        tip: 'Manage article comments'
    },
    {
        name: 'Copyrights',
        icon: PiCopyrightFill,
        icon2: MdCopyright,
        link: `${url}/rights`,
        tip: 'Manage article copyrights'
    }
];

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
        return `mb-1 h-10 transition-colors rounded-full ${open ? 'w-full' : 'w-10'} ${(path === link) ? 'bg-lightButton dark:bg-darkButton' : ''}`
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

    return (<>
        <div className='w-full transition-all duration-500 dark:bg-darkHead bg-lightHead'>
            <div className="flex w-full transition-all duration-500 flex-col h-[calc(100vh-54px)] items-start">
                {(context?.data?.page === 'p') ? <PostBox url={currentData?.url} title={currentData?.title} image={currentData?.image?.url} open={open} /> : <div className={`flex w-full px-3 items-center ${open ? 'h-40' : 'h-14'}`}>
                    <UserBox currentData={currentData} open={open} />
                </div>}

                <div className={`${open ? 'h-[calc(100vh-256px)]' : 'h-[calc(100vh-200px)]'} w-full transition-all duration-500 px-1.5 rb__studio__menu min-h-10 overflow-hidden hover:overflow-y-auto`}>
                    <div className={`dark:bg-dark bg-light py-1.5 rounded-xl ${open ? 'w-full px-1.5' : 'flex flex-col items-center'} h-full overflow-hidden hover:overflow-y-auto`}>
                        {staticMenu.map((menu, index) => (
                            <div key={index} className={MenuBtnStyle(menu.link)} >
                                <Tooltip title={menu.tip} placement="right">
                                    <Link href={menu.link} >
                                        <Button fullWidth={open} sx={[!open && { height: '40px', minWidth: '40px !important' }]}  >
                                            <div className={`flex ${open ? 'space-x-7 w-full py-0.5 px-2' : ''} items-center`}>
                                                {(path === menu.link) ? <menu.icon2 className={`w-5 h-5 dark:text-black text-black`} /> : <menu.icon className="w-5 dark:text-gray-200 text-gray-700 h-5" />}
                                                <span className={`${(path === menu.link) ? 'dark:text-black text-black' : 'dark:text-gray-100 text-gray-800'} ${!open && 'w-0'} text-base font-semibold truncate`}>{menu.name}</span>
                                            </div>
                                        </Button>
                                    </Link>
                                </Tooltip>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={`h-20 w-full transition-all duration-500 mt-3 mb-1 ${open && 'px-3'}`}>
                    <div className={`flex flex-col h-full w-full ${!open && 'items-center mx-auto'}`}>
                        {bottomMenu.map((menu, index) => (
                            <div key={index} className={MenuBtnStyle(menu.link)} >
                                <Link href={menu.link} >
                                    <Button fullWidth={open} sx={[!open && { height: '40px', minWidth: '40px !important' }]} >
                                        <div className={`flex ${open ? 'space-x-7 w-full py-0.5 px-2' : ''} items-center`}>
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
    </>);
};
const PostBox = ({ url, title, image, open }) => {
    return (
        <>
            <div className="flex flex-col pb-2 space-y-2 justify-center w-full items-center">
                <Link href={`/${process.env.STUDIO_URL_PREFIX}/content`} className={`${open ? 'hidden' : 'inline'}`} >
                    <Button className="!bg-light dark:!bg-dark" sx={{ height: '40px', minWidth: '40px !important', borderRadius: 999 }}  >
                        <ArrowBack className="w-5 dark:text-white text-black h-5" />
                    </Button>
                </Link>
                <a href={url} target="_blank" className={`${open ? '!w-[224px] !h-[127px]' : '!w-14 !h-8'} mx-auto rounded-full`}>
                    <Tooltip title={`Post Details: ${title}`} placement='right'>
                        <div className='flex flex-col group justify-center items-center'>
                            <ArticleImage image={{ url: image, alt: title }} title={title} width={224} height={127} className={`${open ? '!w-[224px] !h-[127px]' : '!w-14 !h-8'} !rounded-md`} />
                            <div className={`hidden ${open ? '!w-[224px] cheltenham !h-[127px] text-base' : '!w-14 !h-8'} rounded-md justify-center items-center group-hover:flex absolute bg-dark/50`}>
                                <TbExternalLinkOff className={`${open ? 'w-6 h-6' : 'w-2 h-2'}`} />
                            </div>
                        </div>
                    </Tooltip>
                </a>
                <div className={`${open ? 'flex' : 'hidden'} mt-2 w-full flex-col px-3 justify-start items-start`}>
                    <span className='text-base font-semibold mb-0.5'>Your Post</span>
                    <Tooltip title={title} placement='right'>
                        <h3 className='text-sm text-start line-clamp-1 w-[99%] dark:text-gray-300 text-gray-600 cheltenham'>{title}</h3>
                    </Tooltip>
                </div>
                <Link href={`/${process.env.STUDIO_URL_PREFIX}/content`} className={`${open ? 'px-0.5 w-full block' : 'hidden'}`} >
                    <Button size="small" fullWidth={open} >
                        <div className={`flex ${open ? 'space-x-5 w-full' : ''} items-center`}>
                            <ArrowBack className="w-5 dark:text-gray-200 text-gray-700 h-5" />
                            <span className="text-base dark:text-gray-100 text-gray-800 font-semibold truncate ">Back to Content</span>
                        </div>
                    </Button>
                </Link>
            </div>
        </>
    )
}
const UserBox = ({ currentData, open }) => {
    return (
        <>
            <div className="flex flex-col py-2 justify-center w-full items-center">
                <a target='_blank' href={currentData?.url} className={`${open ? 'w-[100px] h-[100px]' : 'w-8 h-8'} mx-auto rounded-full`}>
                    <Tooltip title='View' placement='bottom'>
                        <div className='flex flex-col group justify-center items-center'>
                            <Avatar draggable={false} className={`${open ? '!w-[100px] !h-[100px] text-2xl' : '!w-8 !h-8 text-base'} font-semibold rounded-full`} alt={currentData?.name || 'A'} src={currentData?.image?.url} >{currentData?.name?.slice(0, 1)?.toUpperCase()}</Avatar>
                            <div className={`hidden ${open ? 'w-[100px] h-[100px]' : 'w-8 h-8'} rounded-full justify-center items-center group-hover:flex absolute bg-dark/50`}>
                                <TbExternalLinkOff className={`${open ? 'w-6 h-6' : 'w-2 h-2'}`} />
                            </div>
                        </div>
                    </Tooltip>
                </a>
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