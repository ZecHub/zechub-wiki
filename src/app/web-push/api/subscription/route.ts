

import { mongodbClient } from '@/lib/db-connectors/mongo-db';

const mongo = {
  mongodbClient,
  db: mongodbClient.db('zechub-wiki'),
  collectionName: 'webpushSubscribers',
};

export async function GET(req: Request) {
  try {
    const subscribers = mongo.db.collection(mongo.collectionName);
    const cursor = subscribers.find();
    const result = await cursor.toArray();

    return Response.json({ data: result });
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
    //   const formData = await req.formData();
    const doc = await req.json();

    const webpushSubscribers = mongo.db.collection(mongo.collectionName);
    await webpushSubscribers.insertOne(doc);

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

export async function DELETE(req: Request, res: Response) {
  try {
    //   const formData = await req.formData();
    const query = await req.json();
    console.log(query);

    const webpushSubscribers = mongo.db.collection(mongo.collectionName);
    const result = await webpushSubscribers.deleteOne({_id: query.id});
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
