import React from 'react'
import { ViewLayoutWrapper } from '@/components/post/wrappers';

const ViewLayout = ({ children }) => {

    return (
        <ViewLayoutWrapper>
            {children}
        </ViewLayoutWrapper>
    )
}

export default ViewLayout;