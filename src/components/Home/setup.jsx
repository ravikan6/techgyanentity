'use client';
import React, { useState } from 'react'
import { progressContext } from '@/app/(main)/@models/layout';

const SetUpWrapper = (props = {}) => {
    const [inProgress, setInProgress] = useState(false);
    const [title, setTitle] = useState('Setup');

    return (
        <progressContext.Provider value={{ inProgress, setInProgress, setTitle }}>
            {props.children}
        </progressContext.Provider>
    )
}

export { SetUpWrapper }