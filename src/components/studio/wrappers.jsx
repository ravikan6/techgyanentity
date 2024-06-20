"use client";
import { DecryptChannelStudioCookie, DecryptAuthorStudioCookie } from '@/lib/actions/studio';
import { StCommunityContext, StudioContext } from '@/lib/context';
import React, { useCallback, useMemo, useState } from 'react'
import { useEffect } from 'react';
import { Button } from '@/components/rui';

const StudioMainLayoutWrapper = ({ children, session }) => {
    const [data, setData] = useState({ page: 'expended', data: {} });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (session) {
            const { user } = session;
            if (user) {
                DecryptAuthorStudioCookie().then(cookieData => {
                    setData({ ...data, data: { ...cookieData } });
                });
            }
        }
    }, [session]);

    return (
        <StudioContext.Provider value={{ data, setData, loading, setLoading }}>
            {children}
        </StudioContext.Provider>
    );
}

const StudioChannelLayoutWrapper = ({ children, cookieData }) => {
    const context = React.useContext(StudioContext);

    useEffect(() => {
        context.setData({ ...context.data, page: 'channel', data: { ...cookieData } })
    }, [cookieData]);

    return (
        children
    );
}

const StudioCommunitylLayoutWrapper = ({ children, cookieData }) => {
    const context = React.useContext(StudioContext);

    useEffect(() => {
        context.setData({ ...context.data, page: 'community', data: { ...cookieData } })
    }, [cookieData]);

    return (
        children
    );
}

const StudioChannelEditLayoutWrapper = ({ children }) => {
    const [save, setSave] = useState(false);
    const context = React.useContext(StudioContext);

    return (
        <StCommunityContext.Provider value={{ save, setSave }}>
            <div className='fixed right-4 !z-[1000]'>
                <Button disabled={save} onClick={() => setSave(true)} variant='outlined' color='ld' size='small' sx={{ px: 4 }} className="!bg-accent dark:!bg-accentDark">Save Changes</Button>
            </div>
            {children}
        </StCommunityContext.Provider>
    );
}

export { StudioMainLayoutWrapper, StudioChannelLayoutWrapper, StudioCommunitylLayoutWrapper, StudioChannelEditLayoutWrapper }