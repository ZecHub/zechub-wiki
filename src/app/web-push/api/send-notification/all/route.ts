import { mongodbClient } from '@/lib/db-connectors/mongo-db';
import { sendNotifications } from '@/lib/push-notification/helpers';

const mongo = {
  mongodbClient,
  db: mongodbClient.db('zechub-wiki'),
  collectionName: 'webpushSubscribers',
};

export async function POST(req: Request, res: Response) {
  try {
    const webpushSubscribers = mongo.db.collection(mongo.collectionName);
    const cursor = webpushSubscribers.find({});

    const result = await cursor.toArray();
    cursor.close();

    if (result.length > 0) {
      await sendNotifications([...result]);

      return new Response('', {
        status: 200,
        statusText: 'Ok',
      });
    }
  } catch (err) {
    return new Response('', {
      status: 500,
      statusText: 'Faild to send',
    });
  }
}
