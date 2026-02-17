import mongoose, { Schema, Document } from 'mongoose';
import { ICart, ICartItem } from '@bestbuy/shared';

export interface ICartDocument extends Omit<ICart, '_id'>, Document {}

const cartItemSchema = new Schema<ICartItem>({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
}, { _id: false });

const cartSchema = new Schema<ICartDocument>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    items: [cartItemSchema],
    totalPrice: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const Cart = mongoose.model<ICartDocument>('Cart', cartSchema);
