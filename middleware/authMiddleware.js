import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { HttpError } from '../utils/HttpError.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new HttpError(401, 'Access token required');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId)
      .populate('role', 'name permissions');

    if (!user) {
      throw new HttpError(401, 'User not found');
    }

    if (!user.isActive) {
      throw new HttpError(401, 'User account is inactive');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new HttpError(401, 'Invalid token'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new HttpError(401, 'Token expired'));
    }
    next(error);
  }
};