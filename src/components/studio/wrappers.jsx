"use client";
import { DecryptAuthorStudioCookie } from '@/lib/actions/studio';
import {  StudioContext, StudioWriterContext } from '@/lib/context';
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { useEffect } from 'react';
import { Button } from '@/components/rui';

const StudioMainLayoutWrapper = ({ children, authorData }) => {
    const [data, setData] = useState({ data: authorData, page: 'expended' });
    const [loading, setLoading] = useState(false);

    return (
        <StudioContext.Provider value={{ data, setData, loading, setLoading }}>
            {children}
        </StudioContext.Provider>
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
        console.log(article, '__________article');
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


export { StudioMainLayoutWrapper, StudioWriteLayoutWrapper, StudioMainLayoutWrapper as AuthorProvider, StudioPathLayoutWrapper }