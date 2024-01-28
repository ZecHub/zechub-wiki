import { mongodbClient } from '@/lib/db-connectors/mongo-db';
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

const mongo = {
  mongodbClient,
  db: mongodbClient.db('zechub-wiki'),
  collectionName: 'pushSubscribersWelcomMessage',
};

export const GET = withApiAuthRequired(
  async function pushSubscribersWelcomMessageApiRoute(req) {
    const res = new NextResponse();
    const { user }: any = await getSession(req, res); // TODO: check for user.role === 'admin'

    if (!user) {
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
);

export const POST = withApiAuthRequired(
  async function pushSubscribersWelcomMessageApiRoute(req) {
    const res = new NextResponse();
    const { user }: any = await getSession(req, res); // TODO: check for user.role === 'admin'

    if (!user) {
      return new Response('', {
        status: 401,
        statusText: 'Unauthorized',
      });
    }

    try {
      const doc = await req.json();

      const webpushSubscriberMessages = mongo.db.collection(
        mongo.collectionName
      );
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
);
