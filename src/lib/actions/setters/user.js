"use server";

import { api } from "@/lib/client";
import { uploadImage, cloudinaryProvider } from "@/lib/actions/upload";
import { UPDATE_USER, UPDATE_USER_IMAGE } from "@/lib/types/user";
import { auth } from "@/lib/auth";

const updateUser = async (input) => {
    let res = { data: null, success: false, errors: [] };

    try {
        let client = await api();
        const { data } = await client.mutate({
            mutation: UPDATE_USER,
            variables: {
                dob: input?.dob,
                firstName: input?.firstName,
                lastName: input?.lastName,
                sex: input?.sex,
                username: input?.username
            }
        })

        if (data && data?.updateMe?.user) {
            res.data = data?.updateMe?.user;
            res.success = true;
        }
        if (data?.errors) {
            res.errors = data.errors;
        }
        return res;
    } catch (error) {
        res.errors.push({ message: 'An error occurred while updating user. Please try again later.' });
        return res;
    }
}

const updateUserImage = async (files, options) => {
    let res = { data: null, success: false, errors: [] };
    let logo = files.get('image') == 'undefined' ? null : files.get('image') == 'null' ? null : files.get('image');
    if (logo === null && options.action !== 'DELETE') {
        res.errors.push({ message: 'No file uploaded' });
        return res
    } else if (options.action === 'DELETE' && !options.id) {
        res.errors.push({ message: 'No file found to delete' });
        return res
    }
    const session = await auth();
    if (!session || !session.user) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }
    try {
        let imageData = null;

        if (!!logo && options.action !== 'DELETE') {
            try {
                let logoData = await uploadImage(logo);
                if (logoData?.success) {
                    imageData = await cloudinaryProvider(logoData.data);
                } else {
                    throw new Error(logoData?.message);
                }
            } catch (error) {
                res.errors.push({ message: 'An error occurred while uploading Image. Please try again later.' });
                imageData = null;
            }
        }

        let client = await api();

        const { data } = await client.mutate({
            mutation: UPDATE_USER_IMAGE,
            variables: {
                image: {
                    action: options.action,
                    url: imageData ? imageData.url : options.url,
                    provider: imageData ? imageData.provider : options.provider,
                    id: options.id || null,
                }
            }
        })

        if (data?.updateMe?.user) {
            res.data = data?.updateMe?.user;
            res.success = true;
        } else {
            res.errors.push({ message: 'An error occurred while updating profile picture. Please try again later.' });
        }

        return res;
    } catch (error) {
        res.errors.push({ message: 'An error occurred while updating profile picture. Please try again later.' });
        return res;
    }
}

export { updateUserImage, updateUser };