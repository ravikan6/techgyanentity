import { ChannelEditBranding, ChannelEditInfo, ChannelEditSections } from '@/components/studio/channel';
import { DecryptChannelStudioCookie, DecryptAuthorStudioCookie } from '@/lib/actions/studio';
import { redirect } from 'next/navigation';
import React from 'react'

export function metadata({ searchParams }) {
    let page = searchParams?.t || '';

    if (page === 'sections') {
        return {
            title: 'Sections',
            description: 'Edit your channel sections',
            keywords: 'sections, channel, edit'
        };
    } else if (page === 'branding') {
        return {
            title: 'Branding',
            description: 'Edit your channel branding',
            keywords: 'branding, channel, edit'
        };
    } else if (page === 'info') {
        return {
            title: 'Basic Details',
            description: 'Edit your channel info',
            keywords: 'info, channel, edit'
        };
    } else {
        return {
            title: 'Sections',
            description: 'Edit your channel sections',
            keywords: 'sections, channel, edit'
        };
    };
};

async function getChannelInfo(id) {
    return null;
}

async function getChannelBrand(id) {
    return null;
}

const ChannelEditPage = async ({ searchParams }) => {
    let page = searchParams?.t || '';
    let data = {}
    let channelInfo = await DecryptAuthorStudioCookie();
    // if (!channelInfo) {
    //     redirect('/studio/channel');
    // }
    if (page === 'sections') {
    } else if (page === 'branding') {
        data = await getChannelBrand(channelInfo?.id);
    } else if (page === 'info') {
        data = await getChannelInfo(channelInfo?.id);
    }
    data = data && await data.data?.channel;

    console.log(data)

    if (page === 'sections') {
        return (
            <channel-edit-page>
                <ChannelEditSections data={data} />
            </channel-edit-page>
        )
    } else if (page === 'branding') {
        return (
            <channel-edit-page>
                <ChannelEditBranding data={data} />
            </channel-edit-page>
        )
    } else if (page === 'info') {
        return (
            <channel-edit-page>
                <ChannelEditInfo data={data} />
            </channel-edit-page>
        )
    }
    redirect(`/${process.env.STUDIO_URL_PREFIX}/edit?t=sections`);
}

export default ChannelEditPage;