import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

const AccountPage = async () => {
  const session = await auth();
  if (!session) return redirect('/auth/v2/signin');
  return redirect(`/account/@${session?.user?.username}`);
};

export default AccountPage;