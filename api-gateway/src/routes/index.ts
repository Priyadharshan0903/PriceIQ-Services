import { Express } from 'express';
import { createServiceProxy } from '../middleware/proxy.middleware';
import { authRateLimiter } from '../middleware/rateLimit.middleware';
import { SERVICE_ROUTES } from '../config/services';

export const setupRoutes = (app: Express) => {
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      success: true,
      message: 'API Gateway is running',
      timestamp: new Date().toISOString(),
    });
  });

  // Auth routes with stricter rate limiting
  app.use('/api/auth/login', authRateLimiter);
  app.use('/api/auth/register', authRateLimiter);

  // Proxy routes to microservices
  Object.entries(SERVICE_ROUTES).forEach(([path, target]) => {
    app.use(path, createServiceProxy(target, path));
  });

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      error: 'Route not found',
    });
  });
};
