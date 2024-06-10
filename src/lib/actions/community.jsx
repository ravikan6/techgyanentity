"use server";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ApiGql_V2 } from '@/lib/connect';

const createCommunityAction = async (name, privacy) => {
    let res = { data: null, status: 500, errors: null };
    const session = await getServerSession(authOptions);
    if (!session && !session.user) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }

    let query = `
        mutation ChannelCreate {
            createCommunity(
                isActive: ${true},
                name: "${name}",
                owner: "${session.user.id}",
                privacy: "${privacy}"
              ) {
                community {
                  id
                  handle
                  name
                  isActive
                }
            }
        }
    `;

    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `${process.env.API_TOKEN_V2}`
    };

    res = await ApiGql_V2(query, headers);
    let data = res?.data?.createCommunity?.community || null;
    res = { ...res, data: data }
    return res;
};

const updateCoverAppereanceAction = async (data, files) => {
    try {
        let res = { data: null, status: 500, errors: null };
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            res = { ...res, errors: [{ message: 'Unauthorized' }] };
            return res;
        }

        let urlAvatar = data?.meta?.lup;
        let urlCover = data?.meta?.bup;
        let avatar = files.get('avatar') ? files.get('avatar') : null;
        let cover = files.get('cover') ? files.get('cover') : null;
        let rmAvatar = files.get('rmAvatar') ? files.get('rmAvatar') : 'false';
        let rmCover = files.get('rmCover') ? files.get('rmCover') : 'false';
        let lgData = null;
        let bnData = null;

        if (!!avatar && avatar != 'undefined' && (rmAvatar == 'false' || rmAvatar == 'undefined')) {
            try {
                let lgForm = new FormData();
                lgForm.append('image', avatar);
                lgForm.append('userId', session.user?.id);
                let avatarData = await fetch(urlAvatar, {
                    method: 'POST',
                    headers: {
                        'Authorization': `${process.env.API_TOKEN_V2}`,
                        'Accept': 'application/json',
                    },
                    body: lgForm
                });
                avatarData = await avatarData.json();
                if (avatarData?.success) {
                    lgData = avatarData;
                } else {
                    throw new Error(avatarData?.message);
                }
            } catch (error) {
                console.error('Error in avatar upload:', error);
                return { data: null, status: 500, errors: [{ message: 'An error occurred while uploading avatar. Please try again later.' }] };
            }
        }

        if (!!cover && cover != 'undefined' && (rmCover == 'false' || rmCover == 'undefined')) {
            try {
                let bnForm = new FormData();
                bnForm.append('image', cover);
                bnForm.append('userId', session.user?.id);
                let coverData = await fetch(urlCover, {
                    method: 'POST',
                    headers: {
                        'Authorization': `${process.env.API_TOKEN_V2}`,
                        'Accept': 'application/json',
                    },
                    body: bnForm
                });
                coverData = await coverData.json();

                if (coverData?.success) {
                    bnData = coverData;
                } else {
                    throw new Error(coverData?.message);
                }
            } catch (error) {
                console.error('Error in cover upload:', error);
                return { data: null, status: 500, errors: [{ message: 'An error occurred while uploading cover. Please try again later.' }] };
            }
        }
 
        let query = `
            mutation {
                updateCommunityBrand(
                    id: "${data?.id}",
                    owner: "${session.user?.id}",
                    ${rmAvatar == 'true' ? 'removeAvatar: true' : `
                        ${lgData ? `avatar: {url: "${lgData?.uuid || ""}", path: "${lgData?.image_url || ""}" },` : ''}
                    `}
                    ${rmCover == 'true' ? 'removeCover: true' : `
                        ${bnData ? `cover: {url: "${bnData?.uuid || ""}", path: "${bnData?.image_url || ""}" }` : ''}
                    `}
                ) {
                    community {
                        id
                        avatar
                        cover
                    }
                }
            }
        `;

        res = await ApiGql_V2(query, { 'Authorization': `${process.env.API_TOKEN_V2}` });
        let newRes = await res?.data?.updateCommunityBrand?.community || null;
        res = { ...res, data: newRes };
        return res;
    } catch (error) {
        console.error('Error in updateCommunityBrandAction:', error);
        return { data: null, status: 500, errors: [{ message: 'An error occurred while updating Community appearance. Please try again later.' }] };
    }
};

const updateCommunityInfoAction = async (data = {}) => {
    let res = { data: null, status: 500, errors: null };
    const session = await getServerSession(authOptions);
    if (!session && !session.user) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }
    let linksString = data?.links ? data?.links?.map(link => `{ id: "${link.id}", title: "${link.title}", url: "${link.url}" }`).join(', ') : null;
    let query = `mutation {
        updateCommunity (id: "${data.id}", owner: "${session.user?.id}", name: "${data?.name}", handle: "${data?.handle}", description: ${data?.description}, contactEmail: "${data?.ct_email || ''}" ${linksString ? `, links: [${linksString}]` : ''}) {
          community {
            id
            handle
            name
            description
            isActive
            avatar
          }
        }
    }`;
    console.log(query);
    res = await ApiGql_V2(query, { 'Authorization': `${process.env.API_TOKEN_V2}` });
    let newRes = await res?.data?.updateCommunity?.community || null;
    console.log(newRes);
    res = { ...res, data: newRes }
    return res;
}

export { createCommunityAction, updateCoverAppereanceAction, updateCommunityInfoAction };