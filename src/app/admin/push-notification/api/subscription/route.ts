import { mongodbClient } from '@/lib/db-connectors/mongo-db';

import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

const mongo = {
  mongodbClient,
  db: mongodbClient.db('zechub-wiki'),
  collectionName: 'webpushSubscribers',
};

export const GET = withApiAuthRequired(async function pushNotificationApiRoute(
  req
) {
  const res = new NextResponse();
  const { user }: any = await getSession(req, res); // TODO: check for user.role === 'admin'

  if (!user) {
    return new Response('', {
      status: 401,
      statusText: 'You must be logged in.',
    });
  }

  const headerList = headers();
  let filterBy = headerList.get('X-Custom-Filter-By');
  filterBy = JSON.parse(filterBy!); // TODO: fitler return data by this

  try {
    const subscribers = mongo.db.collection(mongo.collectionName);
    const cursor = subscribers.find();
    const result = await cursor.toArray();

    const data = result.map((d) => {
      return {
        endpoint: d.sub.endpoint,
        expirationTime: d.sub.expirationTime,
        id: d._id,
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
});

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const webpushSubscribers = mongo.db.collection(mongo.collectionName);
    const parseedData={
      ...data,
      payload:[]
    }
    const doc = await webpushSubscribers.insertOne(parseedData);

    return new Response(String(doc.acknowledged), {
      status: 201,
      statusText: 'Ok',
    });
  } catch (err) {
    return new Response('', {
      status: 500,
      statusText: 'Faild to save',
    });
  }
}