import mongoose, { Schema, Document } from 'mongoose';
import { IOrder, ICartItem, IAddress, OrderStatus } from '@bestbuy/shared';

export interface IOrderDocument extends Omit<IOrder, '_id'>, Document {}

const cartItemSchema = new Schema<ICartItem>({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
}, { _id: false });

const addressSchema = new Schema<IAddress>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
}, { _id: false });

const orderSchema = new Schema<IOrderDocument>(
  {
    userId: { type: String, required: true, index: true },
    items: [cartItemSchema],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    shippingAddress: { type: addressSchema, required: true },
    paymentMethod: { type: String, required: true },
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1, createdAt: -1 });

export const Order = mongoose.model<IOrderDocument>('Order', orderSchema);
