import { mongodbClient } from '@/lib/db-connectors/mongo-db';
import { ObjectId } from 'mongodb';
import { sendNotifications } from '../../apiHelpers';

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
  } catch (err) {
    return new Response('', {
      status: 500,
      statusText: 'Faild to send notification',
    });
  }
}
