import sgMail from '@sendgrid/mail';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (options) => {
  try {
    const msg = {
      to: options.to,
      from: {
        email: process.env.EMAIL_FROM,
        name: process.env.EMAIL_FROM_NAME || 'Classic Carrry'
      },
      subject: options.subject,
      html: options.html,
      text: options.text
    };

    const result = await sgMail.send(msg);
    console.log('✅ Email sent via SendGrid:', result[0].statusCode);
    return result;
  } catch (error) {
    console.error('❌ SendGrid error:', error.message);
    if (error.response) {
      console.error('Response body:', error.response.body);
    }
    throw error;
  }
};

export default { sendEmail };
