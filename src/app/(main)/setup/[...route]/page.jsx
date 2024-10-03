import CreateAuthor from '@/components/creator/create';
import { notFound } from 'next/navigation';
import React from 'react'

const page = ({ params }) => {
  const route = params?.route;
  let path = route && route[0];

  if (path === 'author') {
    return (
      <>
        <CreateAuthor />
      </>
    )
  } else notFound();

}

export default page
