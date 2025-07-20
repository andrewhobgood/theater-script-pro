import { Router } from 'express';
import {
  getLicenses,
  getLicense,
  createLicense,
  getMyLicenses,
  downloadScript,
  updatePerformanceDates,
} from './licenses.controller';
import { validate, createLicenseSchema } from '../../utils/validation';
import { authenticate, requireRole } from '../../middleware/auth';

const router = Router();

// Protected routes - theater companies
router.get('/my', authenticate, requireRole('theater_company'), getMyLicenses);
router.post('/', authenticate, requireRole('theater_company'), validate(createLicenseSchema), createLicense);
router.get('/:id', authenticate, getLicense);
router.get('/:id/download', authenticate, requireRole('theater_company'), downloadScript);
router.put('/:id/performance-dates', authenticate, requireRole('theater_company'), updatePerformanceDates);

// Protected routes - playwrights (view licenses for their scripts)
router.get('/playwright/licenses', authenticate, requireRole('playwright'), getLicenses);

export default router;