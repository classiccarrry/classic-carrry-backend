import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const { productType, isFeatured, showAll } = req.query;
    const query = {};

    // Only filter by isActive if showAll is not true (for admin panel)
    if (showAll !== 'true') {
      query.isActive = true;
    }

    if (productType) query.productType = productType;
    if (isFeatured === 'true') query.isFeatured = true;

    const categories = await Category.find(query).sort({ displayOrder: 1, name: 1 });
    
    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single category by ID or slug
// @route   GET /api/categories/:identifier
// @access  Public
export const getCategoryBySlug = async (req, res) => {
  try {
    const { identifier } = req.params;
    const searchParam = identifier;
    
    // Try to find by ID first (for admin panel), then by slug (for frontend)
    let category;
    if (searchParam.match(/^[0-9a-fA-F]{24}$/)) {
      // It's a valid MongoDB ObjectId
      category = await Category.findById(searchParam);
    } else {
      // It's a slug
      category = await Category.findOne({ 
        slug: searchParam,
        isActive: true 
      });
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Get products count for this category
    const productsCount = await Product.countDocuments({
      category: category._id,
      isActive: true
    });

    res.json({
      success: true,
      data: {
        ...category.toObject(),
        productsCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
  try {
    console.log('Creating category with data:', { 
      name: req.body.name, 
      hasImage: !!req.body.image,
      imageLength: req.body.image?.length 
    });
    
    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:identifier
// @access  Private/Admin
export const updateCategory = async (req, res) => {
  try {
    const existingCategory = await Category.findById(req.params.identifier);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // If image is being updated, delete the old one from Cloudinary
    if (req.body.image && req.body.image !== existingCategory.image) {
      await deleteFromCloudinary(existingCategory.image);
    }

    const category = await Category.findByIdAndUpdate(
      req.params.identifier,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:identifier
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.identifier);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has products
    const productsCount = await Product.countDocuments({ category: category._id });
    
    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${productsCount} products. Please reassign or delete products first.`
      });
    }

    // Delete image from Cloudinary
    await deleteFromCloudinary(category.image);

    await category.deleteOne();

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get featured categories with products
// @route   GET /api/categories/featured/with-products
// @access  Public
export const getFeaturedCategoriesWithProducts = async (req, res) => {
  try {
    const categories = await Category.find({ 
      isActive: true,
      isFeatured: true 
    }).sort({ displayOrder: 1 });

    const categoriesWithProducts = await Promise.all(
      categories.map(async (category) => {
        // Get only 4 featured/popular products for homepage
        const products = await Product.find({
          category: category._id,
          isActive: true
        })
        .limit(4)
        .sort({ isHot: -1, isFeatured: -1, createdAt: -1 });

        return {
          ...category.toObject(),
          products
        };
      })
    );

    res.json({
      success: true,
      count: categoriesWithProducts.length,
      data: categoriesWithProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
