import Link from 'next/link';
import React from 'react'
import { redirect } from 'next/navigation';

const page = ({ params, }) => {
  const { path } = params;
  const croute = path[0];

  switch (croute) {
    case 'dashboard':
      return (
        <>
          <div>dashboard</div>
        </>
      );
    case 'content':
      return (
        <>
          <div>content</div>
        </>
      );
    case 'analytics':
      return (
        <>
          <div>analytics</div>
        </>
      );
    case 'monetization':
      return (
        <>
          <div>monetization</div>
        </>
      );
    case 'personalization':
      return (
        <>
          <div>personalization</div>
        </>
      );
    case 'settings':
      return (
        <>
          <div>settings</div>
        </>
      );
    default:
      return redirect(`/${process.env.STUDIO_URL_PREFIX}/dashboard`);
  }
}

export default page