import axios from 'axios';
import { Comparison } from '../models/comparison.model';
import { AppError, IProduct, ComparisonResult, ComparisonDifference } from '@bestbuy/shared';

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';
const REVIEW_SERVICE_URL = process.env.REVIEW_SERVICE_URL || 'http://localhost:3003';

export class ComparisonService {
  async compareProducts(productIds: string[], userId?: string): Promise<ComparisonResult> {
    if (productIds.length < 2) {
      throw new AppError('At least 2 products are required for comparison', 400);
    }

    if (productIds.length > 5) {
      throw new AppError('Maximum 5 products can be compared at once', 400);
    }

    // Fetch products
    const products = await this.fetchProducts(productIds);

    if (products.length !== productIds.length) {
      throw new AppError('One or more products not found', 404);
    }

    // Calculate differences
    const differences = this.calculateDifferences(products);

    // Generate recommendation
    const recommendation = await this.generateRecommendation(products);

    // Save comparison history
    if (userId) {
      await Comparison.create({ userId, productIds });
    }

    return {
      products,
      differences,
      recommendation,
    };
  }

  async getComparisonHistory(userId: string, limit: number = 10): Promise<any[]> {
    const comparisons = await Comparison.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return comparisons;
  }

  private async fetchProducts(productIds: string[]): Promise<IProduct[]> {
    const products: IProduct[] = [];

    for (const id of productIds) {
      try {
        const response = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/${id}`);
        if (response.data.success) {
          products.push(response.data.data);
        }
      } catch (error) {
        // Skip products that cannot be fetched
      }
    }

    return products;
  }

  private calculateDifferences(products: IProduct[]): ComparisonDifference[] {
    const differences: ComparisonDifference[] = [];

    // Collect all unique specification keys
    const allSpecs = new Set<string>();
    products.forEach(product => {
      Object.keys(product.specifications).forEach(key => allSpecs.add(key));
    });

    // Add basic properties
    const basicProps = ['price', 'brand', 'category', 'stock'];

    // Compare specifications
    allSpecs.forEach(spec => {
      const values: Record<string, string | number> = {};
      products.forEach(product => {
        values[product._id] = product.specifications[spec] || 'N/A';
      });

      // Only add if there are differences
      const uniqueValues = new Set(Object.values(values));
      if (uniqueValues.size > 1) {
        differences.push({ spec, values });
      }
    });

    // Compare basic properties
    basicProps.forEach(prop => {
      const values: Record<string, string | number> = {};
      products.forEach(product => {
        values[product._id] = (product as any)[prop] || 'N/A';
      });

      const uniqueValues = new Set(Object.values(values));
      if (uniqueValues.size > 1) {
        differences.push({ spec: prop, values });
      }
    });

    return differences;
  }

  private async generateRecommendation(products: IProduct[]): Promise<ComparisonResult['recommendation']> {
    // Simple recommendation logic based on price-to-rating ratio
    const scores: { productId: string; score: number; reason: string }[] = [];

    for (const product of products) {
      try {
        // Fetch review stats
        const response = await axios.get(`${REVIEW_SERVICE_URL}/api/reviews/stats/${product._id}`);
        const stats = response.data.data;

        if (stats && stats.averageRating) {
          // Calculate score: (rating / price) * 1000
          const score = (stats.averageRating / product.price) * 1000;
          scores.push({
            productId: product._id,
            score,
            reason: `Best value with ${stats.averageRating.toFixed(1)}/5 rating at $${product.price}`,
          });
        } else {
          scores.push({
            productId: product._id,
            score: 0,
            reason: 'No reviews available',
          });
        }
      } catch (error) {
        scores.push({
          productId: product._id,
          score: 0,
          reason: 'Unable to calculate score',
        });
      }
    }

    // Find best product
    const best = scores.reduce((prev, current) => (prev.score > current.score ? prev : current));

    return best.score > 0 ? best : undefined;
  }
}
