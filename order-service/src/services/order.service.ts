import axios from 'axios';
import { Order } from '../models/order.model';
import { AppError, IOrder, IAddress, OrderStatus } from '@bestbuy/shared';

const CART_SERVICE_URL = process.env.CART_SERVICE_URL || 'http://localhost:3005';

export class OrderService {
  async createOrder(userId: string, shippingAddress: IAddress, paymentMethod: string, token: string): Promise<IOrder> {
    // Fetch cart from cart service
    const cart = await this.fetchCart(userId, token);

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new AppError('Cart is empty', 400);
    }

    // Create order
    const order = await Order.create({
      userId,
      items: cart.items,
      totalAmount: cart.totalPrice,
      status: 'pending',
      shippingAddress,
      paymentMethod,
    });

    // Clear cart after order creation
    await this.clearCart(userId, token);

    return order.toObject() as IOrder;
  }

  async getOrders(userId: string): Promise<IOrder[]> {
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
    return orders as IOrder[];
  }

  async getOrderById(orderId: string, userId: string): Promise<IOrder> {
    const order = await Order.findById(orderId).lean();

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.userId !== userId) {
      throw new AppError('Unauthorized', 403);
    }

    return order as IOrder;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<IOrder> {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order.toObject() as IOrder;
  }

  private async fetchCart(userId: string, token: string): Promise<any> {
    try {
      const response = await axios.get(`${CART_SERVICE_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      throw new AppError('Failed to fetch cart', 500);
    }
  }

  private async clearCart(userId: string, token: string): Promise<void> {
    try {
      await axios.delete(`${CART_SERVICE_URL}/api/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      // Log error but don't fail the order
    }
  }
}
