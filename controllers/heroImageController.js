import HeroImage from '../models/HeroImage.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';

// Get all active hero images
export const getAllHeroImages = async (req, res) => {
  try {
    const heroImages = await HeroImage.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: heroImages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all hero images (admin)
export const getAllHeroImagesAdmin = async (req, res) => {
  try {
    const heroImages = await HeroImage.find().sort({ order: 1 });
    res.json({ success: true, data: heroImages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single hero image
export const getHeroImageById = async (req, res) => {
  try {
    const heroImage = await HeroImage.findById(req.params.id);
    if (!heroImage) {
      return res.status(404).json({ success: false, message: 'Hero image not found' });
    }
    res.json({ success: true, data: heroImage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create hero image
export const createHeroImage = async (req, res) => {
  try {
    const heroImage = new HeroImage(req.body);
    await heroImage.save();
    res.status(201).json({ success: true, data: heroImage });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update hero image
export const updateHeroImage = async (req, res) => {
  try {
    const existingHeroImage = await HeroImage.findById(req.params.id);
    if (!existingHeroImage) {
      return res.status(404).json({ success: false, message: 'Hero image not found' });
    }

    // If image is being updated, delete the old one from Cloudinary
    if (req.body.image && req.body.image !== existingHeroImage.image) {
      await deleteFromCloudinary(existingHeroImage.image);
    }

    const heroImage = await HeroImage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({ success: true, data: heroImage });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete hero image
export const deleteHeroImage = async (req, res) => {
  try {
    const heroImage = await HeroImage.findByIdAndDelete(req.params.id);
    if (!heroImage) {
      return res.status(404).json({ success: false, message: 'Hero image not found' });
    }
    
    // Delete image from Cloudinary
    await deleteFromCloudinary(heroImage.image);
    
    res.json({ success: true, message: 'Hero image deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle hero image status
export const toggleHeroImageStatus = async (req, res) => {
  try {
    const heroImage = await HeroImage.findById(req.params.id);
    if (!heroImage) {
      return res.status(404).json({ success: false, message: 'Hero image not found' });
    }
    heroImage.isActive = !heroImage.isActive;
    await heroImage.save();
    res.json({ success: true, data: heroImage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
