# 🚀 Backend Deployment Guide

Deploy Classic Carrry backend API to Render.

## Prerequisites

Before deploying, you need:

1. **MongoDB Atlas** - Free database
   - Sign up: https://www.mongodb.com/cloud/atlas
   - Create cluster
   - Create database user
   - Whitelist all IPs: `0.0.0.0/0`
   - Get connection string

2. **Cloudinary** - Free image storage
   - Sign up: https://cloudinary.com/
   - Get Cloud Name, API Key, API Secret from dashboard

3. **Gmail App Password** - For email notifications
   - Enable 2FA on Gmail
   - Generate App Password: https://myaccount.google.com/apppasswords
   - Save the 16-character password

## Deployment Steps

### 1. Push to GitHub

```bash
git add .
git commit -m "Backend ready for deployment"
git push origin main
```

### 2. Create Web Service on Render

1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Render will auto-detect `render.yaml`
5. Click **"Apply"**

### 3. Configure Environment Variables

In Render Dashboard → Your Service → Environment, add:

```env
# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database

# Authentication
JWT_SECRET=use_openssl_rand_base64_32_to_generate
JWT_EXPIRE=30d

# Frontend URLs (add after deploying frontends)
ADMIN_URL=https://your-admin.vercel.app
USER_URL=https://your-shop.vercel.app

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=Classic Carrry
OWNER_EMAIL=owner-email@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Deploy

- Click **"Create Web Service"** or **"Manual Deploy"**
- Wait for build to complete (2-3 minutes)
- Check logs for any errors
- Copy your backend URL

### 5. Test Backend

```bash
curl https://your-backend.onrender.com/
```

Should return:
```json
{
  "message": "Classic Carrry API",
  "version": "1.0.0"
}
```

### 6. Update Frontend URLs

After deploying admin panel and user website:

1. Go to Render Dashboard → Environment
2. Update:
   ```env
   ADMIN_URL=https://your-actual-admin.vercel.app
   USER_URL=https://your-actual-shop.vercel.app
   ```
3. Save (Render will auto-redeploy)

## Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT tokens | Random 32+ char string |
| `ADMIN_URL` | Admin panel URL | `https://admin.vercel.app` |
| `USER_URL` | User website URL | `https://shop.vercel.app` |
| `EMAIL_USER` | Gmail address | `your@gmail.com` |
| `EMAIL_PASS` | Gmail App Password | 16-character password |
| `CLOUDINARY_*` | Cloudinary credentials | From dashboard |

## Troubleshooting

### Build Fails

**Check logs in Render dashboard:**
- Verify all dependencies in `package.json`
- Check Node version compatibility
- Look for syntax errors

### Database Connection Error

```
Error: MongooseServerSelectionError
```

**Fix:**
- Verify MongoDB URI is correct
- Check network access allows `0.0.0.0/0`
- Verify database user credentials
- Ensure database name is in URI

### Email Not Sending

```
Error: Invalid login
```

**Fix:**
- Use Gmail App Password (not regular password)
- Verify 2FA is enabled on Gmail
- Check EMAIL_USER and EMAIL_PASS are correct
- Generate new App Password if needed

### CORS Errors

```
Access blocked by CORS policy
```

**Fix:**
- Verify ADMIN_URL and USER_URL are set
- Check URLs match exactly (no trailing slashes)
- Redeploy backend after updating URLs
- Check frontend URLs are correct

### Images Not Uploading

```
Error: Cloudinary upload failed
```

**Fix:**
- Verify Cloudinary credentials
- Check API key and secret are correct
- Verify cloud name matches dashboard
- Test credentials in Cloudinary dashboard

## Post-Deployment Checklist

- [ ] Backend is live and responding
- [ ] Database connected successfully
- [ ] Can create/read products
- [ ] Can create orders
- [ ] Email notifications working
- [ ] Image uploads working
- [ ] CORS allows both frontends
- [ ] No errors in Render logs

## Monitoring

### View Logs
- Render Dashboard → Your Service → Logs
- Monitor for errors and warnings

### Check Health
```bash
# Test API endpoint
curl https://your-backend.onrender.com/api/products

# Should return products list
```

### Performance
- Render free tier: Cold starts after 15 min inactivity
- First request may take 30-60 seconds
- Subsequent requests are fast

### ⚠️ Keep Free Tier Active
To prevent spin-down on Render's free tier, use a ping service:

**Recommended: UptimeRobot (Free)**
1. Sign up at https://uptimerobot.com/
2. Add HTTP(s) monitor
3. URL: `https://your-app.onrender.com/api/health`
4. Interval: 5 minutes

**See detailed guide**: `RENDER_KEEP_ALIVE.md`

This keeps your backend active 24/7 for free!

## Updating Backend

### Method 1: Auto-deploy (Recommended)
```bash
git push origin main
# Render auto-deploys
```

### Method 2: Manual deploy
- Render Dashboard → Manual Deploy

## Custom Domain (Optional)

1. Go to Render Dashboard → Settings
2. Add custom domain
3. Update DNS records as instructed
4. Update ADMIN_URL and USER_URL in frontends

## Support

- Render Docs: https://render.com/docs
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/
- Cloudinary: https://cloudinary.com/documentation

## Success! 🎉

Your backend is now live at: `https://your-service.onrender.com`

Next steps:
1. Deploy admin panel to Vercel
2. Deploy user website to Vercel
3. Update backend with frontend URLs
4. Test complete flow
