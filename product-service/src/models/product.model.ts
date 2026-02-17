import mongoose, { Schema, Document } from 'mongoose';
import { IProduct } from '@bestbuy/shared';

export interface IProductDocument extends Omit<IProduct, '_id'>, Document {}

const productSchema = new Schema<IProductDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    images: [{
      type: String,
    }],
    specifications: {
      type: Schema.Types.Mixed,
      default: {},
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
productSchema.index({ name: 'text', brand: 'text', category: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });

export const Product = mongoose.model<IProductDocument>('Product', productSchema);
