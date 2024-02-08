import { authOptions } from '@/auth.config';
import { mongodbClient } from '@/lib/db-connectors/mongo-db';
import { getServerSession } from 'next-auth';
import { sendNotifications } from '../../apiHelpers';

const mongo = {
  mongodbClient,
  db: mongodbClient.db('zechub-wiki'),
  collectionName: 'webpushSubscribers',
};

export async function POST(req: Request, res: Response) {
  const session = await getServerSession(authOptions); // TODO: check for user.role === 'admin'

  if (!session) {
    return new Response('', {
      status: 401,
    });
  }
  try {
    const payload = req.json();

    // fetch from deb
    const webpushSubscribers = mongo.db.collection(mongo.collectionName);
    const cursor = webpushSubscribers.find({});

    const result = await cursor.toArray();
    // close connection
    cursor.close();

    if (result.length > 0) {
      await sendNotifications({ payload, subscribers: result as any });

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
