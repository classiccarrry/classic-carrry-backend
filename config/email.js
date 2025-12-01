import pkg from 'nodemailer';
const { createTransport } = pkg;

// Create reusable transporter
const createTransporter = () => {
  // For development, use Ethereal (fake SMTP service)
  // For production, use real SMTP service (Gmail, SendGrid, etc.)
  
  if (process.env.NODE_ENV === 'production') {
    // Production: Use real SMTP service
    return createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Development: Use Gmail or Ethereal for testing
    // For Gmail, enable "Less secure app access" or use App Password
    return createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
};

export const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    throw error;
  }
};

export default { sendEmail };
