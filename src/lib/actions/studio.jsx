"use server"
import { cookies, headers } from 'next/headers';
// import { getCookie, setCookie } from "cookies-next";
import { decrypt, encrypt } from "../utils";
import { prisma } from '../db';
import { getCldImageUrl } from 'next-cloudinary';

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
                    author.image = await getCldImageUrl(author?.image?.url, { width: 100, height: 100, crop: 'fill' });
                }
            }
            console.log(author,'author_______________________________asyncAction');
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

export { DecryptChannelStudioCookie, SetChannelStudioCookie, SetCommunityStudioCookie, DecryptCommunityStudioCookie, SetAuthorStudioCookie, DecryptAuthorStudioCookie };