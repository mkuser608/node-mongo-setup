import express from 'express';
import UserController from '../controllers/UserController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', UserController.create);
router.get('/', UserController.getAll);
router.get('/search', UserController.search);
router.get('/:id', UserController.getById);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);

export default router;