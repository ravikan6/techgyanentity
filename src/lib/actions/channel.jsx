"use server";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ApiGql_V2 } from '@/lib/connect';
import { SetChannelStudioCookie } from './studio';

const createChannelAction = async (name) => {
    let res = { data: null, status: 500, errors: null };
    const session = await getServerSession(authOptions);
    if (!session && !session.user) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }

    let query = `
        mutation ChannelCreate {
            createChannel(name: "${name}", owner: "${session.user.id}", isActive: ${true}) {
              channel {
                name
                handle
                id
              }
            }
        }
    `;

    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `${process.env.API_TOKEN_V2}`
    };

    res = await ApiGql_V2(query, headers);
    let data = res?.data?.createChannel?.channel || null;
    res = { ...res, data: data }
    return res;
};

const currentChannelGetInfoAction = async (id) => {
    let res = { data: null, status: 500, errors: null };
    const session = await getServerSession(authOptions);
    if (!session && !session.user) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }

    let query = `query {
        channel(id: "${id}") {
          handle
          id
          isActive
          logo
          description
          name
          cover
        }
    }`;

    res = await ApiGql_V2(query, { 'Authorization': `${process.env.API_TOKEN_V2}` });
    let data = res?.data?.channel || null;
    res = { ...res, data: data }
    return res;
}

const updateChannelInfoAction = async (data = {}) => {
    let res = { data: null, status: 500, errors: null };
    const session = await getServerSession(authOptions);
    if (!session && !session.user) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }
    let linksString = data?.links?.map(link => `{ id: "${link.id}", title: "${link.title}", url: "${link.url}" }`).join(', ');
    let query = `mutation {
        updateChannel(id: "${data.id}", owner: "${session.user?.id}", name: "${data?.name}", handle: "${data?.handle}", description: ${data?.description} links: [${linksString}], contactEmail: "${data?.ct_email}") {
          channel {
            id
            handle
            name
            isActive
            logo
          }
        }
    }`;

    res = await ApiGql_V2(query, { 'Authorization': `${process.env.API_TOKEN_V2}` });
    let newRes = await res?.data?.updateChannel?.channel || null;
    res = { ...res, data: newRes }
    return res;
}

const updateChannelBrandAction = async (data, files) => {
    try {
        let res = { data: null, status: 500, errors: null };
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            res = { ...res, errors: [{ message: 'Unauthorized' }] };
            return res;
        }

        let urlLogo = data?.meta?.lup;
        let urlBanner = data?.meta?.bup;
        let logo = files.get('logo')
        logo = logo == 'undefined' ? null : logo == 'null' ? null : logo;
        let banner = files.get('banner') ? files.get('banner') : null;
        banner = banner == 'undefined' ? null : banner == 'null' ? null : banner;
        let rmLogo = files.get('rmLogo') ? files.get('rmLogo') : false;
        let rmBanner = files.get('rmBanner') ? files.get('rmBanner') : false;
        let lgData = null;
        let bnData = null;

        if (!!logo && (rmLogo == 'false')) {
            try {
                let lgForm = new FormData();
                lgForm.append('image', logo);
                lgForm.append('userId', session.user?.id);
                let logoData = await fetch(urlLogo, {
                    method: 'POST',
                    headers: {
                        'Authorization': `${process.env.API_TOKEN_V2}`,
                        'Accept': 'application/json',
                    },
                    body: lgForm
                });
                logoData = await logoData.json();
                if (logoData?.success) {
                    lgData = logoData;
                } else {
                    throw new Error(logoData?.message);
                }
            } catch (error) {
                return { data: null, status: 500, errors: [{ message: 'An error occurred while uploading logo. Please try again later.' }] };
            }
        }

        if (!!banner && (rmBanner == 'false')) {
            try {
                let bnForm = new FormData();
                bnForm.append('image', banner);
                bnForm.append('userId', session.user?.id);
                let bannerData = await fetch(urlBanner, {
                    method: 'POST',
                    headers: {
                        'Authorization': `${process.env.API_TOKEN_V2}`,
                        'Accept': 'application/json',
                    },
                    body: bnForm
                });
                bannerData = await bannerData.json();

                if (bannerData?.success) {
                    bnData = bannerData;
                } else {
                    throw new Error(bannerData?.message);
                }
            } catch (error) {
                console.error('Error in banner upload:', error);
                return { data: null, status: 500, errors: [{ message: 'An error occurred while uploading banner. Please try again later.' }] };
            }
        }

        let query = `
            mutation {
                updateChannelBrand(
                    id: "${data?.id}",
                    owner: "${session.user?.id}",
                    ${rmLogo == 'true' ? 'removeLogo: true' : `
                        ${lgData ? `logo: {url: "${lgData?.uuid || ""}", path: "${lgData?.image_url || ""}" },` : ''}
                    `}
                    ${rmBanner == 'true' ? 'removeBanner: true' : `
                        ${bnData ? `banner: {url: "${bnData?.uuid || ""}", path: "${bnData?.image_url || ""}" }` : ''}
                    `}
                ) {
                    channel {
                        id
                        logo
                        banner
                    }
                }
            }
        `;
    
        res = await ApiGql_V2(query, { 'Authorization': `${process.env.API_TOKEN_V2}` });
        let newRes = await res?.data?.updateChannelBrand?.channel || null;
        res = { ...res, data: newRes };
        return res;
    } catch (error) {
        console.error('Error in updateChannelBrandAction:', error);
        return { data: null, status: 500, errors: [{ message: 'An error occurred while updating channel brand info. Please try again later.' }] };
    }
};


export { createChannelAction, currentChannelGetInfoAction, updateChannelInfoAction, updateChannelBrandAction };