import mongoose, { Schema, Document } from 'mongoose';
import { ICategory } from '@bestbuy/shared';

export interface ICategoryDocument extends Omit<ICategory, '_id'>, Document {}

const categorySchema = new Schema<ICategoryDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    parentId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ name: 1 });
categorySchema.index({ parentId: 1 });

export const Category = mongoose.model<ICategoryDocument>('Category', categorySchema);
