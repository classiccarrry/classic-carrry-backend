import express from 'express';
import {
  getAllHeroImages,
  getAllHeroImagesAdmin,
  getHeroImageById,
  createHeroImage,
  updateHeroImage,
  deleteHeroImage,
  toggleHeroImageStatus
} from '../controllers/heroImageController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllHeroImages);

// Admin routes
router.get('/admin', protect, admin, getAllHeroImagesAdmin);
router.get('/:id', protect, admin, getHeroImageById);
router.post('/', protect, admin, createHeroImage);
router.put('/:id', protect, admin, updateHeroImage);
router.delete('/:id', protect, admin, deleteHeroImage);
router.patch('/:id/toggle-status', protect, admin, toggleHeroImageStatus);

export default router;
