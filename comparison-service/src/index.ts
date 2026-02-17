import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase, createLogger, errorHandler, notFoundHandler } from '@bestbuy/shared';
import comparisonRoutes from './routes/comparison.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27020/comparison_db';
const logger = createLogger('Comparison-Service');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'comparison-service',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', comparisonRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDatabase(MONGODB_URI, 'Comparison DB');

    app.listen(PORT, () => {
      logger.info(`Comparison Service running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
