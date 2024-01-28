import { ListOfSubscribers } from '@/components/push-notification/ListOfSubscribers/ListOfSubscribers';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default withPageAuthRequired(
  async function PushNotificationPage() {
    return <ListOfSubscribers />;
  },
  { returnTo: '/admin/push-notification' }
);
