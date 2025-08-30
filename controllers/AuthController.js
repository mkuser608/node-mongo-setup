import AuthService from '../services/AuthService.js';
import { success, error } from '../utils/httpResponse.js';
import { validateRegister, validateLogin } from '../utils/validation.js';

class AuthController {
  static async register(req, res, next) {
    try {
      const { error: validationError } = validateRegister(req.body);
      if (validationError) {
        return error(res, validationError.details[0].message, null, 400);
      }

      const result = await AuthService.register(req.body);
      return success(res, "User registered successfully", result, 201);
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { error: validationError } = validateLogin(req.body);
      if (validationError) {
        return error(res, validationError.details[0].message, null, 400);
      }

      const result = await AuthService.login(req.body);
      return success(res, "Login successful", result);
    } catch (err) {
      next(err);
    }
  }

  static async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await AuthService.refreshToken(refreshToken);
      return success(res, "Token refreshed successfully", result);
    } catch (err) {
      next(err);
    }
  }

  static async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      await AuthService.logout(refreshToken);
      return success(res, "Logout successful");
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;