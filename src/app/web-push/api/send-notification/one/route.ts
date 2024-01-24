import { mongodbClient } from '@/lib/db-connectors/mongo-db';
import { sendNotifications } from '@/lib/push-notification/helpers';

const mongo = {
  mongodbClient,
  db: mongodbClient.db('zechub-wiki'),
  collectionName: 'webpushSubscribers',
};

export async function POST(req: Request, res: Response) {
  try {
    const doc = await req.json();

    const webpushSubscribers = mongo.db.collection(mongo.collectionName);
    const cursor = webpushSubscribers.find({
      endpoint: doc.endpoint,
    });
    const result = await cursor.toArray();

    await sendNotifications([...result]);

    cursor.close();

    return new Response('', {
      status: 200,
      statusText: 'Ok',
    });
  } catch (err) {
    return new Response('', {
      status: 500,
      statusText: 'Faild to send',
    });
  }
}
