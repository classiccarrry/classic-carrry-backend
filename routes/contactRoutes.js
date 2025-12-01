import express from 'express';
import {
  submitContact,
  getAllContacts,
  getContact,
  updateContactStatus,
  replyToContact,
  deleteContact,
  getContactStats
} from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', submitContact);

// Admin routes
router.get('/', protect, admin, getAllContacts);
router.get('/stats', protect, admin, getContactStats);
router.get('/:id', protect, admin, getContact);
router.put('/:id/status', protect, admin, updateContactStatus);
router.post('/:id/reply', protect, admin, replyToContact);
router.delete('/:id', protect, admin, deleteContact);

export default router;
