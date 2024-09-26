'use client';
import React, { useState } from 'react'
import { ProgressContext } from '@/app/(main)/@models/(...)setup/layout';

const SetUpWrapper = (props = {}) => {
    const [inProgress, setInProgress] = useState(false);
    const [title, setTitle] = useState('Setup');

    return (
        <ProgressContext.Provider value={{ inProgress, setInProgress, setTitle }}>
            {props.children}
        </ProgressContext.Provider>
    )
}

export { SetUpWrapper }