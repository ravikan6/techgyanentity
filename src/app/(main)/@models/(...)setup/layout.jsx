'use client';
import React from 'react'
import { Suspense } from 'react';
import { useContext } from 'react'
import { progressContext } from '../layout';


const SetupInterceptLayout = ({ children }) => {
  let progress = useContext(progressContext);
  return (
    <>
      {/* <Suspense fallback={progress.setInProgress(true)}> */}
        {children}
      {/* </Suspense> */}
    </>
  )
}

export default SetupInterceptLayout