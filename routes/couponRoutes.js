import express from 'express';
import {
  getAllCoupons,
  getCouponById,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
  applyCoupon,
  checkActiveCoupons
} from '../controllers/couponController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/check-active', checkActiveCoupons);
router.post('/validate', validateCoupon);
router.get('/validate/:code', validateCoupon);

// Admin routes
router.get('/', protect, admin, getAllCoupons);
router.get('/:id', protect, admin, getCouponById);
router.post('/', protect, admin, createCoupon);
router.put('/:id', protect, admin, updateCoupon);
router.delete('/:id', protect, admin, deleteCoupon);
router.patch('/:id/toggle', protect, admin, toggleCouponStatus);
router.post('/apply', protect, applyCoupon);

export default router;
