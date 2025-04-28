import { Router } from 'express';
import UserController from '../controllers/users.controllers';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Registration and Login Routes
router.post(
  '/register',
  UserController.registerValidation,
  UserController.createUser
);
router.post('/login', UserController.loginValidation, UserController.loginUser);

// Retrieve User Lists except logined user
router.get('/', authenticate, UserController.getUserList);

export default router;
