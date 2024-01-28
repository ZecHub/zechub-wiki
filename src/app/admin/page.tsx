import { AdminComp } from '@/components/AdminComp';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';

export default withPageAuthRequired(
  async function AdminPage() {
    const { user } = await getSession();
    return <AdminComp user={user} />;
  },
  { returnTo: '/admin' }
);