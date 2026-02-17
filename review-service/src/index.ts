import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase, createLogger, errorHandler, notFoundHandler } from '@bestbuy/shared';
import reviewRoutes from './routes/review.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27019/review_db';
const logger = createLogger('Review-Service');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'review-service',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api', reviewRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDatabase(MONGODB_URI, 'Review DB');

    app.listen(PORT, () => {
      logger.info(`Review Service running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
