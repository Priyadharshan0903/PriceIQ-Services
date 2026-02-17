import mongoose, { Schema, Document } from 'mongoose';
import { IUserProfile, IAddress } from '@bestbuy/shared';

export interface IUserProfileDocument extends Omit<IUserProfile, '_id'>, Document {}

const addressSchema = new Schema<IAddress>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
}, { _id: false });

const userProfileSchema = new Schema<IUserProfileDocument>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    addresses: [addressSchema],
  },
  { timestamps: true }
);

export const UserProfile = mongoose.model<IUserProfileDocument>('UserProfile', userProfileSchema);
