"use client";
import { DecryptAuthorStudioCookie } from '@/lib/actions/studio';
import { StudioContext, StudioWriterContext } from '@/lib/context';
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { useEffect } from 'react';
import { Button } from '@/components/rui';
import { usePathname } from 'next/navigation'

const StudioMainLayoutWrapper = ({ children, session, authorData }) => {
    const [data, setData] = useState({ data: authorData, page: 'expended' });
    const [loading, setLoading] = useState(false);

    return (
        <StudioContext.Provider value={{ data, setData, loading, setLoading }}>
            {children}
        </StudioContext.Provider>
    );
}

const StudioMainLayoutWrapperChild = ({ children, session }) => {
    const { data, setData } = useContext(StudioContext);
    const pathname = usePathname();

    useEffect(() => {
        if (session && session?.user) {
            DecryptAuthorStudioCookie().then((res) => {
                setData({ ...data, data: res });
            });
        }
    }, [session, pathname]);

    return (
        children
    );
}

const StudioPathLayoutWrapper = ({ children, path }) => {
    const context = React.useContext(StudioContext);

    useEffect(() => {
        context.setData({ ...context.data, page: path })
    }, [path]);

    return (
        children
    );
}

const StudioWriteLayoutWrapper = ({ children, article }) => {
    const { data, setData } = useContext(StudioContext);

    useEffect(() => {
        if (article && data?.data?.id) {
            if (data?.data?.id === article?.author?.id) {
                setData({ ...data, page: 'p', article: article })
            }
        }
    }, [article, data?.data?.id]);

    return (
        children
    );

}

const StudioWriteEditorWrapper = ({ children }) => {
    const [state, setState] = useState({ save: false, cancle: false, runner: null, onCancle: null });
    const [loading, setLoading] = useState(false);

    return (
        <StudioWriterContext.Provider value={{ state, setState, loading, setLoading }}>
            {children}
        </StudioWriterContext.Provider>
    );
}

export { StudioMainLayoutWrapper, StudioWriteLayoutWrapper, StudioMainLayoutWrapper as AuthorProvider, StudioPathLayoutWrapper, StudioWriteEditorWrapper }