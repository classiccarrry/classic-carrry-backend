import express from 'express';
import { upload, cloudinary } from '../config/cloudinary.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Upload single product image
router.post('/product', protect, admin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: req.file.path,
        publicId: req.file.filename
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Upload multiple product images
router.post('/products', protect, admin, upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const images = req.files.map(file => ({
      url: file.path,
      publicId: file.filename
    }));
    
    res.json({
      success: true,
      message: 'Images uploaded successfully',
      data: {
        images,
        count: req.files.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Upload category image
router.post('/category', protect, admin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    res.json({
      success: true,
      message: 'Category image uploaded successfully',
      data: {
        url: req.file.path,
        publicId: req.file.filename
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Upload hero image
router.post('/hero', protect, admin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    res.json({
      success: true,
      message: 'Hero image uploaded successfully',
      data: {
        url: req.file.path,
        publicId: req.file.filename
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete image from Cloudinary
router.delete('/:publicId', protect, admin, async (req, res) => {
  try {
    const { publicId } = req.params;
    
    // Decode the publicId (it might be URL encoded)
    const decodedPublicId = decodeURIComponent(publicId);
    
    const result = await cloudinary.uploader.destroy(decodedPublicId);
    
    if (result.result === 'ok') {
      res.json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Image not found or already deleted'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
