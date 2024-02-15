'use server';

import { mongodbClient } from '@/lib/db-connectors/mongo-db';
import { formatString } from '@/lib/helpers';
import { ObjectId } from 'mongodb';
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
  collectionName: {
    webpush: 'webpushSubscribersWelcomeMessage',
    toastBannerInfo: 'toastBannerInfo',
  },
};

export type SubscriberWelcomeMessageType = {
  id: string;
  title: string;
  body: string;
  icon?: string;
  image?: string;
};

export async function handlerCreateSubscriberWelcomeMessage(formData: any) {
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

    const webpushSubscribers = mongo.db.collection(
      mongo.collectionName.webpush
    );
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

export async function handlerUpdateSubscriberWelcomeMessage(data: any) {
  try {
    const parserdData = decodeURIComponent(data).split('Z');
    const doc: any = {};

    for (let i = 0; i < parserdData.length; i++) {
      const [key, value] = parserdData[i].split('=');
      doc[key] = value;
    }

    const webpushSubscribers = mongo.db.collection(
      mongo.collectionName.webpush
    );
    const docId = doc.id;

    delete doc.id;
    const res = await webpushSubscribers.updateOne(
      { _id: new ObjectId(docId) },
      { $set: doc }
    );

    // revalidatePath('/');
    return {
      data: {
        modifiedCount: JSON.stringify(res.modifiedCount),
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
    const webpushSubscribers = mongo.db.collection(
      mongo.collectionName.webpush
    );
    const cursor = webpushSubscribers.find();

    const data = await cursor.toArray();

    const parseData: SubscriberWelcomeMessageType[] = data.map((d) => {
      return {
        title: formatString.titleCase(d.title),
        body: formatString.titleCase(d.body),
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

export type BannerMessageType = {
  title: string;
  description: string;
  urlRedirectLink: string;
  buttonLable: string;
};

export async function saveBannerMessage(formData: any) {
  const schema = z.object({
    title: z.string().min(5),
    description: z.string().min(10),
    urlRedirectLink: z
      .string()
      .url({ message: 'URL field must start with https or http' }),
    buttonLable: z.string(),
  });

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

    // await fs.writeFile(filePathForBannerMessage, JSON.stringify(obj));

    const parsedData = schema.parse({
      title: obj['title'],
      description: obj['description'],
      urlRedirectLink: obj['link'],
      buttonLable: obj['send_btn_label'],
    });

    const toastBannerInfo = mongo.db.collection(
      mongo.collectionName.toastBannerInfo
    );
    const res = await toastBannerInfo.insertOne(parsedData);

    return {
      data: {
        insertedId: JSON.stringify(res.insertedId),
      },
    };
  } catch (err: any) {
    console.error(err);
    return { data: 'Failed to save data.' };
  }
}

export async function getBannerMessage() {
  try {
    const toastBannerInfo = mongo.db.collection(
      mongo.collectionName.toastBannerInfo
    );
    const cursor = toastBannerInfo.find();
    const data = await cursor.toArray();

    let bannerMsg: BannerMessageType[] = [];
    if (data.length > 0) {
      bannerMsg = data.map((d) => {
        return {
          // id: d._id.toString(),
          title: formatString.titleCase(d.title),
          description: formatString.titleCase(d.description),
          urlRedirectLink: d.urlRedirectLink,
          buttonLable: d.buttonLable,
        };
      });
    }

    return {
      data: bannerMsg,
    };
  } catch (err) {
    console.error('getSubscriberWelcomeMessage', err);
    return { data: 'Failed to fetch data.' };
  }
}
