import { ListOfSubscribers } from '@/components/push-notification/ListOfSubscribers/ListOfSubscribers';
import { SubscriberWelcomeMessage } from '@/components/push-notification/welcome-message/SubscriberWelcomeMessage';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default withPageAuthRequired(
  async function PushNotificationPage() {
    return (
      <>
        <SubscriberWelcomeMessage />
        <ListOfSubscribers />;
      </>
    );
  },
  { returnTo: '/admin/push-notification' }
);
