import mongoose from 'mongoose';
import { config } from './env';

export let isUsingMongo = false;

export const connectDB = async (): Promise<boolean> => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    isUsingMongo = true;
    console.log('⚡ Connected to MongoDB database successfully');
    return true;
  } catch (error) {
    console.warn('⚠️ Could not connect to local MongoDB. Operating in High-Speed Zero-Gravity Memory Store mode.');
    isUsingMongo = false;
    return false;
  }
};
