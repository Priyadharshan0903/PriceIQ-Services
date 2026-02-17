import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { AppError, AuthResponse, AuthTokenPayload } from '@bestbuy/shared';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

export class AuthService {
  async register(email: string, password: string): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('User already exists', 409);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      passwordHash,
      refreshTokens: [],
    });

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens(user._id.toString(), email);

    // Save refresh token
    user.refreshTokens?.push(refreshToken);
    await user.save();

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens(user._id.toString(), email);

    // Save refresh token
    user.refreshTokens?.push(refreshToken);
    await user.save();

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, JWT_SECRET) as AuthTokenPayload;

      // Find user and check if refresh token exists
      const user = await User.findById(decoded.userId);
      if (!user || !user.refreshTokens?.includes(refreshToken)) {
        throw new AppError('Invalid refresh token', 401);
      }

      // Remove old refresh token
      user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);

      // Generate new tokens
      const tokens = this.generateTokens(user._id.toString(), user.email);

      // Save new refresh token
      user.refreshTokens.push(tokens.refreshToken);
      await user.save();

      return tokens;
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    const user = await User.findById(userId);
    if (user) {
      user.refreshTokens = user.refreshTokens?.filter(t => t !== refreshToken) || [];
      await user.save();
    }
  }

  async verify(token: string): Promise<AuthTokenPayload> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
      return decoded;
    } catch (error) {
      throw new AppError('Invalid token', 401);
    }
  }

  private generateTokens(userId: string, email: string) {
    const payload: AuthTokenPayload = { userId, email };

    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
  }
}
