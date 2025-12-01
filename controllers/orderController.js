import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { sendEmail } from '../config/email.js';
import { customerOrderConfirmation, ownerOrderNotification } from '../utils/emailTemplates.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res) => {
  try {
    const { customer, items, pricing } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided'
      });
    }

    // Validate products exist and have stock
    for (const item of items) {
      const product = await Product.findOne({ id: item.productId });
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }
    }

    const order = await Order.create({
      customer,
      items,
      pricing
    });

    // Update product stock
    for (const item of items) {
      await Product.findOneAndUpdate(
        { id: item.productId },
        { $inc: { stock: -item.quantity } }
      );
    }

    // Send email notifications
    try {
      // Send confirmation email to customer
      await sendEmail({
        to: customer.email,
        subject: `Order Confirmation - ${order.orderNumber} | Classic Carrry`,
        html: customerOrderConfirmation(order)
      });

      // Send notification email to owner
      await sendEmail({
        to: process.env.OWNER_EMAIL || 'classiccarrry@gmail.com',
        subject: `🔔 New Order Received - ${order.orderNumber}`,
        html: ownerOrderNotification(order)
      });

      console.log('✅ Order confirmation emails sent successfully');
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError.message);
      // Don't fail the order creation if email fails
    }

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(query);

    res.json({
      success: true,
      count: orders.length,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public (with order number)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.id });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const order = await Order.findOne({ orderNumber: req.params.id });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Define status progression order
    const statusOrder = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const currentStatusIndex = statusOrder.indexOf(order.status);
    const newStatusIndex = statusOrder.indexOf(status);

    // Prevent reversing status (except for cancellation)
    if (status && status !== 'cancelled') {
      if (order.status === 'delivered') {
        return res.status(400).json({
          success: false,
          message: 'Cannot change status of delivered orders'
        });
      }
      if (order.status === 'cancelled') {
        return res.status(400).json({
          success: false,
          message: 'Cannot change status of cancelled orders'
        });
      }
      if (newStatusIndex < currentStatusIndex) {
        return res.status(400).json({
          success: false,
          message: 'Cannot reverse order status. Status can only move forward.'
        });
      }
    }

    const oldStatus = order.status;
    const oldPaymentStatus = order.paymentStatus;

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    // Send email notification if status changed
    if (status && status !== oldStatus) {
      try {
        const statusMessages = {
          processing: {
            subject: 'Order Processing',
            message: 'Your order is now being processed and will be shipped soon.'
          },
          shipped: {
            subject: 'Order Shipped',
            message: 'Great news! Your order has been shipped and is on its way to you.'
          },
          delivered: {
            subject: 'Order Delivered',
            message: 'Your order has been successfully delivered. Thank you for shopping with us!'
          },
          cancelled: {
            subject: 'Order Cancelled',
            message: 'Your order has been cancelled. If you have any questions, please contact us.'
          }
        };

        const statusInfo = statusMessages[status];
        if (statusInfo) {
          await sendEmail({
            to: order.customer.email,
            subject: `${statusInfo.subject} - Order #${order.orderNumber} | Classic Carrry`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
                <div style="background: linear-gradient(135deg, #8B7355 0%, #A68A6F 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 28px;">Classic Carrry</h1>
                </div>
                
                <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <h2 style="color: #2C2C2C; margin-bottom: 20px;">${statusInfo.subject}</h2>
                  
                  <p style="color: #6B7280; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                    Hello ${order.customer.firstName},
                  </p>
                  
                  <p style="color: #6B7280; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                    ${statusInfo.message}
                  </p>
                  
                  <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="color: #2C2C2C; margin-bottom: 15px;">Order Details</h3>
                    <p style="color: #6B7280; margin: 5px 0;"><strong>Order Number:</strong> ${order.orderNumber}</p>
                    <p style="color: #6B7280; margin: 5px 0;"><strong>Status:</strong> <span style="color: #8B7355; font-weight: bold;">${status.toUpperCase()}</span></p>
                    <p style="color: #6B7280; margin: 5px 0;"><strong>Total Amount:</strong> Rs ${order.pricing.total.toLocaleString()}</p>
                  </div>
                  
                  <div style="text-align: center; margin-top: 30px;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/profile" 
                       style="background: linear-gradient(135deg, #8B7355 0%, #A68A6F 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                      View Order Details
                    </a>
                  </div>
                  
                  <p style="color: #9CA3AF; font-size: 14px; margin-top: 30px; text-align: center;">
                    If you have any questions, contact us at classiccarrry@gmail.com
                  </p>
                </div>
              </div>
            `
          });
          console.log(`✅ Status update email sent to ${order.customer.email}`);
        }
      } catch (emailError) {
        console.error('❌ Failed to send status update email:', emailError.message);
        // Don't fail the status update if email fails
      }
    }

    res.json({
      success: true,
      data: order,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'customer.email': req.user.email })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
