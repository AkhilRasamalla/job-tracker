import { Router } from 'express';
import {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
} from '../controllers/applicationController';
import authMiddleware from '../middleware/auth';

// Create applications router — all routes require authentication
const router = Router();

// Apply auth middleware to all routes in this router
router.use(authMiddleware);

// GET /api/applications — list all applications for the user
router.get('/', getApplications);

// GET /api/applications/:id — get a single application
router.get('/:id', getApplicationById);

// POST /api/applications — create a new application
router.post('/', createApplication);

// PUT /api/applications/:id — update an existing application
router.put('/:id', updateApplication);

// DELETE /api/applications/:id — delete an application
router.delete('/:id', deleteApplication);

export default router;
