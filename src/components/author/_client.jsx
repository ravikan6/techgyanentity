"use client";

import { CldImage, getCldImageUrl } from "next-cloudinary";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Tooltip } from "../rui";
import Image from "next/image";
import { getFevicon } from '@/lib/utils';
import Link from "next/link";
import { Avatar } from "@mui/material";

const AuthorBanner = ({ id }) => {
    const [banner, setBanner] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanner = async () => {
            const res = await fetch(`/api/image_url?id=${id}`);
            const data = await res.json();
            setBanner(data.data);
            setLoading(false);
        }
        fetchBanner();
    }, [id]);

    return (
        <>
            {loading ? <div className="w-full h-40 bg-gray-200 animate-pulse"></div> :
                <><img draggable src={banner?.url} alt="Banner" className="w-full h-40 object-cover" />
                    {JSON.stringify(banner)}
                </>}
        </>
    )
}

const BannerImage = ({ banner, className, height, width }) => {
    return (
        <CldImage
            draggable={false}
            src={banner?.url}
            alt={banner?.alt || "Banner"}
            className={className}
            height={height || 188}
            width={width || 1138}
            crop={'fill'}
            fill
            sanitize
            enhance
            sizes="100vw"
            gravity="center"
        />
    )
}

const AuthorBottomButtons = ({ url, title, isExt, icon, tip }) => {
    const router = useRouter();

    const handleClick = () => {
        if (isExt) {
            window.open(url, '_blank');
        } else {
            router.push(url);
        }
    }

    return (
        <Tooltip title={tip || title}>
            <Button onClick={handleClick} variant="outlined" size="small" startIcon={icon ? icon : <Image src={getFevicon(url)} className="rounded" alt={title} width={16} height={16} />}>
                {title}
            </Button>
        </Tooltip>
    )
}

const AuthorLayoutNav = ({ data }) => {
    const path = usePathname();

    const tabs = [
        {
            url: '',
            label: 'Feed',
        },
        {
            url: '/posts',
            label: 'Articles',
        },
        {
            url: '/about',
            label: 'About',
        },
    ];

    return (
        <>
            <div className="m-auto py-2 rounded-full bg-lightHead dark:bg-darkHead">
                <div className="flex items-center px-10 space-x-10 m-auto">
                    {tabs.map((tab, index) => {
                        const isActive = (path === `/${data?.handle}${tab.url}`) || (path === `/@${data?.handle}${tab.url}`);
                        return (
                            <div key={index} className="flex items-center justify-center">
                                <Link
                                    href={`/@${data?.handle}${tab.url}`}
                                    className={`px-8 h-8 font-semibold text-sm rounded-full align-middle flex items-center ${isActive ? 'bg-lightButton dark:bg-darkButton text-black' : 'bg-light text-zinc-800 dark:bg-dark dark:text-zinc-100 dark:hover:text-darkButton hover:text-lightButton'}`}
                                >
                                    {tab.label}
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

const AuthorAvatar = ({ data, className, width, height }) => {
    let url = data?.url?.startsWith('http') ? data?.url : getCldImageUrl({ src: data?.url })
    return (
        <Avatar src={url} alt="Authro Avatar" className={`${className}`} />
    )
}

export { AuthorBanner, BannerImage, AuthorBottomButtons, AuthorLayoutNav, AuthorAvatar };