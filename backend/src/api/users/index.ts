import { Router } from 'express';
import { 
  getProfile, 
  updateProfile, 
  getPublicProfile, 
  searchUsers,
  getPlaywrights,
  getTheaterCompanies
} from './users.controller';
import { validate, updateProfileSchema } from '../../utils/validation';
import { authenticate, optionalAuth } from '../../middleware/auth';

const router = Router();

// Public routes
router.get('/playwrights', optionalAuth, getPlaywrights);
router.get('/theater-companies', optionalAuth, getTheaterCompanies);
router.get('/search', optionalAuth, searchUsers);
router.get('/:id/public', optionalAuth, getPublicProfile);

// Protected routes
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, validate(updateProfileSchema), updateProfile);

export default router;