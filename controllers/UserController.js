import UserService from '../services/UserService.js';
import { success, error } from '../utils/httpResponse.js';
import { validateCreateUser, validateUpdateUser } from '../utils/validation.js';

class UserController {
  static async create(req, res, next) {
    try {
      const { error: validationError } = validateCreateUser(req.body);
      if (validationError) {
        return error(res, validationError.details[0].message, null, 400);
      }

      const user = await UserService.createUser(req.body);
      return success(res, "User created successfully", user, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getAll(req, res, next) {
    try {
      const users = await UserService.getAllUsers();
      return success(res, "Users fetched successfully", users);
    } catch (err) {
      next(err);
    }
  }

  static async search(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      const result = await UserService.searchUsers(req.query, page, limit);
      return success(res, "Users fetched successfully", result);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const user = await UserService.getUserById(req.params.id);
      return success(res, "User fetched successfully", user);
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const { error: validationError } = validateUpdateUser(req.body);
      if (validationError) {
        return error(res, validationError.details[0].message, null, 400);
      }

      const user = await UserService.updateUser(req.params.id, req.body);
      return success(res, "User updated successfully", user);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await UserService.deleteUser(req.params.id, req.user.id);
      return success(res, "User deleted successfully");
    } catch (err) {
      next(err);
    }
  }
}

export default UserController;