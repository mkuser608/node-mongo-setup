import Role from '../models/Role.js';
import Permission from '../models/Permission.js';
import { HttpError } from '../utils/HttpError.js';

class RoleService {
  static async createRole(roleData) {
    const { name, description } = roleData;

    // Check if role already exists
    const existingRole = await Role.findOne({ 
      name: name.toUpperCase() 
    });

    if (existingRole) {
      throw new HttpError(400, 'Role already exists');
    }

    const role = await Role.create({
      name: name.toUpperCase(),
      description
    });

    return role;
  }

  static async getAllRoles() {
    return await Role.find()
      .populate('permissions', 'name description')
      .sort({ createdAt: -1 });
  }

  static async searchRoles(filters, page, limit) {
    const { name } = filters;
    const query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const total = await Role.countDocuments(query);
    const roles = await Role.find(query)
      .populate('permissions', 'name description')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      roles,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        limit
      }
    };
  }

  static async getRoleById(roleId) {
    const role = await Role.findById(roleId)
      .populate('permissions', 'name description resource action');

    if (!role) {
      throw new HttpError(404, 'Role not found');
    }

    return role;
  }

  static async updateRole(roleId, updateData) {
    const { name, description } = updateData;

    const role = await Role.findById(roleId);
    if (!role) {
      throw new HttpError(404, 'Role not found');
    }

    // Check for duplicate name if being updated
    if (name) {
      const existingRole = await Role.findOne({
        name: name.toUpperCase(),
        _id: { $ne: roleId }
      });

      if (existingRole) {
        throw new HttpError(400, 'Role name already exists');
      }
    }

    const updatedRole = await Role.findByIdAndUpdate(
      roleId,
      { 
        ...(name && { name: name.toUpperCase() }),
        ...(description && { description })
      },
      { new: true, runValidators: true }
    ).populate('permissions', 'name description');

    return updatedRole;
  }

  static async deleteRole(roleId, deletedBy) {
    const role = await Role.findById(roleId);
    if (!role) {
      throw new HttpError(404, 'Role not found');
    }

    await role.softDelete(deletedBy);
    return { message: 'Role deleted successfully' };
  }

  static async setPermissions(roleId, permissionIds) {
    const role = await Role.findById(roleId);
    if (!role) {
      throw new HttpError(404, 'Role not found');
    }

    // Verify all permissions exist
    const permissions = await Permission.find({
      _id: { $in: permissionIds }
    });

    if (permissions.length !== permissionIds.length) {
      throw new HttpError(400, 'One or more permissions not found');
    }

    role.permissions = permissionIds;
    await role.save();

    return await Role.findById(roleId)
      .populate('permissions', 'name description resource action');
  }
}

export default RoleService;