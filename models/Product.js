import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Product ID is required'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required']
  },
  categoryName: {
    type: String
  },
  mainImage: {
    type: String,
    required: [true, 'Main product image is required']
  },
  images: [{
    type: String
  }],
  description: {
    type: String,
    default: ''
  },
  tag: {
    type: String,
    default: ''
  },
  colors: [{
    type: String
  }],
  sizes: [{
    type: String
  }],
  features: [{
    type: String
  }],
  specifications: {
    type: Map,
    of: String
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  productType: {
    type: String,
    default: 'general'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isHot: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Auto-populate categoryName before saving
productSchema.pre('save', async function(next) {
  if (this.isModified('category')) {
    try {
      const Category = mongoose.model('Category');
      const category = await Category.findById(this.category);
      if (category) {
        this.categoryName = category.name;
      }
    } catch (error) {
      console.error('Error populating category name:', error);
    }
  }
  next();
});

// Auto-populate categoryName before findOneAndUpdate
productSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();
  if (update.category || update.$set?.category) {
    try {
      const Category = mongoose.model('Category');
      const categoryId = update.category || update.$set?.category;
      const category = await Category.findById(categoryId);
      if (category) {
        if (update.$set) {
          update.$set.categoryName = category.name;
        } else {
          update.categoryName = category.name;
        }
      }
    } catch (error) {
      console.error('Error populating category name in update:', error);
    }
  }
  next();
});

// Index for faster queries
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ productType: 1 });
productSchema.index({ isHot: 1, isFeatured: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
