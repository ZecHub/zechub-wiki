import { mongodbClient } from '@/lib/db-connectors/mongo-db';

import { headers } from 'next/headers';

import { getServerSessionConfig } from '@/lib/auth';

const mongo = {
  mongodbClient,
  db: mongodbClient.db('zechub-wiki'),
  collectionName: 'webpushSubscribers',
};

export async function GET(req: Request) {
  const session = await getServerSessionConfig();

  if (!session) {
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
}

export async function POST(req: Request, res: Response) {
  try {
    const doc = await req.json();
    if (doc !== undefined) {
      const webpushSubscribers = mongo.db.collection(mongo.collectionName);
      await webpushSubscribers.insertOne(doc);

      return new Response('', {
        status: 200,
        statusText: 'Ok',
      });
    }
  } catch (err) {
    return new Response('', {
      status: 500,
      statusText: 'Faild to save',
    });
  } finally {
    // mongo.mongodbClient.close();
  }
}

export async function DELETE(req: Request, res: Response) {
  try {
    //   const formData = await req.formData();
    const query = await req.json();
    console.log(query);

    const webpushSubscribers = mongo.db.collection(mongo.collectionName);
    const result = await webpushSubscribers.deleteOne({ _id: query.id });
    /* Print a message that indicates whether the operation deleted a
    document */
    if (result.deletedCount === 1) {
      console.log('Successfully deleted one document.');
    } else {
      console.log('No documents matched the query. Deleted 0 documents.');
    }

    return new Response('', {
      status: 200,
      statusText: 'Ok',
    });
  } catch (err) {
    return new Response('', {
      status: 301,
      statusText: 'Faild to delete',
    });
  } finally {
    // mongo.mongodbClient.close();
  }
}
