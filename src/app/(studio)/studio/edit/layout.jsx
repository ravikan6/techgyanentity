import React from 'react'
import { CreatorEditLayoutWrapper } from '@/components/studio/author';

const CreatorEditLayout = async ({ children }) => {
    return (
        <CreatorEditLayoutWrapper >
            {children}
        </CreatorEditLayoutWrapper>
    )
}

export default CreatorEditLayout;