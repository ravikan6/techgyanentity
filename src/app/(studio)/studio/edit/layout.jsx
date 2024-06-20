import React from 'react'
import { ChannelEditLayoutWrapper } from '@/components/studio/author';

const ChannelEditLayout = async ({ children }) => {
    return (
        <ChannelEditLayoutWrapper >
            {children}
        </ChannelEditLayoutWrapper>
    )
}

export default ChannelEditLayout;