import mongoose from 'mongoose';

const contactInfoSchema = new mongoose.Schema({
  email: String,
  phone: String,
  whatsapp: String,
  address: String,
  tiktok: String,
  instagram: String
}, { timestamps: true });

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['general', 'shipping', 'returns', 'payment', 'products'],
    default: 'general'
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const appearanceSettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Classic Carrry' },
  brandEmoji: { type: String, default: '✨' },
  tagline: { type: String, default: 'Premium Lifestyle Products' },
  showNewsletter: { type: Boolean, default: true },
  showSocialMedia: { type: Boolean, default: true }
}, { timestamps: true });

const generalSettingsSchema = new mongoose.Schema({
  currency: { type: String, default: 'PKR' },
  currencySymbol: { type: String, default: 'Rs' },
  shippingFee: { type: Number, default: 200 },
  freeShippingThreshold: { type: Number, default: 5000 },
  taxRate: { type: Number, default: 0 },
  orderPrefix: { type: String, default: 'CC' },
  enableCOD: { type: Boolean, default: true },
  enableOnlinePayment: { type: Boolean, default: false }
}, { timestamps: true });

export const ContactInfo = mongoose.model('ContactInfo', contactInfoSchema);
export const FAQ = mongoose.model('FAQ', faqSchema);
export const AppearanceSettings = mongoose.model('AppearanceSettings', appearanceSettingsSchema);
export const GeneralSettings = mongoose.model('GeneralSettings', generalSettingsSchema);
