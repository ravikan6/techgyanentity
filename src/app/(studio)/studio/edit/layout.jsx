import React from 'react'
import { AuthorEditLayoutWrapper } from '@/components/studio/author';

const ChannelEditLayout = async ({ children }) => {
    return (
        <AuthorEditLayoutWrapper >
            {children}
        </AuthorEditLayoutWrapper>
    )
}

export default ChannelEditLayout;