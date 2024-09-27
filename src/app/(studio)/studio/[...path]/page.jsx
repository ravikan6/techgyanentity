import Link from 'next/link';
import React from 'react'
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { SetDynmicAuthor } from '@/components/studio/author/_edit-funcs';
import StudioContent from '@/components/studio/content';

const page = async ({ params, }) => {
  const { path } = params;
  const croute = encodeURIComponent(path[0]);
  const session = await auth();

  if (croute === 'dashboard') {
    if (path.length === 2) {
      const subroute = decodeURIComponent(path[1]);
      if (subroute.startsWith('@')) {
        let author = subroute.slice(1);
        // TODO: Fetch Author
        if (!author && author?.id) {
          return redirect(`/${process.env.STUDIO_URL_PREFIX}/dashboard`);
        }
        return (
          <SetDynmicAuthor author={author} />
        )
      }
      return redirect(`/${process.env.STUDIO_URL_PREFIX}/dashboard`);
    }
    return (
      <>
        <div>dashboard</div>
      </>
    );
  } else if (croute === 'content') {

    return (
      <>
        <StudioContent />
      </>
    );
  } else if (croute === 'analytics') {
    return (
      <>
        <div>analytics</div>
      </>
    );
  } else if (croute === 'monetization') {
    return (
      <>
        <div>monetization</div>
      </>
    );
  } else if (croute === 'personalization') {
    return (
      <>
        <div>personalization</div>
      </>
    );
  } else if (croute === 'settings') {
    return (
      <>
        <div>settings</div>
      </>
    );
  } else {
    return redirect(`/${process.env.STUDIO_URL_PREFIX}/dashboard`);
  }
}

export default page