# Classic Carrry Backend API

Backend API for Classic Carrry e-commerce platform built with Node.js, Express, and MongoDB.

## 🚀 Features

- 🔐 JWT Authentication & Authorization
- 👤 User Management (Admin & Customer roles)
- 🛍️ Product Management (CRUD operations)
- 📦 Order Management & Tracking
- 🏷️ Category Management
- 🎨 Hero Image Carousel
- 🎫 Coupon System
- ⚙️ Site Settings (Contact, FAQs, Appearance)
- 📧 Email Notifications (Order confirmations, status updates)
- 🖼️ Image Upload (Cloudinary integration)
- 🔒 Security (Helmet, CORS, Rate limiting)

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **SendGrid** - Email service (Web API)
- **Bcrypt** - Password hashing

## 📁 Project Structure

```
backend/
├── config/          # Database, Cloudinary, Email config
├── controllers/     # Business logic
├── middleware/      # Auth, error handling
├── models/          # MongoDB schemas
├── routes/          # API endpoints
├── utils/           # Helper functions
├── server.js        # Entry point
├── package.json     # Dependencies
└── render.yaml      # Render deployment config
```

## 💻 Local Development

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account
- SendGrid account (free tier)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables:**
   ```env
   NODE_ENV=development
   PORT=5000
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/classiccarrry
   
   # JWT
   JWT_SECRET=your_secret_key
   JWT_EXPIRE=30d
   
   # Frontend URLs (for CORS)
   ADMIN_URL=http://localhost:5173
   USER_URL=http://localhost:5174
   
   # SendGrid Email
   SENDGRID_API_KEY=SG.your-sendgrid-api-key
   EMAIL_FROM=your-verified-email@gmail.com
   EMAIL_FROM_NAME=Classic Carrry
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Start server:**
   ```bash
   npm start
   ```

Server runs on: `http://localhost:5000`

## 📝 API Endpoints

### Authentication & Users
```
POST   /api/users/register      - Register new user
POST   /api/users/login         - Login user
GET    /api/users/profile       - Get user profile (Protected)
PUT    /api/users/profile       - Update profile (Protected)
GET    /api/users               - Get all users (Admin)
DELETE /api/users/:id           - Delete user (Admin)
```

### Products
```
GET    /api/products            - Get all products
GET    /api/products/:id        - Get single product
POST   /api/products            - Create product (Admin)
PUT    /api/products/:id        - Update product (Admin)
DELETE /api/products/:id        - Delete product (Admin)
```

### Orders
```
POST   /api/orders              - Create new order
GET    /api/orders              - Get all orders (Admin)
GET    /api/orders/:id          - Get order by ID
PUT    /api/orders/:id          - Update order status (Admin)
```

### Categories
```
GET    /api/categories          - Get all categories
POST   /api/categories          - Create category (Admin)
PUT    /api/categories/:id      - Update category (Admin)
DELETE /api/categories/:id      - Delete category (Admin)
```

### Hero Images
```
GET    /api/hero-images         - Get active hero images
GET    /api/hero-images/admin   - Get all hero images (Admin)
POST   /api/hero-images         - Create hero image (Admin)
PUT    /api/hero-images/:id     - Update hero image (Admin)
DELETE /api/hero-images/:id     - Delete hero image (Admin)
```

### Coupons
```
GET    /api/coupons             - Get all coupons (Admin)
POST   /api/coupons             - Create coupon (Admin)
PUT    /api/coupons/:id         - Update coupon (Admin)
DELETE /api/coupons/:id         - Delete coupon (Admin)
```

### Settings
```
GET    /api/settings/contact    - Get contact info
PUT    /api/settings/contact    - Update contact info (Admin)
GET    /api/settings/faqs       - Get FAQs
POST   /api/settings/faqs       - Create FAQ (Admin)
PUT    /api/settings/faqs/:id   - Update FAQ (Admin)
DELETE /api/settings/faqs/:id   - Delete FAQ (Admin)
```

### Contacts
```
POST   /api/contacts            - Submit contact form
GET    /api/contacts            - Get all contacts (Admin)
PUT    /api/contacts/:id        - Update contact status (Admin)
```

### Upload
```
POST   /api/upload              - Upload image (Admin)
```

## 🔒 Authentication

Protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## 🌐 CORS Configuration

Backend accepts requests from:
- Admin Panel: `ADMIN_URL`
- User Website: `USER_URL`
- Local development: `localhost:5173`, `localhost:5174`

## 📧 Email Notifications

**Using SendGrid Web API** (HTTPS - works on all hosting platforms)

Automatic emails sent for:
- Order confirmation (to customer)
- Order status updates
- Contact form submissions
- Admin replies to contacts

**Setup:**
1. Sign up at https://sendgrid.com (free - 100 emails/day)
2. Create API key with Mail Send permission
3. Verify sender email in SendGrid
4. Add `SENDGRID_API_KEY` to environment variables

## 🖼️ Image Storage

- **Production:** Cloudinary (cloud storage)
- **Development:** Local uploads folder

## 🔐 Security Features

- JWT authentication
- Password hashing with bcryptjs
- Rate limiting
- Helmet.js security headers
- CORS configuration
- Input validation

## 🚀 Deployment on Render

### Quick Deploy

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy backend"
   git push
   ```

2. **Create Render Service:**
   - Go to https://dashboard.render.com/
   - New → Web Service
   - Connect GitHub repo
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`

3. **Add Environment Variables:**
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your-mongodb-atlas-uri
   JWT_SECRET=your-secret-key
   JWT_EXPIRE=30d
   SENDGRID_API_KEY=SG.your-api-key
   EMAIL_FROM=your-verified-email@gmail.com
   EMAIL_FROM_NAME=Classic Carrry
   ADMIN_URL=https://your-admin.vercel.app
   USER_URL=https://www.classiccarrry.com
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Deploy!**

**Important:** If using custom domain, add it to `USER_URL` and `ADMIN_URL` to fix CORS.

See [SENDGRID_RENDER_SETUP.md](../SENDGRID_RENDER_SETUP.md) for detailed email setup.

## 📞 Support

For issues or questions: classiccarrry@gmail.com

## 📄 License

MIT
