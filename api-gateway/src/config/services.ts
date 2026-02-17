export const SERVICE_URLS = {
  AUTH: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  PRODUCT: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002',
  REVIEW: process.env.REVIEW_SERVICE_URL || 'http://localhost:3003',
  COMPARISON: process.env.COMPARISON_SERVICE_URL || 'http://localhost:3004',
  CART: process.env.CART_SERVICE_URL || 'http://localhost:3005',
  ORDER: process.env.ORDER_SERVICE_URL || 'http://localhost:3006',
  USER: process.env.USER_SERVICE_URL || 'http://localhost:3007',
};

export const SERVICE_ROUTES = {
  '/api/auth': SERVICE_URLS.AUTH,
  '/api/products': SERVICE_URLS.PRODUCT,
  '/api/reviews': SERVICE_URLS.REVIEW,
  '/api/comparison': SERVICE_URLS.COMPARISON,
  '/api/cart': SERVICE_URLS.CART,
  '/api/orders': SERVICE_URLS.ORDER,
  '/api/users': SERVICE_URLS.USER,
};
