import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Role from '../models/Role.js';
import { HttpError } from '../utils/HttpError.js';

class AuthService {
  static generateTokens(userId) {
    const accessToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const refreshToken = jwt.sign(
      { userId, type: 'refresh' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    return { accessToken, refreshToken };
  }

  static async register(userData) {
    const { name, email, phone, password, roleId } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    }).select('+password');

    if (existingUser) {
      throw new HttpError(400, 'User with this email or phone already exists');
    }

    // Verify role exists and is not super admin
    const role = await Role.findById(roleId);
    if (!role) {
      throw new HttpError(400, 'Invalid role specified');
    }

    // Prevent registration with super admin role
    if (role.name === 'SUPER_ADMIN') {
      throw new HttpError(403, 'Cannot register with super admin role');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: roleId
    });

    const tokens = this.generateTokens(user._id);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: role.name
      },
      ...tokens
    };
  }

  static async login(loginData) {
    const { email, phone, password } = loginData;

    // Find user by email or phone
    const query = email ? { email } : { phone };
    const user = await User.findOne(query)
      .select('+password')
      .populate('role', 'name description');

    if (!user) {
      throw new HttpError(401, 'Invalid credentials');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new HttpError(401, 'Invalid credentials');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const tokens = this.generateTokens(user._id);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      ...tokens
    };
  }

  static async refreshToken(refreshToken) {
    if (!refreshToken) {
      throw new HttpError(401, 'Refresh token required');
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      
      if (decoded.type !== 'refresh') {
        throw new HttpError(401, 'Invalid refresh token');
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new HttpError(401, 'User not found');
      }

      const tokens = this.generateTokens(user._id);
      return tokens;
    } catch (error) {
      throw new HttpError(401, 'Invalid refresh token');
    }
  }

  static async logout(refreshToken) {
    // In a production app, you might want to blacklist the token
    // For now, we'll just return success
    return { message: 'Logged out successfully' };
  }
}

export default AuthService;