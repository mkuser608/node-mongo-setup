import User from '../models/User.js';
import Role from '../models/Role.js';
import { HttpError } from '../utils/HttpError.js';

class UserService {
  static async createUser(userData) {
    const { name, email, phone, password, roleId } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      throw new HttpError(400, 'User with this email or phone already exists');
    }

    // Verify role exists
    const role = await Role.findById(roleId);
    if (!role) {
      throw new HttpError(400, 'Invalid role specified');
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: roleId
    });

    return await User.findById(user._id).populate('role', 'name description');
  }

  static async getAllUsers() {
    return await User.find()
      .populate('role', 'name description')
      .sort({ createdAt: -1 });
  }

  static async searchUsers(filters, page, limit) {
    const { name, email, roleId } = filters;
    const query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    if (email) {
      query.email = { $regex: email, $options: 'i' };
    }
    if (roleId) {
      query.role = roleId;
    }

    const skip = (page - 1) * limit;
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .populate('role', 'name description')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        limit
      }
    };
  }

  static async getUserById(userId) {
    const user = await User.findById(userId)
      .populate('role', 'name description permissions');

    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    return user;
  }

  static async updateUser(userId, updateData) {
    const { name, email, phone, password, roleId } = updateData;

    const user = await User.findById(userId);
    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    // Check for duplicate email or phone if being updated
    if (email || phone) {
      const query = { _id: { $ne: userId } };
      if (email) query.email = email;
      if (phone) query.phone = phone;

      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: userId } },
          { $or: [] }
        ]
      });

      if (email) existingUser.$and[1].$or.push({ email });
      if (phone) existingUser.$and[1].$or.push({ phone });

      const duplicate = await User.findOne(existingUser);
      if (duplicate) {
        throw new HttpError(400, 'Email or phone already exists');
      }
    }

    // Verify role if being updated
    if (roleId) {
      const role = await Role.findById(roleId);
      if (!role) {
        throw new HttpError(400, 'Invalid role specified');
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...updateData, ...(roleId && { role: roleId }) },
      { new: true, runValidators: true }
    ).populate('role', 'name description');

    return updatedUser;
  }

  static async deleteUser(userId, deletedBy) {
    const user = await User.findById(userId);
    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    await user.softDelete(deletedBy);
    return { message: 'User deleted successfully' };
  }
}

export default UserService;