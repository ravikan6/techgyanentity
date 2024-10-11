"use server";

import { api } from "@/lib/client";
import { CREATE_CREATOR_PROFILE, FOLLOW_CREATOR, UNFOLLOW_CREATOR, UPDATE_CREATOR, UPDATE_CREATOR_BANNER, UPDATE_CREATOR_IMAGE } from "@/lib/types/creator";

import { auth } from "@/lib/auth";
import { uploadImage, cloudinaryProvider } from "@/lib/actions/upload";

const createCreatorProfile = async (input = { name: null, handle: null }) => {
    const res = { success: false, data: null, errors: [] };
    if (!input.name || !input.handle) {
        res.errors.push({ message: "Name and handle are required" });
        return res;
    }
    try {
        let client = await api();
        const { data } = await client.mutate({
            mutation: CREATE_CREATOR_PROFILE,
            variables: input,
        });
        if (data?.createCreator?.creator) {
            res.data = data.createCreator.creator;
            res.success = true;
        }
        if (data.errors) {
            res.errors = data.errors;
        }
    } catch (e) {
        res.errors.push({ message: `Something went wrong!` });
    }
    return res;
};

const updateCreatorProfile = async (obj) => {
    let res = { data: null, success: false, errors: null };
    const session = await auth();;
    if (!session && !session.user) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }

    let social = (obj.data?.social || [])?.map((item, index) => ({
        id: item?.id || index + 1,
        name: item?.name,
        url: item?.url,
    }))

    try {
        let client = await api()
        let { data: author, errors } = await client.mutate({
            mutation: UPDATE_CREATOR,
            variables: {
                key: obj.key,
                social: social,
                name: obj.data?.name,
                description: obj.data?.description,
                contactEmail: obj.data?.contactEmail || null,
                handle: obj.data.handle
            },
        });
        if (author?.updateCreator?.creator) {
            author = author?.updateCreator?.creator;
            res = { ...res, data: author, success: true };
        }
        if (errors) {
            res = { ...res, errors: errors };
        }
    } catch (error) {
        console.log(JSON.stringify(error));
        res = { ...res, errors: [{ message: error.message }] };
    }
    return res;
}

const updateCreatorBrand = async (data, files, actions) => {
    try {
        let res = { data: null, success: false, errors: [] };
        const session = await auth();
        if (!session || !session.user) {
            res = { ...res, errors: [{ message: 'Unauthorized' }] };
            return res;
        }

        let logo = files.get('logo')
        logo = logo == 'undefined' ? null : logo == 'null' ? null : logo;
        let banner = files.get('banner') ? files.get('banner') : null;
        banner = banner == 'undefined' ? null : banner == 'null' ? null : banner;

        let lgData = null;
        let bnData = null;
        let imageDeleted, bannerDeleted;

        let client = await api();

        if (!!logo && actions?.image !== 'DELETE') {
            try {
                let logoData = await uploadImage(logo);
                if (logoData?.success) {
                    lgData = await cloudinaryProvider(logoData?.data);
                    let res = await client.mutate({
                        mutation: UPDATE_CREATOR_IMAGE,
                        variables: {
                            action: actions?.image,
                            provider: lgData.provider,
                            url: lgData.url,
                            key: data?.key,
                            id: data?.media?.image?.id || null
                        }
                    })
                    if (res?.data?.updateCreator?.creator) {
                        lgData = res?.data?.updateCreator?.creator?.image;
                    } else {
                        throw new Error(res?.errors[0]?.message);
                    }
                } else {
                    throw new Error(logoData?.message);
                }
            } catch (error) {
                res.errors.push({ message: 'An error occurred while uploading logo. Please try again later.' });
                lgData = null;
            }
        } else {
            if (data?.media?.image?.id && actions?.image === 'DELETE') {
                try {
                    let res = await client.mutate({
                        mutation: UPDATE_CREATOR_IMAGE,
                        variables: {
                            action: 'DELETE',
                            id: data?.media?.image?.id,
                            url: data?.media?.image?.url,
                            provider: data?.media?.image?.provider || 'cloudinary'
                        }
                    })
                    if (res?.data?.updateCreator?.creator) {
                        lgData = null;
                        imageDeleted = true;
                    }
                } catch (error) {
                    lgData = null;
                    res.errors.push({ message: 'An error occurred while deleting logo. Please try again later.' });
                }
            }
        }


        if (!!banner && actions?.banner !== 'DELETE') {
            try {
                let bannerData = await uploadImage(banner);
                if (bannerData?.success) {
                    bnData = await cloudinaryProvider(bannerData?.data);
                    let res = await client.mutate({
                        mutation: UPDATE_CREATOR_BANNER,
                        variables: {
                            action: actions?.banner,
                            provider: bnData.provider,
                            url: bnData.url,
                            key: data?.key,
                            id: data?.media?.banner?.id || null
                        }
                    })
                    if (res?.data?.updateCreator?.creator) {
                        bnData = res?.data?.updateCreator?.creator?.banner;
                    }
                } else {
                    throw new Error(bannerData?.message);
                }
            } catch (error) {
                res.errors.push({ message: 'An error occurred while uploading banner. Please try again later.' });
                bnData = null;
            }
        } else {
            if (data?.media?.banner?.id && actions?.banner === 'DELETE') {
                try {
                    let res = await client.mutate({
                        mutation: UPDATE_CREATOR_BANNER,
                        variables: {
                            action: 'DELETE',
                            id: data?.media?.banner?.id,
                            url: data?.media?.banner?.url,
                            provider: data?.media?.banner?.provider || 'cloudinary',
                            key: data?.key
                        }
                    })
                    if (res?.data?.updateCreator?.creator) {
                        bnData = null;
                        bannerDeleted = true;
                    }
                } catch (error) {
                    bnData = null;
                    res.errors.push({ message: 'An error occurred while deleting banner. Please try again later.' });
                }
            }
        }

        let resdata = { image: lgData === undefined ? data?.media?.image : lgData, banner: bnData === undefined ? data?.media?.banner : bnData, imageDeleted, bannerDeleted };
        res = { ...res, data: resdata, success: true };
        return res;
    } catch (error) {
        res.errors.push({ message: 'An error occurred while updating images. Please try again later.' });
        return res;
    }
};

const followCreator = async ({ key, notifPref }) => {
    const res = { success: false, data: null, errors: [] };
    try {
        let client = await api();
        const { data } = await client.mutate({
            mutation: FOLLOW_CREATOR,
            variables: { creatorKey: key, notifications: notifPref },
        });
        if (data?.followCreator?.creator) {
            res.data = data.followCreator.creator;
            res.success = true;
        }
        if (data.errors) {
            res.errors = data.errors;
        }
    } catch (e) {
        res.errors.push({ message: `Something went wrong!` });
    }
    return res;
}

const unfollowCreator = async (key) => {
    const res = { success: false, data: null, errors: [] };
    try {
        let client = await api();
        const { data } = await client.mutate({
            mutation: UNFOLLOW_CREATOR,
            variables: { creatorKey: key },
        });
        if (data?.unfollowCreator?.creator) {
            res.data = data.unfollowCreator.creator;
            res.success = true;
        }
        if (data.errors) {
            res.errors = data.errors;
        }
    }
    catch (e) {
        res.errors.push({ message: `Something went wrong!` });
    }
    return res;
}

export { createCreatorProfile, updateCreatorProfile, updateCreatorBrand };
export { followCreator, unfollowCreator };