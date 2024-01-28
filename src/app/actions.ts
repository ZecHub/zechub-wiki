'use server';

import { PUSH_NOTIFICATION_API } from "@/config";

export async function handlerCreateSubscriberWelcomeMessage(
  formData: FormData
) {
  'use server';

  console.log('formData: ', formData);
}

async function getSubscriberWelcomeMessage() {
  console.log('YES: ', PUSH_NOTIFICATION_API.url.subscriptionWelcomeMsgs);

  // // TODO: fetch welcome message to subscribers
  try {
    const res = await fetch(PUSH_NOTIFICATION_API.url.subscriptionWelcomeMsgs, {
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    return res.json();
  } catch (err) {
    throw err;
  }
}
