import RoleService from '../services/RoleService.js';
import { success, error } from '../utils/httpResponse.js';
import { validateCreateRole, validateUpdateRole, validateSetPermissions } from '../utils/validation.js';

class RoleController {
  static async create(req, res, next) {
    try {
      const { error: validationError } = validateCreateRole(req.body);
      if (validationError) {
        return error(res, validationError.details[0].message, null, 400);
      }

      const role = await RoleService.createRole(req.body);
      return success(res, "Role created successfully", role, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getAll(req, res, next) {
    try {
      const roles = await RoleService.getAllRoles();
      return success(res, "Roles fetched successfully", roles);
    } catch (err) {
      next(err);
    }
  }

  static async search(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      const result = await RoleService.searchRoles(req.query, page, limit);
      return success(res, "Roles fetched successfully", result);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const role = await RoleService.getRoleById(req.params.id);
      return success(res, "Role fetched successfully", role);
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const { error: validationError } = validateUpdateRole(req.body);
      if (validationError) {
        return error(res, validationError.details[0].message, null, 400);
      }

      const role = await RoleService.updateRole(req.params.id, req.body);
      return success(res, "Role updated successfully", role);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await RoleService.deleteRole(req.params.id, req.user.id);
      return success(res, "Role deleted successfully");
    } catch (err) {
      next(err);
    }
  }

  static async setPermissions(req, res, next) {
    try {
      const { error: validationError } = validateSetPermissions(req.body);
      if (validationError) {
        return error(res, validationError.details[0].message, null, 400);
      }

      const role = await RoleService.setPermissions(req.params.id, req.body.permissionIds);
      return success(res, "Permissions updated successfully", role);
    } catch (err) {
      next(err);
    }
  }
}

export default RoleController;