import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

const StudioPage = async () => {
  const session = await auth();;
  if (!session) return redirect('/auth/v2/signin');
  return redirect(`/${process.env.STUDIO_URL_PREFIX}/dashboard`);
};

export default StudioPage;