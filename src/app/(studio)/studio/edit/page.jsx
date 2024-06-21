import { AuthorEditBranding, AuthorInfoUpdate, ChannelEditSections } from '@/components/studio/author';
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
    let authorInfo = await DecryptAuthorStudioCookie();
    if (!authorInfo) {
        redirect(`/${process.env.STUDIO_URL_PREFIX}/dashboard`);
    }
    if (page === 'sections') {
    } else if (page === 'branding') {
        data = authorInfo;
        data.logo = authorInfo?.image;
    } else if (page === 'info') {
        data = authorInfo;
    }

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
                <AuthorEditBranding data={data} />
            </channel-edit-page>
        )
    } else if (page === 'info') {
        return (
            <channel-edit-page>
                <AuthorInfoUpdate data={data} />
            </channel-edit-page>
        )
    }
    redirect(`/${process.env.STUDIO_URL_PREFIX}/edit?t=sections`);
}

export default ChannelEditPage;