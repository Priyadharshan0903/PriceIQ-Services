import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase, createLogger, errorHandler, notFoundHandler } from '@bestbuy/shared';
import productRoutes from './routes/product.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27018/product_db';
const logger = createLogger('Product-Service');

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
    service: 'product-service',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api', productRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDatabase(MONGODB_URI, 'Product DB');

    app.listen(PORT, () => {
      logger.info(`Product Service running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
