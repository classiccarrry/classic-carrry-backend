import { ContactInfo, FAQ } from '../models/Settings.js';

// ============ Contact Info ============

export const getContactInfo = async (req, res) => {
  try {
    let contactInfo = await ContactInfo.findOne();
    if (!contactInfo) {
      contactInfo = await ContactInfo.create({
        email: 'classiccarrry@gmail.com',
        phone: '+92 316 092 8206',
        whatsapp: '+92 316 092 8206',
        address: 'Pakistan',
        tiktok: '',
        instagram: ''
      });
    }
    res.json({ success: true, data: contactInfo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateContactInfo = async (req, res) => {
  try {
    let contactInfo = await ContactInfo.findOne();
    if (!contactInfo) {
      contactInfo = await ContactInfo.create(req.body);
    } else {
      contactInfo = await ContactInfo.findOneAndUpdate({}, req.body, { new: true });
    }
    res.json({ success: true, data: contactInfo });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ============ FAQs ============

export const getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFAQById = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    res.json({ success: true, data: faq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createFAQ = async (req, res) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json({ success: true, data: faq });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    res.json({ success: true, data: faq });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    res.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// ============ Appearance Settings ============

export const getAppearanceSettings = async (req, res) => {
  try {
    const { AppearanceSettings } = await import('../models/Settings.js');
    let settings = await AppearanceSettings.findOne();
    if (!settings) {
      settings = await AppearanceSettings.create({});
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAppearanceSettings = async (req, res) => {
  try {
    const { AppearanceSettings } = await import('../models/Settings.js');
    let settings = await AppearanceSettings.findOne();
    if (!settings) {
      settings = await AppearanceSettings.create(req.body);
    } else {
      settings = await AppearanceSettings.findOneAndUpdate({}, req.body, { new: true });
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ============ General Settings ============

export const getGeneralSettings = async (req, res) => {
  try {
    const { GeneralSettings } = await import('../models/Settings.js');
    let settings = await GeneralSettings.findOne();
    if (!settings) {
      settings = await GeneralSettings.create({});
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateGeneralSettings = async (req, res) => {
  try {
    const { GeneralSettings } = await import('../models/Settings.js');
    let settings = await GeneralSettings.findOne();
    if (!settings) {
      settings = await GeneralSettings.create(req.body);
    } else {
      settings = await GeneralSettings.findOneAndUpdate({}, req.body, { new: true });
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
