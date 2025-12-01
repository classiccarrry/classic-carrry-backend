import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    required: [true, 'Category image is required']
  },
  displayOrder: {
    type: Number,
    required: [true, 'Display order is required'],
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Generate slug from name before saving
categorySchema.pre('save', function(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Generate slug before insertMany
categorySchema.pre('insertMany', function(next, docs) {
  if (docs && docs.length) {
    docs.forEach(doc => {
      if (!doc.slug && doc.name) {
        doc.slug = doc.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
    });
  }
  next();
});

// Index for faster queries
categorySchema.index({ slug: 1, isActive: 1 });
categorySchema.index({ productType: 1, isActive: 1 });
categorySchema.index({ isFeatured: 1, displayOrder: 1 });

const Category = mongoose.model('Category', categorySchema);

export default Category;
