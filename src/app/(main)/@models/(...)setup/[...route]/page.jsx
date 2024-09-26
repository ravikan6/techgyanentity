'use client';
import React from 'react'
import { useContext, memo } from 'react'
import { notFound } from 'next/navigation';
import CreateAuthor from '@/components/author/create';
import { ProgressContext } from '../layout';

const InterceptSetupPage = ({ params }) => {
  let progress = useContext(ProgressContext);
  const route = params?.route;
  let path = route && route[0];

  progress.setTitle('Create Author');

  if (path === 'author') {
    return (
      <>
        <div className='max-w-96'>
          <CreateAuthor modern={false} context={progress} />
        </div>
      </>
    )
  } else notFound();

}

export default memo(InterceptSetupPage);