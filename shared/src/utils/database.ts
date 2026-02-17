import mongoose from 'mongoose';
import { createLogger } from './logger';

const logger = createLogger('Database');

export const connectDatabase = async (uri: string, dbName: string): Promise<void> => {
  try {
    await mongoose.connect(uri);
    logger.info(`Connected to ${dbName}`);
  } catch (error) {
    logger.error(`Failed to connect to ${dbName}:`, error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('Disconnected from database');
  } catch (error) {
    logger.error('Error disconnecting from database:', error);
  }
};

// Mongoose connection event handlers
mongoose.connection.on('connected', () => {
  logger.info('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  logger.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});
