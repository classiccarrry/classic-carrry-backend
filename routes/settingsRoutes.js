import express from 'express';
import {
  getContactInfo,
  updateContactInfo,
  getAllFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getAppearanceSettings,
  updateAppearanceSettings,
  getGeneralSettings,
  updateGeneralSettings
} from '../controllers/settingsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Contact Info Routes
router.get('/contact', getContactInfo);
router.put('/contact', protect, admin, updateContactInfo);

// FAQ Routes
router.get('/faqs', getAllFAQs);
router.get('/faqs/:id', getFAQById);
router.post('/faqs', protect, admin, createFAQ);
router.put('/faqs/:id', protect, admin, updateFAQ);
router.delete('/faqs/:id', protect, admin, deleteFAQ);

// Appearance Settings Routes
router.get('/appearance', getAppearanceSettings);
router.put('/appearance', protect, admin, updateAppearanceSettings);

// General Settings Routes
router.get('/general', getGeneralSettings);
router.put('/general', protect, admin, updateGeneralSettings);

export default router;
