"use client";
import Link from 'next/link';
import React from 'react'

const page = ({ params, }) => {
  const { path } = params;
  const croute = path[0];

  if (croute === 'community') {
    return <> The Community Page </>;
  }

  return (
    <div>page</div>
  )
}

export default page