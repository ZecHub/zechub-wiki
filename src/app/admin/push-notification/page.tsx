import { authOptions } from '@/auth.config';
import { Authentication } from '@/components/Authentication';
import { ListOfSubscribers } from '@/components/push-notification/ListOfSubscribers/ListOfSubscribers';
import { SubscriberWelcomeMessage } from '@/components/push-notification/welcome-message/SubscriberWelcomeMessage';
import { getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react';

export default async function PushNotificationPage() {
  const session = await getServerSession(authOptions); // TODO: check for user.role === 'admin'
  
  return (
    <div
      style={{
        display: 'flex',
        maxWidth: '720px',
        margin: 'auto',
        flexDirection: 'column',
      }}
    >
      <Authentication session={session}>
        <SubscriberWelcomeMessage />
        <ListOfSubscribers />
      </Authentication>
    </div>
  );
}
