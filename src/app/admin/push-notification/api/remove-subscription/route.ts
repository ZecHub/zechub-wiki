import { mongodbClient } from '@/lib/db-connectors/mongo-db';
import { logger } from '@/lib/helpers';

const mongo = {
  mongodbClient,
  db: mongodbClient.db('zechub-wiki'),
  collectionName: 'webpushSubscribers',
};

export async function DELETE(req: Request) {
  const query = await req.json();
  logger({ description: 'delete endpoint', data: query.payload, type: 'log' });
  try {
    const webpushSubscribers = mongo.db.collection(mongo.collectionName);
    const result = await webpushSubscribers.deleteOne({
      'sub.endpoint': query.payload.endpoint,
    });

    if (result.deletedCount == 1) {
      console.log('Successfully deleted one document.');
      return new Response(String(result.deletedCount), {
        status: 200,
        statusText: 'Ok',
      });
    } else {
      console.log('No documents matched the query. Deleted 0 documents.');
      return new Response('Deleted 0 documents.', {
        status: 304,
      });
    }
  } catch (err) {
    return new Response('', {
      status: 500,
      statusText: 'Faild to delete',
    });
  } finally {
    // mongo.mongodbClient.close();
  }
}
