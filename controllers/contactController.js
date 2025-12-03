import Contact from '../models/Contact.js';
import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
  // Use SendGrid (works on all hosting platforms)
  if (process.env.SENDGRID_API_KEY) {
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  }
  
  // Fallback to Gmail (local development only)
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Submit contact form
export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Create contact entry
    const contact = await Contact.create({
      name,
      email,
      subject,
      message
    });

    // Send confirmation email to user
    try {
      console.log('📧 Attempting to send email...');
      console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set ✓' : 'Missing ✗');
      console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set ✓' : 'Missing ✗');
      
      const transporter = createTransporter();
      
      const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Thank you for contacting Classic Carrry',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #8B7355 0%, #6B5744 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">Classic Carrry</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333;">Thank you for reaching out!</h2>
              <p style="color: #666; line-height: 1.6;">
                Hi ${name},
              </p>
              <p style="color: #666; line-height: 1.6;">
                We've received your message and our team will get back to you as soon as possible.
              </p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #8B7355; margin-top: 0;">Your Message:</h3>
                <p style="color: #666;"><strong>Subject:</strong> ${subject}</p>
                <p style="color: #666;"><strong>Message:</strong></p>
                <p style="color: #666; line-height: 1.6;">${message}</p>
              </div>
              <p style="color: #666; line-height: 1.6;">
                Best regards,<br>
                <strong>Classic Carrry Team</strong>
              </p>
            </div>
            <div style="background: #333; padding: 20px; text-align: center; color: white; font-size: 12px;">
              <p>© ${new Date().getFullYear()} Classic Carrry. All rights reserved.</p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(userMailOptions);
      console.log('✅ Confirmation email sent successfully to:', email);
    } catch (emailError) {
      console.error('❌ Error sending confirmation email:', emailError.message);
      console.error('Full error:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.',
      data: contact
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form'
    });
  }
};

// Get all contacts (Admin only)
export const getAllContacts = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Contact.countDocuments(query);

    res.json({
      success: true,
      data: contacts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts'
    });
  }
};

// Get single contact (Admin only)
export const getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Mark as read if it's new
    if (contact.status === 'new') {
      contact.status = 'read';
      await contact.save();
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact'
    });
  }
};

// Update contact status (Admin only)
export const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact status updated',
      data: contact
    });
  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact status'
    });
  }
};

// Reply to contact (Admin only)
export const replyToContact = async (req, res) => {
  try {
    const { replyMessage } = req.body;
    
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Send reply email
    try {
      const transporter = createTransporter();
      
      const replyMailOptions = {
        from: process.env.EMAIL_USER,
        to: contact.email,
        subject: `Re: ${contact.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #8B7355 0%, #6B5744 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">Classic Carrry</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333;">Response to your inquiry</h2>
              <p style="color: #666; line-height: 1.6;">
                Hi ${contact.name},
              </p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #666; line-height: 1.6;">${replyMessage}</p>
              </div>
              <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #999; font-size: 12px; margin: 0;"><strong>Your original message:</strong></p>
                <p style="color: #666; line-height: 1.6; margin: 10px 0 0 0;">${contact.message}</p>
              </div>
              <p style="color: #666; line-height: 1.6;">
                Best regards,<br>
                <strong>Classic Carrry Team</strong>
              </p>
            </div>
            <div style="background: #333; padding: 20px; text-align: center; color: white; font-size: 12px;">
              <p>© ${new Date().getFullYear()} Classic Carrry. All rights reserved.</p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(replyMailOptions);

      // Update contact
      contact.replied = true;
      contact.replyMessage = replyMessage;
      contact.repliedAt = new Date();
      contact.status = 'replied';
      await contact.save();

      res.json({
        success: true,
        message: 'Reply sent successfully',
        data: contact
      });
    } catch (emailError) {
      console.error('Error sending reply email:', emailError);
      res.status(500).json({
        success: false,
        message: 'Failed to send reply email'
      });
    }
  } catch (error) {
    console.error('Error replying to contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reply to contact'
    });
  }
};

// Delete contact (Admin only)
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact'
    });
  }
};

// Get contact statistics (Admin only)
export const getContactStats = async (req, res) => {
  try {
    const total = await Contact.countDocuments();
    const newCount = await Contact.countDocuments({ status: 'new' });
    const readCount = await Contact.countDocuments({ status: 'read' });
    const repliedCount = await Contact.countDocuments({ status: 'replied' });
    const archivedCount = await Contact.countDocuments({ status: 'archived' });

    res.json({
      success: true,
      data: {
        total,
        new: newCount,
        read: readCount,
        replied: repliedCount,
        archived: archivedCount
      }
    });
  } catch (error) {
    console.error('Error fetching contact stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact statistics'
    });
  }
};
