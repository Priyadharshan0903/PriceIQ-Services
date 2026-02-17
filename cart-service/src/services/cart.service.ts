import axios from 'axios';
import { Cart } from '../models/cart.model';
import { AppError, ICart } from '@bestbuy/shared';

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';

export class CartService {
  async getCart(userId: string): Promise<ICart | null> {
    const cart = await Cart.findOne({ userId }).lean();
    return cart as ICart | null;
  }

  async addItem(userId: string, productId: string, quantity: number): Promise<ICart> {
    // Fetch product details
    const product = await this.fetchProduct(productId);

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [], totalPrice: 0 });
    }

    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(item => item.productId === productId);

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        price: product.price,
      });
    }

    cart.totalPrice = this.calculateTotal(cart.items);
    await cart.save();

    return cart.toObject() as ICart;
  }

  async updateItem(userId: string, productId: string, quantity: number): Promise<ICart> {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    const itemIndex = cart.items.findIndex(item => item.productId === productId);

    if (itemIndex < 0) {
      throw new AppError('Item not found in cart', 404);
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    cart.totalPrice = this.calculateTotal(cart.items);
    await cart.save();

    return cart.toObject() as ICart;
  }

  async removeItem(userId: string, productId: string): Promise<ICart> {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    cart.items = cart.items.filter(item => item.productId !== productId);
    cart.totalPrice = this.calculateTotal(cart.items);
    await cart.save();

    return cart.toObject() as ICart;
  }

  async clearCart(userId: string): Promise<void> {
    await Cart.findOneAndUpdate(
      { userId },
      { items: [], totalPrice: 0 },
      { upsert: true }
    );
  }

  private calculateTotal(items: any[]): number {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  private async fetchProduct(productId: string): Promise<any> {
    try {
      const response = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/${productId}`);
      if (response.data.success) {
        return response.data.data;
      }
      throw new AppError('Product not found', 404);
    } catch (error) {
      throw new AppError('Product not found', 404);
    }
  }
}
