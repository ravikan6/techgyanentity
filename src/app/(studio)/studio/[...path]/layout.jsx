'use client';
import { StudioContext } from '@/lib/context';
import React, { useContext, useEffect, useMemo, useState } from 'react';

const StudioExpendedLayout = ({ children, params }) => {
    const { path } = params;
    const croute = path[0];
    const context = useContext(StudioContext);

    useMemo(() => {
        context.setData({ ...context?.data, page: decodeURIComponent(croute), data: {} })
    }, [path]);

    return children;
}

export default StudioExpendedLayout;