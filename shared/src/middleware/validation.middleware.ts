import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  return { valid: true };
};

export const validateRequiredFields = (fields: Record<string, any>, requiredFields: string[]) => {
  const missingFields = requiredFields.filter(field => !fields[field]);
  if (missingFields.length > 0) {
    throw new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400);
  }
};

export const validatePagination = (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  if (page < 1) {
    throw new AppError('Page must be greater than 0', 400);
  }

  if (limit < 1 || limit > 100) {
    throw new AppError('Limit must be between 1 and 100', 400);
  }

  req.query.page = page.toString();
  req.query.limit = limit.toString();

  next();
};
