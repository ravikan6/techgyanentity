"use server"
import { cookies } from 'next/headers';
import { getCookie, setCookie } from "cookies-next";
import { decrypt, encrypt } from "../utils";

const DecryptChannelStudioCookie = async () => {
    let cookieData = getCookie('__Secure-RSUCHD', { cookies });
    console.log(cookieData, process.env.COOKIE_SECRET);
    cookieData = await decrypt(cookieData, process.env.COOKIE_SECRET);
    return cookieData;
}

const DecryptCommunityStudioCookie = async () => {
    let cookieData = getCookie('__Secure-RSUCOD', { cookies });
    cookieData = await decrypt(cookieData, process.env.COOKIE_SECRET);
    return cookieData;
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

export { DecryptChannelStudioCookie, SetChannelStudioCookie, SetCommunityStudioCookie, DecryptCommunityStudioCookie };