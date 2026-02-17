import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase, createLogger, errorHandler, notFoundHandler } from '@bestbuy/shared';
import orderRoutes from './routes/order.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3006;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27022/order_db';
const logger = createLogger('Order-Service');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.get('/health', (req, res) => {
  res.json({ success: true, service: 'order-service', timestamp: new Date().toISOString() });
});

app.use('/api', orderRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDatabase(MONGODB_URI, 'Order DB');
    app.listen(PORT, () => {
      logger.info(`Order Service running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
