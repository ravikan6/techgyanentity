'use client';
import React from 'react'
import { useContext, memo } from 'react'
import { progressContext } from '../../layout';
// import { CreateChannel } from '@/components/setup/models';

const InterceptSetupChannel = ({ params }) => {
  let progress = useContext(progressContext);
  const path = params.route.join('/');

  return (
    <>
      {/* <CreateChannel context={progress} /> */}
      {path}
    </>
  )
}

export default memo(InterceptSetupChannel);