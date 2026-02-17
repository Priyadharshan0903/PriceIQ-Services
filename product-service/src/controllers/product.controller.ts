import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { ProductFilters } from '@bestbuy/shared';

const productService = new ProductService();

export class ProductController {
  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const filters: ProductFilters = {
        category: req.query.category as string,
        brand: req.query.brand as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        searchQuery: req.query.search as string,
      };

      const result = await productService.getProducts(filters, page, limit);

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async searchProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { query } = req.body;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      if (!query) {
        return res.status(400).json({
          success: false,
          error: 'Search query is required',
        });
      }

      const result = await productService.searchProducts(query, page, limit);

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await productService.getCategories();

      res.json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductSpecifications(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const specifications = await productService.getProductSpecifications(id);

      res.json({
        success: true,
        data: specifications,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBrands(req: Request, res: Response, next: NextFunction) {
    try {
      const brands = await productService.getBrands();

      res.json({
        success: true,
        data: brands,
      });
    } catch (error) {
      next(error);
    }
  }
}
