import { Router } from 'express';
import {
  getScripts,
  getScript,
  createScript,
  updateScript,
  deleteScript,
  searchScripts,
  getMyScripts,
  publishScript,
  unpublishScript,
  getScriptReviews,
  createReview,
} from './scripts.controller';
import {
  uploadScriptFile,
  uploadCoverImage,
  deleteScriptFile,
} from './upload.controller';
import {
  requestPerusal,
  downloadPerusal,
  getMyPerusalRequests,
} from './perusal.controller';
import { validate, createScriptSchema, updateScriptSchema } from '../../utils/validation';
import { authenticate, optionalAuth, requireRole } from '../../middleware/auth';
import { uploadScript, uploadCoverImage as uploadCoverMiddleware } from '../../middleware/upload';
import { readRateLimiter, writeRateLimiter, uploadRateLimiter } from '../../middleware/rateLimiter';
import { cache, invalidateCache, cacheKeyGenerators } from '../../middleware/cache';

const router = Router();

// Public routes with read rate limiting and caching
router.get('/', readRateLimiter, optionalAuth, cache({ ttl: 300, keyGenerator: cacheKeyGenerators.withQuery('scripts') }), getScripts);
router.get('/search', readRateLimiter, optionalAuth, cache({ ttl: 300, keyGenerator: cacheKeyGenerators.withQuery('scripts:search') }), searchScripts);
router.get('/:id', readRateLimiter, optionalAuth, cache({ ttl: 600, keyGenerator: cacheKeyGenerators.resource('script', 'id') }), getScript);
router.get('/:id/reviews', readRateLimiter, optionalAuth, cache({ ttl: 300, keyGenerator: cacheKeyGenerators.resource('script:reviews', 'id') }), getScriptReviews);

// Protected routes - playwrights only
router.get('/my/scripts', readRateLimiter, authenticate, requireRole('playwright'), getMyScripts);
router.post('/', writeRateLimiter, authenticate, requireRole('playwright'), validate(createScriptSchema), createScript, invalidateCache(['scripts:*']));
router.put('/:id', writeRateLimiter, authenticate, requireRole('playwright'), updateScript, invalidateCache(['scripts:*', 'script:*']));
router.delete('/:id', writeRateLimiter, authenticate, requireRole('playwright'), deleteScript, invalidateCache(['scripts:*', 'script:*']));
router.post('/:id/publish', writeRateLimiter, authenticate, requireRole('playwright'), publishScript, invalidateCache(['scripts:*', 'script:*']));
router.post('/:id/unpublish', writeRateLimiter, authenticate, requireRole('playwright'), unpublishScript, invalidateCache(['scripts:*', 'script:*']));

// File upload routes - playwrights only
router.post('/:id/upload', uploadRateLimiter, authenticate, requireRole('playwright'), uploadScript, uploadScriptFile);
router.post('/:id/cover', uploadRateLimiter, authenticate, requireRole('playwright'), uploadCoverMiddleware, uploadCoverImage);
router.delete('/:id/file', writeRateLimiter, authenticate, requireRole('playwright'), deleteScriptFile);

// Protected routes - theater companies only
router.post('/:id/reviews', writeRateLimiter, authenticate, requireRole('theater_company'), createReview);

// Perusal routes - theater companies only
router.post('/:id/perusal', writeRateLimiter, authenticate, requireRole('theater_company'), requestPerusal);
router.get('/perusal/:requestId/download', readRateLimiter, authenticate, requireRole('theater_company'), downloadPerusal);
router.get('/my/perusal-requests', readRateLimiter, authenticate, requireRole('theater_company'), getMyPerusalRequests);

export default router;