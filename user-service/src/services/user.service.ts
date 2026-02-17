import { UserProfile } from '../models/userProfile.model';
import { UserPreferences } from '../models/userPreferences.model';
import { AppError, IUserProfile, IUserPreferences } from '@bestbuy/shared';

export class UserService {
  async getProfile(userId: string): Promise<IUserProfile | null> {
    const profile = await UserProfile.findOne({ userId }).lean();
    return profile as IUserProfile | null;
  }

  async updateProfile(userId: string, data: Partial<IUserProfile>): Promise<IUserProfile> {
    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { ...data, userId },
      { new: true, upsert: true }
    );

    return profile.toObject() as IUserProfile;
  }

  async getPreferences(userId: string): Promise<IUserPreferences | null> {
    const preferences = await UserPreferences.findOne({ userId }).lean();
    return preferences as IUserPreferences | null;
  }

  async updatePreferences(userId: string, data: Partial<IUserPreferences>): Promise<IUserPreferences> {
    const preferences = await UserPreferences.findOneAndUpdate(
      { userId },
      { ...data, userId },
      { new: true, upsert: true }
    );

    return preferences.toObject() as IUserPreferences;
  }
}
