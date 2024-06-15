"use client";
import { CldImage } from "next-cloudinary";


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