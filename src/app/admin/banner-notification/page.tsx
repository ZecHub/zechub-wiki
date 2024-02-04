import { saveBannerMessage } from '@/app/actions';
import { NotificationBannerForm } from '@/components/Notification/NotificationBannerForm/NotificationBannerForm';

export default function BannerNotificationPage() {
 
  return <NotificationBannerForm formAction={saveBannerMessage} />;
}
