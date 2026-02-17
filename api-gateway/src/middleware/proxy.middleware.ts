import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { createLogger } from '@bestbuy/shared';

const logger = createLogger('Proxy');

export const createServiceProxy = (target: string, pathPrefix: string) => {
  const options: Options = {
    target,
    changeOrigin: true,
    pathRewrite: {
      [`^${pathPrefix}`]: '',
    },
    onProxyReq: (proxyReq, req) => {
      logger.debug(`Proxying ${req.method} ${req.url} to ${target}`);
    },
    onProxyRes: (proxyRes, req) => {
      logger.debug(`Response from ${target} - Status: ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
      logger.error(`Proxy error for ${req.url}:`, err.message);
      if (!res.headersSent) {
        (res as any).status(503).json({
          success: false,
          error: 'Service temporarily unavailable',
        });
      }
    },
  };

  return createProxyMiddleware(options);
};
