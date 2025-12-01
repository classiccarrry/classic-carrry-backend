// Email template for customer order confirmation
export const customerOrderConfirmation = (order) => {
  const itemsHTML = order.items.map(item => {
    let variantDetails = '';
    if (item.color || item.size) {
      const details = [];
      if (item.color) details.push(`Color: ${item.color}`);
      if (item.size) details.push(`Size: ${item.size}`);
      variantDetails = `<br><small style="color: #666;">${details.join(' | ')}</small>`;
    }
    
    return `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong>${variantDetails}<br>
        <small style="color: #888;">Quantity: ${item.quantity} × Rs ${item.price.toLocaleString()}</small>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        <strong>Rs ${(item.price * item.quantity).toLocaleString()}</strong>
      </td>
    </tr>
  `}).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #d2c1b6 0%, #b8a599 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: #fff; margin: 0; font-size: 28px;">✨ Classic Carrry</h1>
        <p style="color: #fff; margin: 10px 0 0 0; font-size: 16px;">Order Confirmation</p>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">Thank You for Your Order! 🎉</h2>
        
        <p>Dear <strong>${order.customer.firstName} ${order.customer.lastName}</strong>,</p>
        
        <p>Your order has been successfully placed and is being processed. Here are your order details:</p>
        
        <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="margin-top: 0; color: #d2c1b6;">Order Details</h3>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>

        <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="margin-top: 0; color: #d2c1b6;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${itemsHTML}
            <tr>
              <td style="padding: 10px; padding-top: 15px;"><strong>Subtotal:</strong></td>
              <td style="padding: 10px; padding-top: 15px; text-align: right;"><strong>Rs ${order.pricing.subtotal.toLocaleString()}</strong></td>
            </tr>
            <tr>
              <td style="padding: 10px;">Delivery Charge:</td>
              <td style="padding: 10px; text-align: right;">
                ${order.pricing.deliveryCharge === 0 
                  ? '<span style="color: #22c55e; font-weight: bold;">FREE 🎁</span>' 
                  : `Rs ${order.pricing.deliveryCharge.toLocaleString()}`
                }
              </td>
            </tr>
            <tr style="background: #f0f0f0;">
              <td style="padding: 15px; font-size: 18px;"><strong>Total:</strong></td>
              <td style="padding: 15px; text-align: right; font-size: 18px; color: #d2c1b6;"><strong>Rs ${order.pricing.total.toLocaleString()}</strong></td>
            </tr>
          </table>
        </div>

        <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="margin-top: 0; color: #d2c1b6;">Delivery Address</h3>
          <p style="margin: 5px 0;"><strong>${order.customer.firstName} ${order.customer.lastName}</strong></p>
          <p style="margin: 5px 0;">${order.customer.address}</p>
          <p style="margin: 5px 0;">${order.customer.city}, ${order.customer.province}</p>
          ${order.customer.postalCode ? `<p style="margin: 5px 0;">${order.customer.postalCode}</p>` : ''}
          <p style="margin: 5px 0;"><strong>Phone:</strong> ${order.customer.phone}</p>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
          <h4 style="margin: 0 0 10px 0; color: #22c55e;">📦 What Happens Next?</h4>
          <ol style="margin: 0; padding-left: 20px;">
            <li>We'll review and prepare your order (1-2 business days)</li>
            <li>Your order will be shipped to your address</li>
            <li>Delivery within 3-5 business days</li>
          </ol>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">Need help? Contact us:</p>
          <p style="margin: 10px 0;">
            <a href="mailto:classiccarrry@gmail.com" style="color: #d2c1b6; text-decoration: none;">📧 classiccarrry@gmail.com</a>
          </p>
          <p style="margin: 10px 0;">
            <a href="https://wa.me/923160928206" style="color: #d2c1b6; text-decoration: none;">📱 +92 316 092 8206</a>
          </p>
        </div>

        <div style="text-align: center; padding: 20px; border-top: 2px solid #eee; margin-top: 30px;">
          <p style="color: #999; font-size: 12px; margin: 5px 0;">
            This is an automated email. Please do not reply to this message.
          </p>
          <p style="color: #999; font-size: 12px; margin: 5px 0;">
            © ${new Date().getFullYear()} Classic Carrry. All rights reserved.
          </p>
          <p style="color: #999; font-size: 12px; margin: 5px 0;">
            Powered by <strong>AppCrafters</strong>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Email template for owner notification
export const ownerOrderNotification = (order) => {
  const itemsHTML = order.items.map(item => {
    let variantDetails = '';
    if (item.color || item.size) {
      const details = [];
      if (item.color) details.push(`<span style="background: #e0e7ff; padding: 2px 8px; border-radius: 4px; font-size: 11px;">Color: ${item.color}</span>`);
      if (item.size) details.push(`<span style="background: #fef3c7; padding: 2px 8px; border-radius: 4px; font-size: 11px;">Size: ${item.size}</span>`);
      variantDetails = `<br><div style="margin-top: 5px;">${details.join(' ')}</div>`;
    }
    
    return `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong>${variantDetails}
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">Rs ${item.price.toLocaleString()}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">Rs ${(item.price * item.quantity).toLocaleString()}</td>
    </tr>
  `}).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Received</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: #fff; margin: 0; font-size: 28px;">🔔 New Order Alert</h1>
        <p style="color: #fff; margin: 10px 0 0 0; font-size: 16px;">Classic Carrry Admin</p>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <div style="background: #22c55e; color: white; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 24px;">🎉 New Order Received!</h2>
        </div>

        <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="margin-top: 0; color: #3b82f6;">Order Information</h3>
          <table style="width: 100%;">
            <tr>
              <td style="padding: 8px; font-weight: bold; width: 150px;">Order Number:</td>
              <td style="padding: 8px; color: #d2c1b6; font-weight: bold; font-size: 18px;">${order.orderNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Order Date:</td>
              <td style="padding: 8px;">${new Date(order.createdAt).toLocaleString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Status:</td>
              <td style="padding: 8px;"><span style="background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">PENDING</span></td>
            </tr>
          </table>
        </div>

        <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="margin-top: 0; color: #3b82f6;">Customer Details</h3>
          <table style="width: 100%;">
            <tr>
              <td style="padding: 8px; font-weight: bold; width: 150px;">Name:</td>
              <td style="padding: 8px;">${order.customer.firstName} ${order.customer.lastName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Email:</td>
              <td style="padding: 8px;"><a href="mailto:${order.customer.email}" style="color: #3b82f6;">${order.customer.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Phone:</td>
              <td style="padding: 8px;"><a href="tel:${order.customer.phone}" style="color: #3b82f6;">${order.customer.phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; vertical-align: top;">Address:</td>
              <td style="padding: 8px;">
                ${order.customer.address}<br>
                ${order.customer.city}, ${order.customer.province}
                ${order.customer.postalCode ? `<br>${order.customer.postalCode}` : ''}
              </td>
            </tr>
            ${order.customer.deliveryNotes ? `
            <tr>
              <td style="padding: 8px; font-weight: bold; vertical-align: top;">Notes:</td>
              <td style="padding: 8px; background: #fef3c7; border-radius: 4px;">${order.customer.deliveryNotes}</td>
            </tr>
            ` : ''}
          </table>
        </div>

        <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="margin-top: 0; color: #3b82f6;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 10px; padding-top: 15px; text-align: right;"><strong>Subtotal:</strong></td>
                <td style="padding: 10px; padding-top: 15px; text-align: right;"><strong>Rs ${order.pricing.subtotal.toLocaleString()}</strong></td>
              </tr>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;">Delivery Charge:</td>
                <td style="padding: 10px; text-align: right;">
                  ${order.pricing.deliveryCharge === 0 
                    ? '<span style="color: #22c55e; font-weight: bold;">FREE</span>' 
                    : `Rs ${order.pricing.deliveryCharge.toLocaleString()}`
                  }
                </td>
              </tr>
              <tr style="background: #f3f4f6;">
                <td colspan="3" style="padding: 15px; text-align: right; font-size: 18px;"><strong>Grand Total:</strong></td>
                <td style="padding: 15px; text-align: right; font-size: 18px; color: #3b82f6;"><strong>Rs ${order.pricing.total.toLocaleString()}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h4 style="margin: 0 0 10px 0; color: #1e40af;">⚡ Action Required</h4>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Review the order details</li>
            <li>Verify product availability</li>
            <li>Prepare items for shipment</li>
            <li>Contact customer if needed</li>
            <li>Update order status in admin panel</li>
          </ul>
        </div>

        <div style="text-align: center; padding: 20px; border-top: 2px solid #eee; margin-top: 30px;">
          <p style="color: #999; font-size: 12px; margin: 5px 0;">
            This is an automated notification from Classic Carrry Order Management System
          </p>
          <p style="color: #999; font-size: 12px; margin: 5px 0;">
            © ${new Date().getFullYear()} Classic Carrry. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export default {
  customerOrderConfirmation,
  ownerOrderNotification
};
