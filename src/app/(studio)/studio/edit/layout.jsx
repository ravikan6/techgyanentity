import React from 'react'
import { ChannelEditLayoutWrapper } from '@/components/studio/channel';

const ChannelEditLayout = async ({ children }) => {
    return (
        <ChannelEditLayoutWrapper >
            {children}
        </ChannelEditLayoutWrapper>
    )
}

export default ChannelEditLayout;