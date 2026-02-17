import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { AppError, IProduct, ProductFilters, PaginatedResponse } from '@bestbuy/shared';

export class ProductService {
  async getProducts(
    filters: ProductFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<IProduct>> {
    const query: any = {};

    // Apply filters
    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.brand) {
      query.brand = filters.brand;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.price = {};
      if (filters.minPrice !== undefined) {
        query.price.$gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        query.price.$lte = filters.maxPrice;
      }
    }

    if (filters.searchQuery) {
      query.$text = { $search: filters.searchQuery };
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ]);

    return {
      data: products as IProduct[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getProductById(id: string): Promise<IProduct> {
    const product = await Product.findById(id).lean();

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product as IProduct;
  }

  async getProductsByIds(ids: string[]): Promise<IProduct[]> {
    const products = await Product.find({ _id: { $in: ids } }).lean();
    return products as IProduct[];
  }

  async searchProducts(query: string, page: number = 1, limit: number = 20): Promise<PaginatedResponse<IProduct>> {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find({ $text: { $search: query } })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments({ $text: { $search: query } }),
    ]);

    return {
      data: products as IProduct[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCategories(): Promise<any[]> {
    const categories = await Category.find().lean();
    return categories;
  }

  async getProductSpecifications(id: string): Promise<Record<string, string | number>> {
    const product = await Product.findById(id).select('specifications').lean();

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product.specifications;
  }

  async getBrands(): Promise<string[]> {
    const brands = await Product.distinct('brand');
    return brands.sort();
  }
}
