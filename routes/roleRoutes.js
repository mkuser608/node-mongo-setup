import express from 'express';
import RoleController from '../controllers/RoleController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', RoleController.create);
router.get('/', RoleController.getAll);
router.get('/search', RoleController.search);
router.get('/:id', RoleController.getById);
router.put('/:id', RoleController.update);
router.delete('/:id', RoleController.delete);
router.post('/:id/permissions', RoleController.setPermissions);

export default router;