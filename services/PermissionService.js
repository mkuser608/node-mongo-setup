import Permission from '../models/Permission.js';
import User from '../models/User.js';
import { HttpError } from '../utils/HttpError.js';

class PermissionService {
  static async getAllPermissions() {
    return await Permission.find().sort({ resource: 1, action: 1 });
  }

  static async getUserPermissions(userId) {
    const user = await User.findById(userId)
      .populate({
        path: 'role',
        populate: {
          path: 'permissions',
          select: 'name description resource action'
        }
      });

    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role.name
      },
      permissions: user.role.permissions || []
    };
  }
}

export default PermissionService;