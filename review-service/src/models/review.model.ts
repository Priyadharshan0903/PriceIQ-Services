import mongoose, { Schema, Document } from 'mongoose';
import { IReview } from '@bestbuy/shared';

export interface IReviewDocument extends Omit<IReview, '_id'>, Document {}

const reviewSchema = new Schema<IReviewDocument>(
  {
    productId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    helpful: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ rating: 1 });

export const Review = mongoose.model<IReviewDocument>('Review', reviewSchema);
