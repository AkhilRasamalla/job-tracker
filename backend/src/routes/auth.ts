import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import authMiddleware from '../middleware/auth';

// Create auth router
const router = Router();

// POST /api/auth/register — create a new user account
router.post('/register', register);

// POST /api/auth/login — authenticate and receive a token
router.post('/login', login);

// GET /api/auth/me — get current authenticated user (protected)
router.get('/me', authMiddleware, getMe);

export default router;
