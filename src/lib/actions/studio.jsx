"use server"
import { cookies } from 'next/headers';
// import { getCookie, setCookie } from "cookies-next";
import { decrypt, encrypt } from "../utils";
import { prisma } from '../db';
import { getCldImageUrl } from 'next-cloudinary';
import { getCImageUrl } from '../helpers';

const DecryptChannelStudioCookie = async () => {
    let cookieData = cookies().get('__Secure-RSUCHD');
    cookieData = await decrypt(cookieData?.value, process.env.COOKIE_SECRET);
    return cookieData;
}

const DecryptCommunityStudioCookie = async () => {
    let cookieData = cookies().get('__Secure-RSUCOD');
    cookieData = await decrypt(cookieData?.value, process.env.COOKIE_SECRET);
    return cookieData;
}

const DecryptAuthorStudioCookie = async () => {
    let cookieData = cookies().get('__Secure-RSUAUD');
    cookieData = await decrypt(cookieData?.value, process.env.COOKIE_SECRET);
    if (cookieData) {
        let author = await prisma.author.findUnique({
            where: {
                id: cookieData,
            }
        });
        if (author) {
            if (author?.image?.url) {
                if (author?.image?.provider === 'cloudinary') {
                    author.image = await getCImageUrl(author?.image?.url, { width: 100, height: 100, crop: 'fill', quality: 100 });
                }
            }
            if (author?.banner?.url) {
                if (author?.banner?.provider === 'cloudinary') {
                    author.banner = await getCImageUrl(author?.banner?.url, { width: 1300, height: 620, crop: 'auto', quality: 100 });
                }
            }
            return author;
        }
        else {
            return null;
        }
    }
    return null;
}

const DecryptAuthorIdStudioCookie = async () => {
    let cookieData = cookies().get('__Secure-RSUAUD');
    cookieData = await decrypt(cookieData?.value, process.env.COOKIE_SECRET);
    if (cookieData) {
        let author = await prisma.author.findUnique({
            where: {
                id: cookieData,
                isDeleted: false,
            },
            select: {
                id: true,
            }
        });
        if (author) {
            return author;
        }
        else {
            return null;
        }
    }
    return null;
}

const SetChannelStudioCookie = async (data) => {
    try {
        let encryptedData = encrypt(data, process.env.COOKIE_SECRET);
        cookies().set('__Secure-RSUCHD', encryptedData, {
            httpOnly: false,
            secure: true,
            sameSite: "Lax",
            path: "/",
            maxAge: 365 * 24 * 60 * 60,
        });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    };
};


const SetAuthorStudioCookie = async (data) => {
    try {
        let encryptedData = encrypt(data, process.env.COOKIE_SECRET);
        cookies().set('__Secure-RSUAUD', encryptedData, {
            httpOnly: false,
            secure: true,
            sameSite: "Lax",
            path: "/",
            maxAge: 365 * 24 * 60 * 60,
        });
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    };
}


const SetCommunityStudioCookie = async (data) => {
    try {
        let encryptedData = encrypt(data, process.env.COOKIE_SECRET);
        cookies().set('__Secure-RSUCOD', encryptedData, {
            httpOnly: false,
            secure: true,
            sameSite: "Lax",
            path: "/",
            maxAge: 365 * 24 * 60 * 60,
        });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    };
};

export { DecryptChannelStudioCookie, SetChannelStudioCookie, SetCommunityStudioCookie, DecryptCommunityStudioCookie, SetAuthorStudioCookie, DecryptAuthorStudioCookie, DecryptAuthorIdStudioCookie };