import { authOptions } from '@/auth.config';
import { mongodbClient } from '@/lib/db-connectors/mongo-db';
import { getServerSession } from 'next-auth/next';

const mongo = {
  mongodbClient,
  db: mongodbClient.db('zechub-wiki'),
  collectionName: 'pushSubscribersWelcomMessage',
};

export async function GET(req: Request, res: Response) {
  const session = await getServerSession(authOptions); // TODO: check for user.role === 'admin'

  if (!session) {
    return new Response('', {
      status: 401,
      statusText: 'You must be logged in.',
    });
  }

  try {
    const res = mongo.db.collection(mongo.collectionName);
    const cursor = res.find();
    const msgs = await cursor.toArray();

    const data = msgs.map((msg) => {
      return {
        ...msg,
        id: msg._id,
      };
    });

    return Response.json({ data });
  } catch (err) {
    return new Response('', {
      status: 500,
      statusText: 'Fetch failed',
    });
  } finally {
    // mongo.mongodbClient.close();
  }
}

export async function POST(req: Request, res: Response) {
  const session = await getServerSession(authOptions); // TODO: check for user.role === 'admin'

  if (!session) {
    return new Response('', {
      status: 401,
      statusText: 'Unauthorized',
    });
  }

  try {
    const doc = await req.json();

    const webpushSubscriberMessages = mongo.db.collection(mongo.collectionName);
    await webpushSubscriberMessages.insertOne(doc);

    return new Response('', {
      status: 200,
      statusText: 'Ok',
    });
  } catch (err) {
    return new Response('', {
      status: 500,
      statusText: 'Faild to save',
    });
  } finally {
    // mongo.mongodbClient.close();
  }
}
