import { AdminComp } from '@/components/Admin/AdminComp';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function AdminPage() {

  const session = await getServerSession(authOptions); // TODO: check for user.role === 'admin'

  if (!session) {
    return new Response('', {
      status: 401,
      statusText: 'You must be logged in.',
    });
  }
  return <AdminComp />;
}
