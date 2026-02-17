import mongoose, { Schema, Document } from 'mongoose';
import { IComparison } from '@bestbuy/shared';

export interface IComparisonDocument extends Omit<IComparison, '_id'>, Document {}

const comparisonSchema = new Schema<IComparisonDocument>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    productIds: [{
      type: String,
      required: true,
    }],
  },
  {
    timestamps: true,
  }
);

comparisonSchema.index({ userId: 1, createdAt: -1 });

export const Comparison = mongoose.model<IComparisonDocument>('Comparison', comparisonSchema);
