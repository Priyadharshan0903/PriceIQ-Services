import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { validateEmail, validatePassword, validateRequiredFields } from '@bestbuy/shared';
import { AppError } from '@bestbuy/shared';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      // Validate required fields
      validateRequiredFields(req.body, ['email', 'password']);

      // Validate email format
      if (!validateEmail(email)) {
        throw new AppError('Invalid email format', 400);
      }

      // Validate password strength
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        throw new AppError(passwordValidation.message || 'Invalid password', 400);
      }

      const result = await authService.register(email, password);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      validateRequiredFields(req.body, ['email', 'password']);

      const result = await authService.login(email, password);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      validateRequiredFields(req.body, ['refreshToken']);

      const result = await authService.refresh(refreshToken);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, refreshToken } = req.body;

      validateRequiredFields(req.body, ['userId', 'refreshToken']);

      await authService.logout(userId, refreshToken);

      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError('No token provided', 401);
      }

      const token = authHeader.substring(7);
      const decoded = await authService.verify(token);

      res.json({
        success: true,
        data: decoded,
      });
    } catch (error) {
      next(error);
    }
  }
}
