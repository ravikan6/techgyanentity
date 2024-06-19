import React from 'react'
import { auth } from '@/lib/auth';
import Account from '@/components/account/pages/account';

export async function generateMetadata({ params }) {
    const session = await auth();
    const route = params?.path;
    const path = decodeURIComponent(route[0]);


    if (route.length === 1) {
        if (path === `@${session?.user?.username}`) {
            return {
                title: `${process.env.APP_NAME} Account`,
                description: 'Manage your account settings, profile, and preferences.',
            }
        } else if (path === 'personal-information') {
            return {
                title: `Personal Information - ${process.env.APP_NAME} Account`,
                description: 'Update your personal information, such as your name, email address, and mobile number.',
            }
        } else if (path === 'data-privacy') {
            return {
                title: `Data & Privacy - ${process.env.APP_NAME} Account`,
                description: 'Manage your data privacy settings and preferences.',
            }
        } else if (path === 'security') {
            return {
                title: `Security - ${process.env.APP_NAME} Account`,
                description: 'Manage your account security settings and preferences.',
            }
        } else if (path === 'billing-subscription') {
            return {
                title: `Billing & Subscription - ${process.env.APP_NAME} Account`,
                description: 'Manage your billing and subscription settings and preferences.',
            }
        } else if (path === 'preferences-settings') {
            return {
                title: `Preferences & Settings - ${process.env.APP_NAME} Account`,
                description: 'Manage your account preferences and settings.',
            }
        }
    }

    return {
        title: `${process.env.APP_NAME} Account`,
        description: 'Manage your account settings, profile, and preferences.',
    }
};

const page = async ({ params }) => {
    const session = await auth();
    const route = params?.path;
    const path = route.length > 0 ? decodeURIComponent(route[0]) : null;

    if (route.length === 1) {
        if (path === `@${session?.user?.username}`) {
            return (
                <>
                    <Account session={session} />
                </>
            )
        } else if (path === 'personal-information') {

            return (
                <>
                    {/* <PersonalInfo session={session} user={user} /> */}
                </>
            )
        } else if (path === 'data-privacy') {
            return (
                <>
                    <div>page - {path}</div>
                </>
            )
        } else if (path === 'security') {
            return (
                <>
                    <div>page - {path}</div>
                </>
            )
        } else if (path === 'billing-subscription') {
            return (
                <>
                    <div>page - {path}</div>
                </>
            )
        } else if (path === 'preferences-settings') {
            return (
                <>
                    <div>page - {path}</div>
                </>
            )
        }
    }

    return (
        <>
            <div>page - {path}</div>
        </>
    )
}

export default page