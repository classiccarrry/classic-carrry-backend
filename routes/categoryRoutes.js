import express from 'express';
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  getFeaturedCategoriesWithProducts
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(protect, admin, createCategory);

router.get('/featured/with-products', getFeaturedCategoriesWithProducts);

router.route('/:identifier')
  .get(getCategoryBySlug)
  .put(protect, admin, updateCategory)
  .delete(protect, admin, deleteCategory);

export default router;
