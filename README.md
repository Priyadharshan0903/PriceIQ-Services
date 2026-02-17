[README.md](https://github.com/user-attachments/files/25354431/README.md)
# Best Buy Product Comparison & Review Platform

A comprehensive mobile application for comparing electronics and tech products, reading reviews, and making informed purchasing decisions.

## Project Overview

This platform addresses a critical customer pain point: making informed purchasing decisions when faced with multiple similar products. Users can:

- **Compare Products Side-by-Side**: Detailed spec-by-spec comparison with difference highlighting
- **Read Aggregated Reviews**: Comprehensive reviews with ratings and sentiment analysis
- **Smart Recommendations**: AI-powered recommendations based on user preferences
- **Seamless Shopping**: Browse, compare, and purchase all in one app

## Technology Stack

### Mobile App
- **React Native** with **Expo** (SDK 50+)
- **TypeScript** for type safety
- **React Navigation** for routing
- **React Query** for server state management
- **Zustand** for client state management
- **Axios** for HTTP requests

### Backend Microservices
- **Node.js** with **TypeScript**
- **Express.js** for REST APIs
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **Redis** for caching
- **Docker** & **Docker Compose** for containerization

## Project Structure

```
bestbuy-comparison-platform/
├── mobile/                          # React Native + Expo app
│   ├── src/
│   │   ├── screens/                 # Screen components
│   │   ├── components/              # Reusable UI components
│   │   ├── navigation/              # Navigation configuration
│   │   ├── services/                # API clients
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── utils/                   # Utility functions
│   │   ├── types/                   # TypeScript type definitions
│   │   └── assets/                  # Images, fonts, etc.
│   └── package.json
│
└── backend/                         # Node.js microservices
    ├── api-gateway/                 # API Gateway (port 3000)
    ├── auth-service/                # Authentication (port 3001)
    ├── product-service/             # Product catalog (port 3002)
    ├── review-service/              # Reviews & ratings (port 3003)
    ├── comparison-service/          # Product comparison (port 3004)
    ├── cart-service/                # Shopping cart (port 3005)
    ├── order-service/               # Order processing (port 3006)
    ├── user-service/                # User profiles (port 3007)
    ├── shared/                      # Shared types & utilities
    ├── scripts/                     # Utility scripts
    └── data/                        # Seed data
```

## Microservices Architecture

### Services Overview

1. **API Gateway** (Port 3000) - Single entry point, request routing
2. **Auth Service** (Port 3001) - JWT authentication, user registration/login
3. **Product Service** (Port 3002) - Product catalog, search, filters
4. **Review Service** (Port 3003) - Reviews, ratings, aggregation
5. **Comparison Service** (Port 3004) - Product comparison, recommendations
6. **Cart Service** (Port 3005) - Shopping cart management
7. **Order Service** (Port 3006) - Order processing
8. **User Service** (Port 3007) - User profiles, preferences

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker & Docker Compose
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Emulator

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies for all services:
```bash
# This will be automated with a script
npm run install:all
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configurations
```

4. Start all services with Docker Compose:
```bash
docker-compose up
```

5. Seed the database with sample data:
```bash
npm run seed
```

### Mobile App Setup

1. Navigate to mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Start the Expo development server:
```bash
npx expo start
```

4. Run on iOS or Android:
```bash
# iOS (Mac only)
npx expo start --ios

# Android
npx expo start --android

# Web
npx expo start --web
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - List products (with filters, pagination)
- `GET /api/products/:id` - Get product details
- `POST /api/products/search` - Advanced search

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/stats/:productId` - Get review statistics

### Comparison
- `POST /api/comparison/compare` - Compare products
- `POST /api/comparison/recommendations` - Get AI recommendations

### Cart
- `GET /api/cart/:userId` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/:userId` - Get user's orders

## Testing

### Backend Testing
```bash
# Test authentication
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Test products
curl http://localhost:3000/api/products
```

### Mobile Testing
1. Start Expo development server
2. Test on simulator/emulator
3. Verify authentication flow
4. Test product search and comparison
5. Test cart and checkout

## Key Features

### Smart Comparison Engine
- AI-powered recommendations based on spec analysis
- Highlight key differentiators between products
- Price-to-performance ratio calculator

### Review Aggregation
- Sentiment analysis on reviews
- Pros/cons extraction
- Verified purchase badges

### Personalization
- Recommendations based on past searches
- Customizable comparison criteria
- Saved comparisons and wishlists

### Performance
- Redis caching for product data
- Optimistic UI updates
- Image lazy loading

## Development

### Code Quality
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

### Git Workflow
```bash
git checkout -b feature/your-feature-name
# Make changes
git commit -m "feat: description of changes"
git push origin feature/your-feature-name
```

## License

MIT License - feel free to use this project for learning and portfolio purposes.

## Contact

For questions or feedback about this project, please open an issue on GitHub.
