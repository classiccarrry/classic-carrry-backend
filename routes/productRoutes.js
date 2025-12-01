import express from 'express';
import {
  getProducts,
  getProductById,
  getProductsByCategory,
  getHotProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  getCategories
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.get('/hot', getHotProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/categories/:productType', getCategories);

// Image upload endpoint
router.post('/upload', protect, admin, upload.single('image'), uploadProductImage);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;
