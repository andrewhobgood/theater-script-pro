import { Router } from 'express';
import * as adminController from './admin.controller';
import { requireAdmin, enhancedAdminAuth, adminRateLimit } from './admin.middleware';
import { validateRequest } from '../../middleware/validation';
import { body, query, param } from 'express-validator';

const router = Router();

// Apply admin authentication to all routes
router.use(enhancedAdminAuth);

// User Management Routes
router.get(
  '/users',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('role').optional().isIn(['playwright', 'theater_company', 'admin']),
    query('status').optional().isIn(['active', 'suspended']),
    query('search').optional().isString().trim()
  ],
  validateRequest,
  adminController.listUsers
);

router.post(
  '/users/:userId/suspend',
  [
    param('userId').isUUID(),
    body('reason').notEmpty().isString().trim()
  ],
  validateRequest,
  adminRateLimit(5, 15), // 5 requests per 15 minutes
  adminController.suspendUser
);

router.post(
  '/users/:userId/activate',
  [
    param('userId').isUUID()
  ],
  validateRequest,
  adminRateLimit(5, 15),
  adminController.activateUser
);

router.put(
  '/users/:userId/role',
  [
    param('userId').isUUID(),
    body('role').isIn(['playwright', 'theater_company', 'admin'])
  ],
  validateRequest,
  adminRateLimit(3, 15), // 3 requests per 15 minutes for role changes
  adminController.updateUserRole
);

// Script Moderation Routes
router.get(
  '/scripts/pending',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validateRequest,
  adminController.listPendingScripts
);

router.post(
  '/scripts/:scriptId/approve',
  [
    param('scriptId').isUUID(),
    body('notes').optional().isString().trim()
  ],
  validateRequest,
  adminRateLimit(10, 15),
  adminController.approveScript
);

router.post(
  '/scripts/:scriptId/reject',
  [
    param('scriptId').isUUID(),
    body('reason').notEmpty().isString().trim(),
    body('notes').optional().isString().trim()
  ],
  validateRequest,
  adminRateLimit(10, 15),
  adminController.rejectScript
);

router.post(
  '/scripts/:scriptId/flag',
  [
    param('scriptId').isUUID(),
    body('reason').notEmpty().isString().trim(),
    body('severity').optional().isIn(['low', 'medium', 'high'])
  ],
  validateRequest,
  adminRateLimit(20, 15),
  adminController.flagScript
);

// Revenue Analytics Routes
router.get(
  '/analytics/dashboard',
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601()
  ],
  validateRequest,
  adminController.getDashboardStats
);

router.get(
  '/analytics/revenue/trends',
  [
    query('period').optional().isIn(['hourly', 'daily', 'weekly', 'monthly']),
    query('days').optional().isInt({ min: 1, max: 365 })
  ],
  validateRequest,
  adminController.getRevenueTrends
);

router.get(
  '/analytics/platform/metrics',
  validateRequest,
  adminController.getPlatformMetrics
);

export default router;