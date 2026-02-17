// User & Auth Types
export interface IUser {
  _id: string;
  email: string;
  passwordHash: string;
  refreshTokens?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
}

// Product Types
export interface IProduct {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  images: string[];
  specifications: Record<string, string | number>;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory {
  _id: string;
  name: string;
  parentId?: string;
  createdAt: Date;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
}

// Review Types
export interface IReview {
  _id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  content: string;
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReviewStats {
  _id: string;
  productId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  updatedAt: Date;
}

// Cart Types
export interface ICartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface ICart {
  _id: string;
  userId: string;
  items: ICartItem[];
  totalPrice: number;
  updatedAt: Date;
}

// Order Types
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface IAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IOrder {
  _id: string;
  userId: string;
  items: ICartItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: IAddress;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

// User Profile & Preferences Types
export interface IUserProfile {
  _id: string;
  userId: string;
  name?: string;
  phone?: string;
  addresses: IAddress[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserPreferences {
  _id: string;
  userId: string;
  favoriteCategories: string[];
  favoriteBrands: string[];
  priceRange: {
    min: number;
    max: number;
  };
  updatedAt: Date;
}

// Comparison Types
export interface IComparison {
  _id: string;
  userId: string;
  productIds: string[];
  createdAt: Date;
}

export interface ComparisonDifference {
  spec: string;
  values: Record<string, string | number>;
}

export interface ComparisonResult {
  products: IProduct[];
  differences: ComparisonDifference[];
  recommendation?: {
    productId: string;
    reason: string;
    score: number;
  };
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Error Types
export interface ApiError {
  message: string;
  statusCode: number;
  code?: string;
  details?: Record<string, unknown>;
}
