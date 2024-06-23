import { SetUpWrapper } from '@/components/Home/setup'
import React from 'react'

const layout = ({ children }) => {

    return (
        <SetUpWrapper >
            {children}
        </SetUpWrapper>
    )
}

export default layout
