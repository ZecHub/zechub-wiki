import { authOptions } from '@/auth.config';
import { AdminComp } from '@/components/Admin/AdminComp';
import { Authentication } from '@/components/Authentication';
import { getServerSession } from 'next-auth';

export default async function AdminPage() {
  const session = await getServerSession(authOptions); // TODO: check for user.role === 'admin'

  return (
    <Authentication session={session}>
      <AdminComp />
    </Authentication>
  );
}
