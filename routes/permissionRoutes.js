import express from 'express';
import PermissionController from '../controllers/PermissionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', PermissionController.getAll);
router.get('/my-permissions', PermissionController.getMyPermissions);

export default router;