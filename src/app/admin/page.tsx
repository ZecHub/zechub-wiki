import { AdminComp } from '@/components/Admin/AdminComp';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';

export default withPageAuthRequired(
  async function AdminPage() {
    const { user }:any = await getSession();
    return <AdminComp user={user} />;
  },
  { returnTo: '/admin' }
);