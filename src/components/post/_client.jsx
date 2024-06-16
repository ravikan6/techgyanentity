"use client";
import { CldImage } from "next-cloudinary";
import { DrawerContext } from "../mainlayout";
import { useContext, useEffect } from "react";


export const ArticleImage = ({ image }) => {
    return <CldImage
        src={image?.url}
        alt={image.alt}
        width={684}
        height={420}
        loading='lazy'
        className="rounded-2xl"
    />
}

export const ArticleWrapper = ({ children }) => {
    const context = useContext(DrawerContext);

    useEffect(() => {
        context.setVariant('persistent');
        context.setOpen(false);
    }, []);

    return <div className="">
        {children}
    </div>
}