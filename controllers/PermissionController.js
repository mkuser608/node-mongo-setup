import PermissionService from '../services/PermissionService.js';
import { success } from '../utils/httpResponse.js';

class PermissionController {
  static async getAll(req, res, next) {
    try {
      const permissions = await PermissionService.getAllPermissions();
      return success(res, "Permissions fetched successfully", permissions);
    } catch (err) {
      next(err);
    }
  }

  static async getMyPermissions(req, res, next) {
    try {
      const permissions = await PermissionService.getUserPermissions(req.user.id);
      return success(res, "User permissions fetched successfully", permissions);
    } catch (err) {
      next(err);
    }
  }
}

export default PermissionController;