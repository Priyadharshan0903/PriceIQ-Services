import { Review } from '../models/review.model';
import { ReviewStats } from '../models/reviewStats.model';
import { AppError, IReview, IReviewStats } from '@bestbuy/shared';

export class ReviewService {
  async getReviewsByProduct(
    productId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ reviews: IReview[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({ productId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Review.countDocuments({ productId }),
    ]);

    return {
      reviews: reviews as IReview[],
      total,
      page,
      limit,
    };
  }

  async createReview(
    productId: string,
    userId: string,
    rating: number,
    title: string,
    content: string
  ): Promise<IReview> {
    // Validate rating
    if (rating < 1 || rating > 5) {
      throw new AppError('Rating must be between 1 and 5', 400);
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      throw new AppError('You have already reviewed this product', 409);
    }

    // Create review
    const review = await Review.create({
      productId,
      userId,
      rating,
      title,
      content,
      helpful: 0,
    });

    // Update review stats
    await this.updateReviewStats(productId);

    return review.toObject() as IReview;
  }

  async updateReview(
    reviewId: string,
    userId: string,
    rating?: number,
    title?: string,
    content?: string
  ): Promise<IReview> {
    const review = await Review.findById(reviewId);

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    if (review.userId !== userId) {
      throw new AppError('Unauthorized', 403);
    }

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        throw new AppError('Rating must be between 1 and 5', 400);
      }
      review.rating = rating;
    }

    if (title !== undefined) {
      review.title = title;
    }

    if (content !== undefined) {
      review.content = content;
    }

    await review.save();

    // Update review stats
    await this.updateReviewStats(review.productId);

    return review.toObject() as IReview;
  }

  async deleteReview(reviewId: string, userId: string): Promise<void> {
    const review = await Review.findById(reviewId);

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    if (review.userId !== userId) {
      throw new AppError('Unauthorized', 403);
    }

    const productId = review.productId;
    await Review.deleteOne({ _id: reviewId });

    // Update review stats
    await this.updateReviewStats(productId);
  }

  async getReviewStats(productId: string): Promise<IReviewStats | null> {
    const stats = await ReviewStats.findOne({ productId }).lean();
    return stats as IReviewStats | null;
  }

  async markHelpful(reviewId: string): Promise<IReview> {
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpful: 1 } },
      { new: true }
    );

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    return review.toObject() as IReview;
  }

  private async updateReviewStats(productId: string): Promise<void> {
    const reviews = await Review.find({ productId });

    if (reviews.length === 0) {
      await ReviewStats.deleteOne({ productId });
      return;
    }

    const totalReviews = reviews.length;
    const sumRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = sumRatings / totalReviews;

    const ratingDistribution = {
      1: reviews.filter(r => r.rating === 1).length,
      2: reviews.filter(r => r.rating === 2).length,
      3: reviews.filter(r => r.rating === 3).length,
      4: reviews.filter(r => r.rating === 4).length,
      5: reviews.filter(r => r.rating === 5).length,
    };

    await ReviewStats.findOneAndUpdate(
      { productId },
      {
        productId,
        averageRating,
        totalReviews,
        ratingDistribution,
      },
      { upsert: true }
    );
  }
}
