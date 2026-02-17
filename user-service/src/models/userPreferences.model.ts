import mongoose, { Schema, Document } from 'mongoose';
import { IUserPreferences } from '@bestbuy/shared';

export interface IUserPreferencesDocument extends Omit<IUserPreferences, '_id'>, Document {}

const userPreferencesSchema = new Schema<IUserPreferencesDocument>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    favoriteCategories: [{ type: String }],
    favoriteBrands: [{ type: String }],
    priceRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 10000 },
    },
  },
  { timestamps: true }
);

export const UserPreferences = mongoose.model<IUserPreferencesDocument>('UserPreferences', userPreferencesSchema);
