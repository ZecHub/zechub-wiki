import { MONGO_DB_CONNECTION_STRING_DEV, MONGO_DB_CONNECTION_STRING_PROD } from '@/config';
import {MongoClient} from 'mongodb'

const connectionString = process.env.NODE_ENV != 'production' ? MONGO_DB_CONNECTION_STRING_DEV :
MONGO_DB_CONNECTION_STRING_PROD;

export const mongodbClient = new MongoClient(connectionString);

