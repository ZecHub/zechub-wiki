'use server';

import { mongodbClient } from '@/lib/db-connectors/mongo-db';
import { formatString } from '@/lib/helpers';
import { promises as fs } from 'fs';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const schema = z.object({
  email: z.string({
    invalid_type_error: 'Invalid Email',
  }),
});

const mongo = {
  mongodbClient,
  db: mongodbClient.db('zechub-wiki'),
  collectionName: 'webpushSubscribersWelcomeMessage',
};

export type SubscriberWelcomeMessageType = {
  title: string;
  body: string;
  icon: string;
  image: string;
};

export async function handlerCreateSubscriberWelcomeMessage(
  formData: FormData
) {
  const schema = z.object({
    title: z.string().min(5),
    body: z.string().min(10),
    icon: z.string(),
    image: z.string(),
  });

  try {
    const d = schema.parse({
      title: formData.get('title'),
      body: formData.get('body'),
      icon: formData.get('icon'),
      image: formData.get('image'),
    });

    // const obj: Record<string, any> = {};

    // const decodedArr = decodeURIComponent(formData).split('&');

    // for (let i = 0; i < decodedArr.length; i++) {
    //   const [key, value] = decodedArr[i].split('=');
    //   if (value.startsWith('https' || 'http')) {
    //     obj[key] = value;
    //   } else {
    //     obj[key] = formatString.titleCase(value);
    //   }
    // }

    const webpushSubscribers = mongo.db.collection(mongo.collectionName);
    const res = await webpushSubscribers.insertOne(d);

    revalidatePath('/');
    return {
      data: {
        insertedId: JSON.stringify(res.insertedId),
      },
    };
  } catch (err) {
    console.error('handlerCreateSubscriberWelcomeMessage', err);
    return { data: 'Failed to save data.' };
  }
}

export async function getSubscriberWelcomeMessage(): Promise<{
  data: SubscriberWelcomeMessageType[] | string;
}> {
  try {
    const webpushSubscribers = mongo.db.collection(mongo.collectionName);
    const cursor = webpushSubscribers.find();

    const data = await cursor.toArray();

    const parseData: SubscriberWelcomeMessageType[] = data.map((d) => {
      return {
        title: d.title,
        body: d.body,
        id: d._id.toString(),
        icon: d.icon,
        image: d.image,
      };
    });

    return {
      data: parseData,
    };
  } catch (err) {
    console.error('getSubscriberWelcomeMessage', err);
    return { data: 'Failed to fetch data.' };
  }
}

const filePathForBannerMessage =
  process.cwd() + '/public/notification-data/data.json';

export async function saveBannerMessage(formData: any) {
  try {
    const obj: Record<string, any> = {};
    const decodedArr = decodeURIComponent(formData).split('&');

    for (let i = 0; i < decodedArr.length; i++) {
      const [key, value] = decodedArr[i].split('=');
      if (value.startsWith('https' || 'http')) {
        obj[key] = value;
      } else {
        obj[key] = formatString.titleCase(value);
      }
    }

    await fs.writeFile(filePathForBannerMessage, JSON.stringify(obj));
  } catch (err: any) {
    throw Error(err.message);
  }
}

export async function getBannerMessage() {
  try {
    return await fs.readFile(filePathForBannerMessage, {
      encoding: 'utf-8',
    });
  } catch (err: any) {
    throw Error(err.message);
  }
}
