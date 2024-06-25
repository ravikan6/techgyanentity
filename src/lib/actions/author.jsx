'use server';
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deleteCloudinaryImage, uploadImage } from "./upload";
import { getCImageUrl } from "../helpers";
import { followAuthor } from "../resolver";


const updateAuthorAction = async (obj) => {
    let res = { data: null, status: 500, errors: null };
    const session = await auth();;
    if (!session && !session.user) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }

    try {
        let author = await prisma.author.update({
            where: { id: obj.id },
            data: {
                ...obj.data,
            },
        });

        author.image = author?.image?.url ? await getCImageUrl(author?.image?.url) : null;
        author.banner = author?.banner?.url ? await getCImageUrl(author?.banner?.url) : null;

        res = { ...res, data: author }
    } catch (error) {
        console.log(error, '______________error____________from______________updateAuthorAction')
        res = { ...res, errors: [{ message: error.message }] };
    }
    return res;
}

const updateAuthorImagesAction = async (data, files) => {
    try {
        let res = { data: null, status: 500, errors: [] };
        const session = await auth();
        if (!session || !session.user) {
            res = { ...res, errors: [{ message: 'Unauthorized' }] };
            return res;
        }

        let logo = files.get('logo')
        logo = logo == 'undefined' ? null : logo == 'null' ? null : logo;
        let banner = files.get('banner') ? files.get('banner') : null;
        banner = banner == 'undefined' ? null : banner == 'null' ? null : banner;
        let rmLogo = files.get('rmLogo') ? files.get('rmLogo') : 'false';
        let rmBanner = files.get('rmBanner') ? files.get('rmBanner') : 'false';

        let lgData = null;
        let bnData = null;

        let author = await prisma.author.findUnique({
            where: { id: data?.id },
            select: { id: true, image: true, banner: true }
        });

        if (!!logo && (rmLogo == 'false')) {
            try {
                let logoData = await uploadImage(logo);
                if (logoData?.success) {
                    lgData = await cloudinaryProvider(logoData?.data);
                    if (author?.image?.url) {
                        let rmData = await deleteCloudinaryImage(author?.image?.url);
                        if (!rmData?.success) {
                            throw new Error(rmData?.message);
                        }
                    }
                } else {
                    throw new Error(logoData?.message);
                }
            } catch (error) {
                console.log('Error in logo upload:', error);
                res.errors.push({ message: 'An error occurred while uploading logo. Please try again later.' });
                lgData = null;
            }
        } else {
            if (author?.image?.url && rmLogo == 'true') {
                try {
                    let logoData = await deleteCloudinaryImage(author?.image?.url);
                    if (logoData?.success) {
                        lgData = 'rm';
                    } else {
                        throw new Error(logoData?.message);
                    }
                } catch (error) {
                    console.log({ message: 'An error occurred while deleting logo. Please try again later.' });
                    lgData = null;
                }
            }
        }

        if (!!banner && (rmBanner == 'false')) {
            try {
                let bannerData = await uploadImage(banner);
                if (bannerData?.success) {
                    bnData = await cloudinaryProvider(bannerData?.data);
                    if (author?.banner?.url) {
                        let rmData = await deleteCloudinaryImage(author?.banner?.url);
                        if (!rmData?.success) {
                            throw new Error(rmData?.message);
                        }
                    }
                } else {
                    throw new Error(bannerData?.message);
                }
            } catch (error) {
                console.error('Error in banner upload:', error);
                res.errors.push({ message: 'An error occurred while uploading banner. Please try again later.' });
                bnData = null;
            }
        } else {
            if (author?.banner?.url && rmBanner == 'true') {
                try {
                    let bannerData = await deleteCloudinaryImage(author?.banner?.url);
                    if (bannerData?.success) {
                        bnData = 'rm';
                    } else {
                        throw new Error(bannerData?.message);
                    }
                } catch (error) {
                    bnData = null;
                    console.log({ message: 'An error occurred while deleting banner. Please try again later.' });
                }
            }
        }

        if (lgData || bnData) {
            let author = await prisma.author.update({
                where: { id: data?.id },
                data: {
                    ...lgData ? (lgData == 'rm' ? { image: null } : { image: { set: lgData } }) : null,
                    ...bnData ? (bnData == 'rm' ? { banner: null } : { banner: { set: bnData } }) : null,
                }
            });

            author.logo = author?.image?.url ? await getCImageUrl(author?.image?.url, { quality: 100 }) : null;
            author.banner = author?.banner?.url ? await getCImageUrl(author?.banner?.url, { quality: 100 }) : null;
            res = { ...res, data: author, status: 200 };
        }
        return res;
    } catch (error) {
        console.error('Error in updateAuthorImagesAction:', error);
        res.errors.push({ message: 'An error occurred while updating images. Please try again later.' });
        return res;
    }
};

const followAuthorAction = async (authorId) => {
    let res = { data: null, status: 500, errors: [] };
    const session = await auth();
    if (!session || !session.user) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }
    let follow = await followAuthor(authorId);
    if (follow?.status) {
        res = { ...res, data: { status: true, id: follow?.id }, status: 200 };
    } else {
        res = { ...res, data: { status: false, id: null }, status: 200 };
    }
    return res;
}

const checkAuthorFollowAction = async (authorId) => {
    let res = { data: null, status: 500, errors: [] };
    const session = await auth();
    if (!session || !session.user) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }
    let follow = await prisma.follower.findFirst({
        where: {
            authorId: authorId,
            followerId: session.user.id,
        },
    });
    if (follow) {
        res = { ...res, data: { status: true, id: follow?.id }, status: 200 };
    } else {
        res = { ...res, data: { status: false, id: null }, status: 200 };
    }
    return res;
}

export const cloudinaryProvider = async (data) => {
    let provider = 'cloudinary';
    return { provider, url: await data.public_id }
}

export { updateAuthorAction, updateAuthorImagesAction, followAuthorAction, checkAuthorFollowAction }