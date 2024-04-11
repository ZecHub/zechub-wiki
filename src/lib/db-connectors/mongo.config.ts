import { MongoClient, MongoClientOptions } from 'mongodb';
import { MONGO_DB_URI } from '../../config';

// Step  1: Extend the NodeJS.Global interface
interface CustomGlobal extends Global {
  _mongoClientPromise: Promise<MongoClient>;
}
//  Use a type assertion to tell TypeScript about your custom global object
declare const global: CustomGlobal;

if (!MONGO_DB_URI) {
  throw new Error('Invalid/Mission environment variables "MONGO_DB_URI"');
}

const uri = MONGO_DB_URI;
const options: MongoClientOptions = {
  monitorCommands: true,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global['_mongoClientPromise']) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }

  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
