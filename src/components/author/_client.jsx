"use client";

import { CldImage } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Tooltip } from "../rui";
import Image from "next/image";
import { getFevicon } from '@/lib/utils';

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
            <Button onClick={handleClick} variant="outlined" size="small" startIcon={icon ? icon : <Image src={getFevicon(url)} alt={title} width={16} height={16} />}>
                {title}
            </Button>
        </Tooltip>
    )
}


export { AuthorBanner, BannerImage, AuthorBottomButtons };