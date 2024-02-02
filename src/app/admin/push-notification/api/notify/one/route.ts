import { mongodbClient } from '@/lib/db-connectors/mongo-db';

import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth/next';
import { sendNotifications } from '../../apiHelpers';
import { authOptions } from '@/auth.config';

const mongo = {
  mongodbClient,
  db: mongodbClient.db('zechub-wiki'),
  collectionName: 'webpushSubscribers',
};

type NotificationBody = {
  payload: {
    title: string;
    body: string;
    [index: string]: any;
  };
  sub: {
    endpoint: string;
    expirationTime: string;
    id: string;
    [index: string]: any;
  }[];
};
export async function POST(req: Request, res: Response) {
  const session = await getServerSession(authOptions); // TODO: check for user.role === 'admin'

  if (!session) {
    return new Response('', {
      status: 401,
    });
  }

  try {
    const body: NotificationBody = await req.json();
    const webpushSubscribers = mongo.db.collection(mongo.collectionName);
    const id = new ObjectId(body.sub[0].id);

    const cursor = webpushSubscribers.find({
      _id: id,
    });
    const res = await cursor.toArray();

    const updateResult = await webpushSubscribers.updateOne(
      { _id: id },
      {
        $push: { payload: body.payload },
      },
      {
        upsert: true,
      }
    );

    if (updateResult.acknowledged && updateResult.modifiedCount === 1) {
      await sendNotifications({
        payload: body.payload,
        subscribers: [res[0].sub],
      });
    }

    return new Response('', {
      status: 200,
      statusText: 'Ok',
    });
  } catch (err: any) {
    if (err.message.includes('MongoServerError')) {
      console.error({
        description: 'MongoServerError',
        data: err.message,
      });
      return new Response('', {
        status: 301,
        statusText: 'Not modified.',
      });
    }

    return new Response('', {
      status: 500,
    });
  }
}
