import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface CachedMongoose {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

let cached = (global as { mongoose?: CachedMongoose }).mongoose ?? { conn: null, promise: null };

if (!cached) {
  cached = (global as { mongoose?: CachedMongoose }).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose.connection).catch((error) => {
      console.error('MongoDB connection error:', error);
      throw new Error('Failed to connect to MongoDB');
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
