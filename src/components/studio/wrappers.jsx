"use client";
import { DecryptAuthorStudioCookie } from '@/lib/actions/studio';
import { StCommunityContext, StudioContext, StudioWriterContext } from '@/lib/context';
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

const StudioWriteLayoutWrapper = ({ children, article }) => {
    const [data, setData] = useState({ article: article });

    return (
        <StudioWriterContext.Provider value={{ data, setData }}>
            {children}
        </StudioWriterContext.Provider>
    );

}


export { StudioMainLayoutWrapper, StudioWriteLayoutWrapper, StudioMainLayoutWrapper as AuthorProvider }