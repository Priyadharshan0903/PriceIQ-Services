import mongoose, { Schema, Document } from 'mongoose';
import { IReviewStats } from '@bestbuy/shared';

export interface IReviewStatsDocument extends Omit<IReviewStats, '_id'>, Document {}

const reviewStatsSchema = new Schema<IReviewStatsDocument>(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    averageRating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      required: true,
      min: 0,
    },
    ratingDistribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

export const ReviewStats = mongoose.model<IReviewStatsDocument>('ReviewStats', reviewStatsSchema);
