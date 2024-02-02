import { ListOfSubscribers } from '@/components/push-notification/ListOfSubscribers/ListOfSubscribers';
import { SubscriberWelcomeMessage } from '@/components/push-notification/welcome-message/SubscriberWelcomeMessage';
import { getSession } from 'next-auth/react';

export default async function PushNotificationPage() {
  const session = getSession();

  return (
    <div style={{ display: 'flex', maxWidth: '720px', margin: 'auto', flexDirection: 'column' }}>
      {!session ? (
        <p>You do not hanve authorization to view</p>
      ) : (
        <>
          <SubscriberWelcomeMessage />
          <ListOfSubscribers />;
        </>
      )}
    </div>
  );
}
