/**
 * @deprecated
 */
"use client";
import { DrawerContext } from "../mainlayout";
import { useContext, useEffect, useState, createContext } from "react";
import { Avatar, Skeleton, styled, useMediaQuery } from "@mui/material";
import { imgUrl } from "@/lib/helpers";
import Image from "next/image";


export const ArticleImage = ({ image, classes, height, width, className, style }) => {
    return <Image
        draggable={false}
        src={imgUrl(image?.url)}
        alt={image?.alt}
        width={width || 720}
        height={height || 405}
        // aspectRatio="16:9"
        sizes="100vw"
        loading='lazy'
        // enhance
        // crop={'fill'}
        // sanitize
        className={`rounded-2xl aspect-video h-auto ${classes} ${className}`}
        style={style}
    />
}

export const Puller = styled('div')(({ theme }) => ({
    width: 40,
    height: 5,
    backgroundColor: theme.palette?.accent?.main,
    borderRadius: 3,
    position: 'absolute',
    top: 4,
    left: 'calc(50% - 20px)',
}));

export const VariantpPersistentClient = () => {
    const context = useContext(DrawerContext);

    useEffect(() => {
        if (context.variant !== 'persistent') {
            context.setVariant('persistent')
            context.setOpen(false)
        };
    }, []);
    useEffect(() => {
        const styleTag = document.getElementById('r_tt');
        if (styleTag && context.variant === 'persistent') {
            styleTag.remove();
        }
    }, [context.variant]);
    return null;
}
